import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { createClient } from '@supabase/supabase-js';

import { geocodeAddress, GEOCODING_ERROR_MESSAGES } from '../src/lib/geocoding/yahoo';
import {
  PRIORITY_FACILITY_TARGETS,
  type PriorityFacilityAction,
  type PriorityFacilityTarget,
} from './facility-map-priority-targets';

type MatchMode = 'known-id' | 'exact-name' | 'alias' | 'missing';
type AuditIssue = 'missing' | 'rename-needed' | 'address-mismatch' | 'pin-mismatch';
type GeocodeStatus = 'ok' | 'skipped' | 'error';

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

type AddressMatchStatus = 'match' | 'mismatch' | 'not-checked';

type AddressCheck = {
  currentAddress: string | null;
  canonicalAddress: string;
  geocodeMatchedAddress: string | null;
  currentVsCanonical: AddressMatchStatus;
  geocodeVsCanonical: AddressMatchStatus;
};

type AuditRecord = {
  canonicalName: string;
  matchMode: MatchMode;
  expectedActions: PriorityFacilityAction[];
  issues: AuditIssue[];
  canonicalAddress: string;
  currentRecord: NormalizedFacility | null;
  addressCheck: AddressCheck;
  geocode: GeocodeResult;
  distanceMeters: number | null;
};

const REPORT_PATH = join(process.cwd(), 'scripts', 'output', 'facility-map-priority-report.json');
const GEO_DIFF_THRESHOLD_METERS = 80;
const TARGET_PREFECTURES = ['大阪府', '兵庫県', '京都府', '和歌山県'];
const INSERT_SQL_FILES = [
  'supabase/seeds/02_insert_hyogo_facility.sql',
  'supabase/seeds/03_insert_osaka_facility.sql',
  'supabase/seeds/06_insert_wakayama_facility.sql',
  'supabase/seeds/07_insert_kyoto_facility.sql',
];
const UPDATE_SQL_FILES = [
  'supabase/seeds/09_update_hyogo_facility.sql',
  'supabase/seeds/10_update_osaka_facility.sql',
  'supabase/seeds/13_update_wakayama_facility.sql',
  'supabase/seeds/14_update_kyoto_facility.sql',
];

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
    .replace(/番地/g, '-')
    .replace(/番/g, '-')
    .replace(/号/g, '')
    .replace(/丁目/g, '-')
    .replace(/--+/g, '-');
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

  return {
    id: row.id,
    name: row.name,
    corporation: row.corporation,
    postalCode: row.postal_code,
    phone: row.phone,
    fullAddress: `${row.prefecture}${row.city}${row.address_detail}`,
    locationAddress: access?.location_address ?? `${row.prefecture}${row.city}${row.address_detail}`,
    lat: typeof access?.lat === 'number' && access.lat !== 0 ? access.lat : null,
    lng: typeof access?.lng === 'number' && access.lng !== 0 ? access.lng : null,
  };
}

async function fetchFacilities(): Promise<NormalizedFacility[]> {
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
    .in('prefecture', TARGET_PREFECTURES)
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`施設データの取得に失敗しました: ${error.message}`);
  }

  return ((data ?? []) as FacilityRow[]).map(normalizeFacility);
}

function readSqlFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), 'utf-8');
}

function parseInsertFacilitiesFromSql(sql: string): NormalizedFacility[] {
  const facilities: NormalizedFacility[] = [];
  const tupleRegex =
    /\((\d+),\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*(\d+),\s*'[^']*'\)/g;

  for (const match of sql.matchAll(tupleRegex)) {
    const [, id, name, corporation, postalCode, phone, prefecture, city, addressDetail] = match;
    facilities.push({
      id: Number(id),
      name,
      corporation,
      postalCode,
      phone,
      fullAddress: `${prefecture}${city}${addressDetail}`,
      locationAddress: `${prefecture}${city}${addressDetail}`,
      lat: null,
      lng: null,
    });
  }

  return facilities;
}

function parseAccessUpdatesFromSql(sql: string): Map<number, AccessRow> {
  const accessById = new Map<number, AccessRow>();
  const updateRegex =
    /UPDATE public\.facility_access\s+SET\s+location_address = '([^']*)',\s+lat = ([0-9.]+),\s+lng = ([0-9.]+)\s+WHERE facility_id = (\d+);/g;

  for (const match of sql.matchAll(updateRegex)) {
    const [, locationAddress, lat, lng, facilityId] = match;
    accessById.set(Number(facilityId), {
      location_address: locationAddress,
      lat: Number(lat),
      lng: Number(lng),
    });
  }

  return accessById;
}

