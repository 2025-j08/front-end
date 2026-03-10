import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { createClient } from '@supabase/supabase-js';

type OfficialFacility = {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  addressDetail: string;
  fullAddress: string;
  sourceFile: string;
};

type OfficialCoordinate = {
  facilityId: number;
  lat: number;
  lng: number;
  locationAddress: string;
  sourceFile: string;
};

type AccessRow = {
  location_address: string;
  lat: number;
  lng: number;
};

type FacilityRow = {
  id: number;
  name: string;
  postal_code: string | null;
  prefecture: string;
  city: string;
  address_detail: string;
  facility_access: AccessRow | AccessRow[] | null;
};

type CurrentFacility = {
  id: number;
  name: string;
  postalCode: string | null;
  prefecture: string;
  city: string;
  addressDetail: string;
  fullAddress: string;
  access: AccessRow | null;
};

type AuditReport = {
  generatedAt: string;
  currentSource: 'supabase' | 'seed_fallback';
  fetchError?: string;
  baselineCount: number;
  currentCount: number;
  baselineCountsByPrefecture: Record<string, number>;
  currentCountsByPrefecture: Record<string, number>;
  missingFromDb: Array<{
    name: string;
    prefecture: string;
    city: string;
    addressDetail: string;
    sourceFile: string;
  }>;
  extraInDb: Array<{
    id: number;
    name: string;
    prefecture: string;
    city: string;
    addressDetail: string;
  }>;
  outsideOfficialPrefectures: Array<{
    id: number;
    name: string;
    prefecture: string;
    city: string;
    addressDetail: string;
  }>;
  hiddenFromMap: Array<{
    id: number;
    name: string;
    prefecture: string;
    city: string;
    addressDetail: string;
    reason: string;
  }>;
  whitespaceIssues: Array<{
    id: number;
    name: string;
    field: 'prefecture' | 'city' | 'addressDetail' | 'locationAddress';
    raw: string;
    normalized: string;
  }>;
  officialAddressMismatches: Array<{
    id: number;
    name: string;
    field: 'prefecture' | 'city' | 'addressDetail';
    current: string;
    official: string;
  }>;
  locationAddressMismatches: Array<{
    id: number;
    name: string;
    expected: string;
    actual: string;
  }>;
  duplicateCoordinates: Array<{
    lat: number;
    lng: number;
    facilities: Array<{
      id: number;
      name: string;
      fullAddress: string;
    }>;
  }>;
  officialCoordinateDrift: Array<{
    id: number;
    name: string;
    currentLat: number;
    currentLng: number;
    officialLat: number;
    officialLng: number;
    distanceKm: number;
  }>;
};

const KINKI_PREFECTURES = [
  '大阪府',
  '京都府',
  '滋賀県',
  '奈良県',
  '兵庫県',
  '和歌山県',
] as const;

const OFFICIAL_INSERT_FILES = [
  'supabase/seeds/02_insert_hyogo_facility.sql',
  'supabase/seeds/03_insert_osaka_facility.sql',
  'supabase/seeds/04_insert_shiga_facility.sql',
  'supabase/seeds/05_insert_nara_facility.sql',
  'supabase/seeds/06_insert_wakayama_facility.sql',
  'supabase/seeds/07_insert_kyoto_facility.sql',
];

const OFFICIAL_UPDATE_FILES = [
  'supabase/seeds/09_update_hyogo_facility.sql',
  'supabase/seeds/10_update_osaka_facility.sql',
  'supabase/seeds/11_update_shiga_facility.sql',
  'supabase/seeds/12_update_nara_facility.sql',
  'supabase/seeds/13_update_wakayama_facility.sql',
  'supabase/seeds/14_update_kyoto_facility.sql',
];

const OUTPUT_DIR = 'reports';
const OUTPUT_PATH = join(OUTPUT_DIR, 'facility-audit-report.json');
const COORDINATE_DUPLICATE_PRECISION = 6;
const OFFICIAL_COORDINATE_DRIFT_KM = 0.3;

function normalizeWhitespace(value: string): string {
  return value.replace(/\u3000/g, ' ').replace(/\s+/g, ' ').trim();
}

function compactForMatch(value: string): string {
  return normalizeWhitespace(value).replace(/\s+/g, '');
}

function makeFullAddress(prefecture: string, city: string, addressDetail: string): string {
  return `${prefecture}${city}${addressDetail}`;
}

function makeOfficialKey(
  name: string,
  prefecture: string,
  city: string,
  addressDetail: string,
): string {
  return [
    compactForMatch(name),
    compactForMatch(prefecture),
    compactForMatch(city),
    compactForMatch(addressDetail),
  ].join('::');
}

