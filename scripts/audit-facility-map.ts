import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { createClient } from '@supabase/supabase-js';

import { geocodeAddress, GEOCODING_ERROR_MESSAGES } from '../src/lib/geocoding/yahoo';

type MatchMode = 'known-id' | 'exact-name' | 'normalized-name' | 'missing';
type AuditIssue = 'missing' | 'rename-needed' | 'address-mismatch' | 'pin-mismatch';
type GeocodeStatus = 'ok' | 'skipped' | 'error';
type AddressMatchStatus = 'match' | 'mismatch' | 'not-checked';
type SqlDatasetName = 'seed' | 'deploy';

type AccessRow = {
  location_address: string;
  lat: number;
  lng: number;
};

type FacilityRow = {
  id: number;
  name: string;
  corporation: string | null;
  postal_code: string | null;
  phone: string | null;
  prefecture: string;
  city: string;
  address_detail: string;
  facility_access: AccessRow | AccessRow[] | null;
};

type NormalizedFacility = {
  id: number;
  name: string;
  corporation: string | null;
  postalCode: string | null;
  phone: string | null;
  prefecture: string;
  city: string;
  addressDetail: string;
  fullAddress: string;
  locationAddress: string;
  lat: number | null;
  lng: number | null;
};

type GeocodeResult = {
  status: GeocodeStatus;
  lat?: number;
  lng?: number;
  matchedAddress?: string;
  error?: string;
};

type AddressCheck = {
  currentAddress: string | null;
  canonicalAddress: string;
  geocodeMatchedAddress: string | null;
  currentVsCanonical: AddressMatchStatus;
  geocodeVsCanonical: AddressMatchStatus;
};

type AuditRecord = {
  facilityId: number;
  canonicalName: string;
  matchMode: MatchMode;
  issues: AuditIssue[];
  canonicalAddress: string;
  currentRecord: NormalizedFacility | null;
  addressCheck: AddressCheck;
  geocode: GeocodeResult;
  distanceMeters: number | null;
};

type SqlSyncRecord = {
  facilityId: number;
  facilityName: string;
  status: 'match' | 'missing-in-deploy' | 'extra-in-deploy' | 'mismatch';
  mismatchedFields: string[];
};

type SqlSnapshot = {
  facilities: NormalizedFacility[];
  insertFiles: string[];
  updateFiles: string[];
};