function fetchFacilitiesFromSeedSql(): NormalizedFacility[] {
  const facilities = INSERT_SQL_FILES.flatMap((path) => parseInsertFacilitiesFromSql(readSqlFile(path)));
  const accessById = new Map<number, AccessRow>();

  for (const path of UPDATE_SQL_FILES) {
    const parsed = parseAccessUpdatesFromSql(readSqlFile(path));
    for (const [facilityId, access] of parsed.entries()) {
      accessById.set(facilityId, access);
    }
  }

  return facilities
    .filter((facility) =>
      TARGET_PREFECTURES.some((prefecture) => facility.fullAddress.startsWith(prefecture)),
    )
    .map((facility) => {
      const access = accessById.get(facility.id);
      return {
        ...facility,
        locationAddress: access?.location_address ?? facility.locationAddress,
        lat: access?.lat ?? facility.lat,
        lng: access?.lng ?? facility.lng,
      };
    });
}

function findMatch(
  target: PriorityFacilityTarget,
  facilities: NormalizedFacility[],
): { facility: NormalizedFacility | null; matchMode: MatchMode } {
  if (target.knownId !== undefined) {
    const byId = facilities.find((facility) => facility.id === target.knownId);
    if (byId) {
      return { facility: byId, matchMode: 'known-id' };
    }
  }

  const byExactName = facilities.find((facility) => facility.name === target.canonicalName);
  if (byExactName) {
    return { facility: byExactName, matchMode: 'exact-name' };
  }

  const aliases = new Set(target.aliases);
  const byAlias = facilities.find((facility) => aliases.has(facility.name));
  if (byAlias) {
    return { facility: byAlias, matchMode: 'alias' };
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
  target: PriorityFacilityTarget,
  currentRecord: NormalizedFacility | null,
  geocode: GeocodeResult,
): { issues: AuditIssue[]; distanceMeters: number | null; addressCheck: AddressCheck } {
  const issues: AuditIssue[] = [];
  let distanceMeters: number | null = null;
  const canonicalAddress = normalizeAddress(target.canonicalAddress);
  const currentAddress = currentRecord ? normalizeAddress(currentRecord.fullAddress) : null;
  const geocodeMatchedAddress = geocode.matchedAddress
    ? normalizeAddress(geocode.matchedAddress)
    : null;

  const addressCheck: AddressCheck = {
    currentAddress: currentRecord?.fullAddress ?? null,
    canonicalAddress: target.canonicalAddress,
    geocodeMatchedAddress: geocode.matchedAddress ?? null,
    currentVsCanonical: currentAddress
      ? currentAddress === canonicalAddress
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

  if (normalizeText(currentRecord.name) !== normalizeText(target.canonicalName)) {
    issues.push('rename-needed');
  }

  const currentLocationAddress = normalizeAddress(currentRecord.locationAddress);

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

function printSummary(records: AuditRecord[]): void {
  const summary = records.map((record) => ({
    name: record.canonicalName,
    match: record.matchMode,
    issues: record.issues.join(', ') || 'none',
    address_db: record.addressCheck.currentVsCanonical,
    address_geocode: record.addressCheck.geocodeVsCanonical,
    distance_m: record.distanceMeters ? record.distanceMeters.toFixed(1) : '',
    geocode: record.geocode.status,
  }));

  console.table(summary);
}

async function main(): Promise<void> {
  const forceSeedSql = process.env.AUDIT_FACILITY_SOURCE === 'seed';
  let facilitiesSource: 'live-supabase' | 'seed-sql-fallback' = forceSeedSql
    ? 'seed-sql-fallback'
    : 'live-supabase';
  let facilities: NormalizedFacility[];

  if (forceSeedSql) {
    facilities = fetchFacilitiesFromSeedSql();
  } else {
    try {
      facilities = await fetchFacilities();
    } catch (error) {
      console.warn(
        `live Supabaseの取得に失敗したため、seed SQL をフォールバックとして使用します: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      );
      facilitiesSource = 'seed-sql-fallback';
      facilities = fetchFacilitiesFromSeedSql();
    }
  }

  const records: AuditRecord[] = [];

  for (const target of PRIORITY_FACILITY_TARGETS) {
    const { facility, matchMode } = findMatch(target, facilities);
    const geocode = await geocodeCanonicalAddress(target.canonicalAddress);
    const { issues, distanceMeters, addressCheck } = detectIssues(target, facility, geocode);

    records.push({
      canonicalName: target.canonicalName,
      matchMode,
      expectedActions: target.expectedActions,
      issues,
      canonicalAddress: target.canonicalAddress,
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
        records,
      },
      null,
      2,
    )}\n`,
    'utf-8',
  );

  printSummary(records);
  console.log(`JSONレポートを出力しました: ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error('priority facility map audit に失敗しました:', error);
  process.exit(1);
});