function makeCurrentKey(facility: CurrentFacility): string {
  return makeOfficialKey(facility.name, facility.prefecture, facility.city, facility.addressDetail);
}

function splitSqlTuple(line: string): string[] {
  const trimmed = line.trim().replace(/,\s*$/, '');
  if (!trimmed.startsWith('(') || !trimmed.endsWith(')')) {
    throw new Error(`Unexpected tuple format: ${line}`);
  }

  const values: string[] = [];
  let current = '';
  let inString = false;

  for (let i = 1; i < trimmed.length - 1; i += 1) {
    const char = trimmed[i];
    const next = trimmed[i + 1];

    if (char === "'") {
      if (inString && next === "'") {
        current += "'";
        i += 1;
        continue;
      }
      inString = !inString;
      continue;
    }

    if (char === ',' && !inString) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseOfficialFacilities(): OfficialFacility[] {
  const facilities: OfficialFacility[] = [];

  for (const file of OFFICIAL_INSERT_FILES) {
    const text = readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/).filter((line) => line.trim().startsWith('('));

    for (const line of lines) {
      const values = splitSqlTuple(line);
      if (values.length < 8) {
        throw new Error(`Unexpected insert tuple value count in ${file}: ${line}`);
      }

      const id = Number(values[0]);
      const name = values[1];
      const prefecture = values[5];
      const city = values[6];
      const addressDetail = values[7];

      facilities.push({
        id,
        name,
        prefecture,
        city,
        addressDetail,
        fullAddress: makeFullAddress(prefecture, city, addressDetail),
        sourceFile: file,
      });
    }
  }

  return facilities;
}

function parseOfficialCoordinates(): Map<number, OfficialCoordinate> {
  const coordinates = new Map<number, OfficialCoordinate>();
  const blockRegex =
    /location_address\s*=\s*'([^']*(?:''[^']*)*)',\s*[\r\n]+\s*lat\s*=\s*([0-9.]+),\s*[\r\n]+\s*lng\s*=\s*([0-9.]+)\s*[\r\n]+WHERE facility_id = (\d+);/g;

  for (const file of OFFICIAL_UPDATE_FILES) {
    const text = readFileSync(file, 'utf8');
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(text)) !== null) {
      const locationAddress = match[1].replace(/''/g, "'");
      const lat = Number(match[2]);
      const lng = Number(match[3]);
      const facilityId = Number(match[4]);

      coordinates.set(facilityId, {
        facilityId,
        lat,
        lng,
        locationAddress,
        sourceFile: file,
      });
    }
  }

  return coordinates;
}

function buildSeedFallbackCurrentFacilities(
  officialFacilities: OfficialFacility[],
  officialCoordinates: Map<number, OfficialCoordinate>,
): CurrentFacility[] {
  return officialFacilities.map((facility) => {
    const coordinate = officialCoordinates.get(facility.id);
    return {
      id: facility.id,
      name: facility.name,
      postalCode: null,
      prefecture: facility.prefecture,
      city: facility.city,
      addressDetail: facility.addressDetail,
      fullAddress: facility.fullAddress,
      access: coordinate
        ? {
            location_address: coordinate.locationAddress,
            lat: coordinate.lat,
            lng: coordinate.lng,
          }
        : null,
    };
  });
}

function extractAccess(access: FacilityRow['facility_access']): AccessRow | null {
  if (!access) {
    return null;
  }
  return Array.isArray(access) ? access[0] ?? null : access;
}