const REPORT_PATH = join(process.cwd(), 'scripts', 'output', 'facility-map-audit-report.json');
const GEO_DIFF_THRESHOLD_METERS = 80;
const SQL_DIRECTORIES: Record<SqlDatasetName, string> = {
  seed: 'supabase/seeds',
  deploy: 'supabase/deploy',
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません`);
  }
  return value;
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, '').trim();
}

function normalizeAddress(value: string | null | undefined): string {
  return normalizeText(value)
    .replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
    .replace(/番地/g, '-')
    .replace(/番/g, '-')
    .replace(/号/g, '')
    .replace(/丁目/g, '-')
    .replace(/--+/g, '-')
    .replace(/-$/g, '');
}

function toAccessRow(access: FacilityRow['facility_access']): AccessRow | null {
  if (!access) return null;
  if (Array.isArray(access)) {
    return access[0] ?? null;
  }
  return access;
}

function normalizeFacility(row: FacilityRow): NormalizedFacility {
  const access = toAccessRow(row.facility_access);
  const normalizedCity = row.city.trim();
  const normalizedAddressDetail = row.address_detail.trim();

  return {
    id: row.id,
    name: row.name,
    corporation: row.corporation,
    postalCode: row.postal_code,
    phone: row.phone,
    prefecture: row.prefecture.trim(),
    city: normalizedCity,
    addressDetail: normalizedAddressDetail,
    fullAddress: `${row.prefecture.trim()}${normalizedCity}${normalizedAddressDetail}`,
    locationAddress: access?.location_address ?? `${row.prefecture.trim()}${normalizedCity}${normalizedAddressDetail}`,
    lat: typeof access?.lat === 'number' && access.lat !== 0 ? access.lat : null,
    lng: typeof access?.lng === 'number' && access.lng !== 0 ? access.lng : null,
  };
}

function listSqlFiles(dataset: SqlDatasetName): { insertFiles: string[]; updateFiles: string[] } {
  const directory = join(process.cwd(), SQL_DIRECTORIES[dataset]);
  const fileNames = readdirSync(directory).sort();

  const insertFiles = fileNames
    .filter(
      (fileName) =>
        /^\d+_insert_.*\.sql$/i.test(fileName) &&
        !fileName.includes('facility_types') &&
        !fileName.includes('facility_facility_types') &&
        !fileName.includes('reset_sequence'),
    )
    .map((fileName) => join(SQL_DIRECTORIES[dataset], fileName));

  const updateFiles = fileNames
    .filter((fileName) => /^\d+_update_.*_facility\.sql$/i.test(fileName))
    .map((fileName) => join(SQL_DIRECTORIES[dataset], fileName));

  return { insertFiles, updateFiles };
}

function readSqlFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), 'utf-8');
}

function parseInsertFacilitiesFromSql(sql: string): NormalizedFacility[] {
  const facilities: NormalizedFacility[] = [];
  const hasPhoneColumn = /,\s*phone,\s*/i.test(sql);
  const tupleRegex = hasPhoneColumn
    ? /\((\d+),\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*(\d+),\s*'[^']*'\)/g
    : /\((\d+),\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'[^']*'\)/g;

  for (const match of sql.matchAll(tupleRegex)) {
    let id = '';
    let name = '';
    let corporation = '';
    let postalCode = '';
    let phone: string | null = null;
    let prefecture = '';
    let city = '';
    let addressDetail = '';

    if (hasPhoneColumn) {
      [, id, name, corporation, postalCode, phone, prefecture, city, addressDetail] = match;
    } else {
      [, id, name, corporation, postalCode, prefecture, city, addressDetail] = match;
    }

    const normalizedPrefecture = prefecture.trim();
    const normalizedCity = city.trim();
    const normalizedAddressDetail = addressDetail.trim();

    facilities.push({
      id: Number(id),
      name: name.replace(/''/g, "'"),
      corporation: corporation.replace(/''/g, "'"),
      postalCode: postalCode.replace(/''/g, "'"),
      phone: phone ? phone.replace(/''/g, "'") : null,
      prefecture: normalizedPrefecture,
      city: normalizedCity,
      addressDetail: normalizedAddressDetail,
      fullAddress: `${normalizedPrefecture}${normalizedCity}${normalizedAddressDetail}`,
      locationAddress: `${normalizedPrefecture}${normalizedCity}${normalizedAddressDetail}`,
      lat: null,
      lng: null,
    });
  }

  return facilities;
}

function parseAccessUpdatesFromSql(sql: string): Map<number, AccessRow> {
  const accessById = new Map<number, AccessRow>();
  const updateRegex =
    /UPDATE public\.facility_access\s+SET\s+location_address = '((?:''|[^'])*)',\s+lat = (-?[0-9.]+),\s+lng = (-?[0-9.]+)\s+WHERE facility_id = (\d+);/g;

  for (const match of sql.matchAll(updateRegex)) {
    const [, locationAddress, lat, lng, facilityId] = match;
    accessById.set(Number(facilityId), {
      location_address: locationAddress.replace(/''/g, "'"),
      lat: Number(lat),
      lng: Number(lng),
    });
  }

  return accessById;
}

function fetchFacilitiesFromSql(dataset: SqlDatasetName): SqlSnapshot {
  const { insertFiles, updateFiles } = listSqlFiles(dataset);
  const facilities = insertFiles.flatMap((path) => parseInsertFacilitiesFromSql(readSqlFile(path)));
  const accessById = new Map<number, AccessRow>();

  for (const path of updateFiles) {
    const parsed = parseAccessUpdatesFromSql(readSqlFile(path));
    for (const [facilityId, access] of parsed.entries()) {
      accessById.set(facilityId, access);
    }
  }

  return {
    facilities: facilities
      .map((facility) => {
        const access = accessById.get(facility.id);
        return {
          ...facility,
          locationAddress: access?.location_address ?? facility.locationAddress,
          lat: access?.lat ?? facility.lat,
          lng: access?.lng ?? facility.lng,
        };
      })
      .sort((left, right) => left.id - right.id),
    insertFiles,
    updateFiles,
  };
}

async function fetchFacilitiesFromSupabase(): Promise<NormalizedFacility[]> {
  const supabase = createClient(
    getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  );

  const { data, error } = await supabase
    .from('facilities')
    .select(
      `
        id,
        name,
        corporation,
        postal_code,
        phone,
        prefecture,
        city,
        address_detail,
        facility_access (
          location_address,
          lat,
          lng
        )
      `,
    )
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`施設データの取得に失敗しました: ${error.message}`);
  }

  return ((data ?? []) as FacilityRow[]).map(normalizeFacility);
}

function findMatch(
  canonical: NormalizedFacility,
  facilities: NormalizedFacility[],
): { facility: NormalizedFacility | null; matchMode: MatchMode } {
  const byId = facilities.find((facility) => facility.id === canonical.id);
  if (byId) {
    return { facility: byId, matchMode: 'known-id' };
  }

  const byExactName = facilities.find((facility) => facility.name === canonical.name);
  if (byExactName) {
    return { facility: byExactName, matchMode: 'exact-name' };
  }

  const normalizedCanonicalName = normalizeText(canonical.name);
  const byNormalizedName = facilities.find(
    (facility) => normalizeText(facility.name) === normalizedCanonicalName,
  );
  if (byNormalizedName) {
    return { facility: byNormalizedName, matchMode: 'normalized-name' };
  }

  return { facility: null, matchMode: 'missing' };
}

function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusMeters = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeCanonicalAddress(address: string): Promise<GeocodeResult> {
  if (!process.env.YAHOO_GEOCODING_APP_ID) {
    return {
      status: 'skipped',
      error: GEOCODING_ERROR_MESSAGES.MISSING_APP_ID,
    };
  }

  try {
    const coordinates = await geocodeAddress(address);
    const params = new URLSearchParams({
      appid: process.env.YAHOO_GEOCODING_APP_ID,
      query: address,
      output: 'json',
    });
    const response = await fetch(`https://map.yahooapis.jp/geocode/V2/geoCoder?${params.toString()}`);
    const data = await response.json();
    const matchedAddress =
      typeof data?.Feature?.[0]?.Property?.Address === 'string'
        ? data.Feature[0].Property.Address
        : undefined;

    return {
      status: 'ok',
      lat: coordinates.lat,
      lng: coordinates.lng,
      matchedAddress,
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : '不明なジオコーディングエラー',
    };
  }
}

function detectIssues(
  canonical: NormalizedFacility,
  currentRecord: NormalizedFacility | null,
  geocode: GeocodeResult,
): { issues: AuditIssue[]; distanceMeters: number | null; addressCheck: AddressCheck } {
  const issues: AuditIssue[] = [];
  let distanceMeters: number | null = null;
  const canonicalAddress = normalizeAddress(canonical.fullAddress);
  const currentAddress = currentRecord ? normalizeAddress(currentRecord.fullAddress) : null;
  const currentLocationAddress = currentRecord
    ? normalizeAddress(currentRecord.locationAddress)
    : null;
  const geocodeMatchedAddress = geocode.matchedAddress
    ? normalizeAddress(geocode.matchedAddress)
    : null;

  const addressCheck: AddressCheck = {
    currentAddress: currentRecord?.fullAddress ?? null,
    canonicalAddress: canonical.fullAddress,
    geocodeMatchedAddress: geocode.matchedAddress ?? null,
    currentVsCanonical: currentAddress
      ? currentAddress === canonicalAddress && currentLocationAddress === canonicalAddress
        ? 'match'
        : 'mismatch'
      : 'not-checked',
    geocodeVsCanonical: geocodeMatchedAddress
      ? geocodeMatchedAddress === canonicalAddress
        ? 'match'
        : 'mismatch'
      : 'not-checked',
  };

  if (!currentRecord) {
    issues.push('missing');
    return { issues, distanceMeters, addressCheck };
  }

  if (normalizeText(currentRecord.name) !== normalizeText(canonical.name)) {
    issues.push('rename-needed');
  }

  if (currentAddress !== canonicalAddress || currentLocationAddress !== canonicalAddress) {
    issues.push('address-mismatch');
  }

  if (
    geocode.status === 'ok' &&
    currentRecord.lat !== null &&
    currentRecord.lng !== null &&
    geocode.lat !== undefined &&
    geocode.lng !== undefined
  ) {
    distanceMeters = haversineDistanceMeters(
      currentRecord.lat,
      currentRecord.lng,
      geocode.lat,
      geocode.lng,
    );

    if (distanceMeters > GEO_DIFF_THRESHOLD_METERS) {
      issues.push('pin-mismatch');
    }
  }

  return { issues, distanceMeters, addressCheck };
}