async function fetchCurrentFacilities(): Promise<CurrentFacility[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が設定されていません',
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from('facilities')
    .select(
      `
      id,
      name,
      postal_code,
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

  return (data as FacilityRow[]).map((row) => {
    const access = extractAccess(row.facility_access);
    return {
      id: row.id,
      name: row.name,
      postalCode: row.postal_code,
      prefecture: row.prefecture,
      city: row.city,
      addressDetail: row.address_detail,
      fullAddress: makeFullAddress(row.prefecture, row.city, row.address_detail),
      access,
    };
  });
}

function countByPrefecture(items: Array<{ prefecture: string }>): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.prefecture] = (acc[item.prefecture] ?? 0) + 1;
    return acc;
  }, {});
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (degree: number) => (degree * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function buildReport(
  officialFacilities: OfficialFacility[],
  officialCoordinates: Map<number, OfficialCoordinate>,
  currentFacilities: CurrentFacility[],
  currentSource: 'supabase' | 'seed_fallback',
  fetchError?: string,
): AuditReport {
  const officialByKey = new Map(
    officialFacilities.map((facility) => [
      makeOfficialKey(facility.name, facility.prefecture, facility.city, facility.addressDetail),
      facility,
    ]),
  );
  const currentByKey = new Map(
    currentFacilities.map((facility) => [makeCurrentKey(facility), facility]),
  );
  const officialByNamePrefecture = new Map(
    officialFacilities.map((facility) => [
      [compactForMatch(facility.name), compactForMatch(facility.prefecture)].join('::'),
      facility,
    ]),
  );

  const missingFromDb = officialFacilities
    .filter(
      (facility) =>
        !currentByKey.has(
          makeOfficialKey(facility.name, facility.prefecture, facility.city, facility.addressDetail),
        ),
    )
    .map((facility) => ({
      name: facility.name,
      prefecture: facility.prefecture,
      city: facility.city,
      addressDetail: facility.addressDetail,
      sourceFile: facility.sourceFile,
    }));

  const extraInDb = currentFacilities
    .filter((facility) => !officialByKey.has(makeCurrentKey(facility)))
    .map((facility) => ({
      id: facility.id,
      name: facility.name,
      prefecture: facility.prefecture,
      city: facility.city,
      addressDetail: facility.addressDetail,
    }));

  const outsideOfficialPrefectures = currentFacilities
    .filter(
      (facility) =>
        !KINKI_PREFECTURES.includes(
          facility.prefecture as (typeof KINKI_PREFECTURES)[number],
        ),
    )
    .map((facility) => ({
      id: facility.id,
      name: facility.name,
      prefecture: facility.prefecture,
      city: facility.city,
      addressDetail: facility.addressDetail,
    }));

  const hiddenFromMap = currentFacilities.flatMap((facility) => {
    const reasons: string[] = [];
    if (
      !KINKI_PREFECTURES.includes(
        facility.prefecture as (typeof KINKI_PREFECTURES)[number],
      )
    ) {
      reasons.push('prefecture_outside_kinki');
    }
    if (!facility.access) {
      reasons.push('facility_access_missing');
    } else if (!facility.access.lat || !facility.access.lng) {
      reasons.push('zero_or_missing_coordinates');
    }

    return reasons.map((reason) => ({
      id: facility.id,
      name: facility.name,
      prefecture: facility.prefecture,
      city: facility.city,
      addressDetail: facility.addressDetail,
      reason,
    }));
  });

  const whitespaceIssues = currentFacilities.flatMap((facility) => {
    const issues: AuditReport['whitespaceIssues'] = [];
    const fieldPairs = [
      ['prefecture', facility.prefecture],
      ['city', facility.city],
      ['addressDetail', facility.addressDetail],
      ['locationAddress', facility.access?.location_address ?? ''],
    ] as const;

    for (const [field, raw] of fieldPairs) {
      if (!raw) continue;
      const normalized = normalizeWhitespace(raw);
      if (raw !== normalized) {
        issues.push({
          id: facility.id,
          name: facility.name,
          field,
          raw,
          normalized,
        });
      }
    }

    return issues;
  });

  const officialAddressMismatches = currentFacilities.flatMap((facility) => {
    const official = officialByNamePrefecture.get(
      [compactForMatch(facility.name), compactForMatch(facility.prefecture)].join('::'),
    );
    if (!official) {
      return [];
    }

    const mismatches: AuditReport['officialAddressMismatches'] = [];
    const pairs = [
      ['prefecture', facility.prefecture, official.prefecture],
      ['city', facility.city, official.city],
      ['addressDetail', facility.addressDetail, official.addressDetail],
    ] as const;

    for (const [field, current, baseline] of pairs) {
      if (compactForMatch(current) !== compactForMatch(baseline)) {
        mismatches.push({
          id: facility.id,
          name: facility.name,
          field,
          current,
          official: baseline,
        });
      }
    }

    return mismatches;
  });

  const locationAddressMismatches = currentFacilities
    .filter((facility) => facility.access?.location_address)
    .filter(
      (facility) =>
        compactForMatch(facility.access!.location_address) !== compactForMatch(facility.fullAddress),
    )
    .map((facility) => ({
      id: facility.id,
      name: facility.name,
      expected: facility.fullAddress,
      actual: facility.access!.location_address,
    }));

  const duplicateCoordinateMap = new Map<string, CurrentFacility[]>();
  for (const facility of currentFacilities) {
    if (!facility.access?.lat || !facility.access?.lng) continue;
    const key = `${facility.access.lat.toFixed(COORDINATE_DUPLICATE_PRECISION)},${facility.access.lng.toFixed(COORDINATE_DUPLICATE_PRECISION)}`;
    const current = duplicateCoordinateMap.get(key) ?? [];
    current.push(facility);
    duplicateCoordinateMap.set(key, current);
  }

  const duplicateCoordinates = Array.from(duplicateCoordinateMap.values())
    .filter((group) => group.length > 1)
    .map((group) => ({
      lat: group[0].access!.lat,
      lng: group[0].access!.lng,
      facilities: group.map((facility) => ({
        id: facility.id,
        name: facility.name,
        fullAddress: facility.fullAddress,
      })),
    }));

  const officialCoordinateDrift = currentFacilities.flatMap((facility) => {
    const official = officialCoordinates.get(facility.id);
    if (!official || !facility.access?.lat || !facility.access?.lng) {
      return [];
    }

    const drift = distanceKm(
      facility.access.lat,
      facility.access.lng,
      official.lat,
      official.lng,
    );

    if (drift < OFFICIAL_COORDINATE_DRIFT_KM) {
      return [];
    }

    return [
      {
        id: facility.id,
        name: facility.name,
        currentLat: facility.access.lat,
        currentLng: facility.access.lng,
        officialLat: official.lat,
        officialLng: official.lng,
        distanceKm: Number(drift.toFixed(3)),
      },
    ];
  });

  return {
    generatedAt: new Date().toISOString(),
    currentSource,
    fetchError,
    baselineCount: officialFacilities.length,
    currentCount: currentFacilities.length,
    baselineCountsByPrefecture: countByPrefecture(officialFacilities),
    currentCountsByPrefecture: countByPrefecture(currentFacilities),
    missingFromDb,
    extraInDb,
    outsideOfficialPrefectures,
    hiddenFromMap,
    whitespaceIssues,
    officialAddressMismatches,
    locationAddressMismatches,
    duplicateCoordinates,
    officialCoordinateDrift,
  };
}

function printSummary(report: AuditReport): void {
  console.log('=== Facility Audit Summary ===');
  console.log(`Current source: ${report.currentSource}`);
  if (report.fetchError) {
    console.log(`Fetch error: ${report.fetchError}`);
  }
  console.log(`Official baseline: ${report.baselineCount}`);
  console.log(`Current set: ${report.currentCount}`);
  console.log(`Missing from current set: ${report.missingFromDb.length}`);
  console.log(`Extra in current set: ${report.extraInDb.length}`);
  console.log(`Outside official prefectures: ${report.outsideOfficialPrefectures.length}`);
  console.log(`Hidden from map: ${report.hiddenFromMap.length}`);
  console.log(`Whitespace issues: ${report.whitespaceIssues.length}`);
  console.log(`Official address mismatches: ${report.officialAddressMismatches.length}`);
  console.log(`Location address mismatches: ${report.locationAddressMismatches.length}`);
  console.log(`Duplicate coordinate groups: ${report.duplicateCoordinates.length}`);
  console.log(`Official coordinate drift: ${report.officialCoordinateDrift.length}`);

  const preview = <T>(label: string, items: T[], formatter: (item: T) => string) => {
    if (items.length === 0) return;
    console.log(`\n${label}`);
    items.slice(0, 10).forEach((item) => console.log(`- ${formatter(item)}`));
    if (items.length > 10) {
      console.log(`... and ${items.length - 10} more`);
    }
  };

  preview(
    'Missing from current set',
    report.missingFromDb,
    (item) => `${item.prefecture} ${item.name} ${item.city}${item.addressDetail}`,
  );
  preview(
    'Hidden from map',
    report.hiddenFromMap,
    (item) => `#${item.id} ${item.name} (${item.reason})`,
  );
  preview(
    'Whitespace issues',
    report.whitespaceIssues,
    (item) => `#${item.id} ${item.name} [${item.field}] "${item.raw}" -> "${item.normalized}"`,
  );
  preview(
    'Official address mismatches',
    report.officialAddressMismatches,
    (item) =>
      `#${item.id} ${item.name} [${item.field}] current="${item.current}" official="${item.official}"`,
  );
  preview(
    'Duplicate coordinate groups',
    report.duplicateCoordinates,
    (item) =>
      `${item.lat}, ${item.lng} -> ${item.facilities
        .map((facility) => `#${facility.id} ${facility.name}`)
        .join(', ')}`,
  );
}

async function main(): Promise<void> {
  const officialFacilities = parseOfficialFacilities();
  const officialCoordinates = parseOfficialCoordinates();

  let currentFacilities: CurrentFacility[];
  let currentSource: AuditReport['currentSource'] = 'supabase';
  let fetchError: string | undefined;

  try {
    currentFacilities = await fetchCurrentFacilities();
  } catch (error) {
    currentSource = 'seed_fallback';
    fetchError = error instanceof Error ? error.message : String(error);
    currentFacilities = buildSeedFallbackCurrentFacilities(officialFacilities, officialCoordinates);
  }

  const report = buildReport(
    officialFacilities,
    officialCoordinates,
    currentFacilities,
    currentSource,
    fetchError,
  );

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf8');

  printSummary(report);
  console.log(`\nDetailed report written to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('Facility audit failed:', error);
  process.exit(1);
});