function compareSqlSnapshots(seedSnapshot: SqlSnapshot, deploySnapshot: SqlSnapshot): SqlSyncRecord[] {
  const deployById = new Map(deploySnapshot.facilities.map((facility) => [facility.id, facility]));
  const comparedIds = new Set<number>();
  const records: SqlSyncRecord[] = [];

  for (const seedFacility of seedSnapshot.facilities) {
    const deployFacility = deployById.get(seedFacility.id);
    comparedIds.add(seedFacility.id);

    if (!deployFacility) {
      records.push({
        facilityId: seedFacility.id,
        facilityName: seedFacility.name,
        status: 'missing-in-deploy',
        mismatchedFields: [],
      });
      continue;
    }

    const mismatchedFields = [
      ['name', seedFacility.name, deployFacility.name],
      ['corporation', seedFacility.corporation, deployFacility.corporation],
      ['postalCode', seedFacility.postalCode, deployFacility.postalCode],
      ['prefecture', seedFacility.prefecture, deployFacility.prefecture],
      ['city', seedFacility.city, deployFacility.city],
      ['addressDetail', seedFacility.addressDetail, deployFacility.addressDetail],
      ['locationAddress', seedFacility.locationAddress, deployFacility.locationAddress],
      ['lat', seedFacility.lat, deployFacility.lat],
      ['lng', seedFacility.lng, deployFacility.lng],
    ]
      .filter(([, left, right]) => left !== right)
      .map(([field]) => field);

    records.push({
      facilityId: seedFacility.id,
      facilityName: seedFacility.name,
      status: mismatchedFields.length === 0 ? 'match' : 'mismatch',
      mismatchedFields,
    });
  }

  for (const deployFacility of deploySnapshot.facilities) {
    if (comparedIds.has(deployFacility.id)) {
      continue;
    }

    records.push({
      facilityId: deployFacility.id,
      facilityName: deployFacility.name,
      status: 'extra-in-deploy',
      mismatchedFields: [],
    });
  }

  return records.sort((left, right) => left.facilityId - right.facilityId);
}

function printSummary(records: AuditRecord[], sqlSyncRecords: SqlSyncRecord[]): void {
  const issueCounts = records.reduce<Record<AuditIssue, number>>(
    (counts, record) => {
      for (const issue of record.issues) {
        counts[issue] += 1;
      }
      return counts;
    },
    {
      missing: 0,
      'rename-needed': 0,
      'address-mismatch': 0,
      'pin-mismatch': 0,
    },
  );

  console.table({
    facilities: records.length,
    with_issues: records.filter((record) => record.issues.length > 0).length,
    missing: issueCounts.missing,
    rename_needed: issueCounts['rename-needed'],
    address_mismatch: issueCounts['address-mismatch'],
    pin_mismatch: issueCounts['pin-mismatch'],
    deploy_mismatch: sqlSyncRecords.filter((record) => record.status !== 'match').length,
  });
}

async function main(): Promise<void> {
  const seedSnapshot = fetchFacilitiesFromSql('seed');
  const deploySnapshot = fetchFacilitiesFromSql('deploy');
  const sqlSyncRecords = compareSqlSnapshots(seedSnapshot, deploySnapshot);

  const forceSeedSql = process.env.AUDIT_FACILITY_SOURCE === 'seed';
  let facilitiesSource: 'live-supabase' | 'seed-sql-fallback' = forceSeedSql
    ? 'seed-sql-fallback'
    : 'live-supabase';
  let currentFacilities: NormalizedFacility[];

  if (forceSeedSql) {
    currentFacilities = seedSnapshot.facilities;
  } else {
    try {
      currentFacilities = await fetchFacilitiesFromSupabase();
    } catch (error) {
      console.warn(
        `live Supabaseの取得に失敗したため、seed SQL をフォールバックとして使用します: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      );
      facilitiesSource = 'seed-sql-fallback';
      currentFacilities = seedSnapshot.facilities;
    }
  }

  const requestedPrefecturesRaw = process.env.AUDIT_FACILITY_PREFECTURES;
  const requestedPrefectures = normalizeText(requestedPrefecturesRaw)
    ? (requestedPrefecturesRaw ?? '')
        .split(',')
        .map((prefecture) => prefecture.trim())
        .filter(Boolean)
    : [];

  const canonicalFacilities =
    requestedPrefectures.length === 0
      ? seedSnapshot.facilities
      : seedSnapshot.facilities.filter((facility) =>
          requestedPrefectures.includes(facility.prefecture),
        );

  const records: AuditRecord[] = [];

  for (const canonicalFacility of canonicalFacilities) {
    const { facility, matchMode } = findMatch(canonicalFacility, currentFacilities);
    const geocode = await geocodeCanonicalAddress(canonicalFacility.fullAddress);
    const { issues, distanceMeters, addressCheck } = detectIssues(
      canonicalFacility,
      facility,
      geocode,
    );

    records.push({
      facilityId: canonicalFacility.id,
      canonicalName: canonicalFacility.name,
      matchMode,
      issues,
      canonicalAddress: canonicalFacility.fullAddress,
      currentRecord: facility,
      addressCheck,
      geocode,
      distanceMeters,
    });
  }

  mkdirSync(join(process.cwd(), 'scripts', 'output'), { recursive: true });
  writeFileSync(
    REPORT_PATH,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        facilitiesSource,
        thresholdMeters: GEO_DIFF_THRESHOLD_METERS,
        prefectures:
          requestedPrefectures.length === 0
            ? [...new Set(seedSnapshot.facilities.map((facility) => facility.prefecture))]
            : requestedPrefectures,
        sqlSync: {
          seedInsertFiles: seedSnapshot.insertFiles,
          seedUpdateFiles: seedSnapshot.updateFiles,
          deployInsertFiles: deploySnapshot.insertFiles,
          deployUpdateFiles: deploySnapshot.updateFiles,
          records: sqlSyncRecords,
        },
        records,
      },
      null,
      2,
    )}\n`,
    'utf-8',
  );

  printSummary(records, sqlSyncRecords);
  console.log(`JSONレポートを出力しました: ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error('facility map audit に失敗しました:', error);
  process.exit(1);
});
