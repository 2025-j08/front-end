// 施設詳細テーブル(7つ)と施設種類テーブルに初期データを追加する
// 注: facilitiesテーブルにレコードが追加されると、トリガーにより
// 各詳細テーブルにfacility_idのレコードが自動作成されるため、
// このスクリプトでは既存レコードを更新します
//
// 実行方法:
// node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility_details.ts
import { readFileSync } from 'fs';
import { join } from 'path';

import { SupabaseClient } from '@supabase/supabase-js';

import { logInfo, logWarn } from '../../logger';
import {
  createSeedClient,
  parseFullAddress,
  parseEstablishedYear,
  resetFacilitySequences,
  runSeedScript,
} from '../utils/seed';

// JSONファイルのパス
const FACILITIES_DETAIL_PATH = join(__dirname, '../../../dummy_data/facilities_detail.json');

// NOTE:
// `src/dummy_data/facilities_detail.json` には過去のスキーマで使用していた
// `targetAge` フィールドが残存しています。
// ダミーデータおよびこのシードスクリプトは将来的に削除する予定のため、
// 現時点では JSON 本体は修正していません（参照や型注記のみを残します）。
// この注記は保守性向上のために追加しているだけで、実行時の挙動には影響しません。

// ============================================
// JSONデータ用の型定義
// ============================================

/** 施設詳細JSONの各項目 */
interface FacilityDetailJsonItem {
  id: number;
  name: string;
  corporation?: string;
  fullAddress?: string;
  phone?: string;
  establishedYear?: string;
  dormitoryType?: string | string[];
  accessInfo?: {
    locationAddress: string;
    lat: number;
    lng: number;
    station?: string;
    description?: string;
    locationAppeal?: string;
  };
  relationInfo?: string;
  philosophyInfo?: {
    description: string;
    message?: string;
  };
  specialtyInfo?: {
    features: string | string[];
    programs?: string;
  };
  staffInfo?: {
    fullTimeStaffCount?: number;
    partTimeStaffCount?: number;
    specialties?: string;
    averageTenure?: string;
    ageDistribution?: string;
    workStyle?: string;
    hasUniversityLecturer?: boolean;
    lectureSubjects?: string;
    externalActivities?: string;
    qualificationsAndSkills?: string;
    internshipDetails?: string;
  };
  educationInfo?: {
    graduationRate?: string;
    graduationRatePercentage?: string;
    learningSupport?: string;
    careerSupport?: string;
  };
  advancedInfo?: {
    title?: string;
    description: string;
    background?: string;
    challenges?: string;
    solutions?: string;
  };
  otherInfo?: {
    title?: string;
    description?: string;
    networks?: string;
    futureOutlook?: string;
    freeText?: string;
  };
  websiteUrl?: string;
  /**
   * Legacy field present in dummy JSON.
   * NOTE: `targetAge` はダミーデータに残存している過去のフィールドです。
   * ダミー/シードは後で削除予定のため、ここでは型注記として残していますが
   * 実際のシード挿入ロジックでは使用しません。
   */
  targetAge?: string;
  building?: string;
  capacity?: number;
  provisionalCapacity?: number;
}

// ============================================
// Supabase挿入用の型定義
// ============================================

interface FacilityInsertData {
  id: number;
  name: string;
  corporation: string;
  postal_code: string;
  phone: string;
  prefecture: string;
  city: string;
  address_detail: string;
  established_year: number;
}

interface FacilityTypeData {
  name: string;
  id?: number;
}

interface AccessInsertData {
  facility_id: number;
  location_address: string;
  lat: number;
  lng: number;
  station?: string;
  description?: string;
  location_appeal?: string;
  website_url?: string;
  capacity?: number;
  provisional_capacity?: number;
  relation_info?: string;
}

interface PhilosophyInsertData {
  facility_id: number;
  description: string;
  message?: string;
}

interface SpecialtyInsertData {
  facility_id: number;
  features: string;
  programs?: string;
}

interface StaffInsertData {
  facility_id: number;
  full_time_staff_count?: number;
  part_time_staff_count?: number;
  specialties?: string;
  average_tenure?: string;
  age_distribution?: string;
  work_style?: string;
  has_university_lecturer?: boolean;
  lecture_subjects?: string;
  external_activities?: string;
  qualifications_and_skills?: string;
  internship_details?: string;
}

interface EducationInsertData {
  facility_id: number;
  graduation_rate?: string;
  graduation_rate_percentage?: string;
  learning_support?: string;
  career_support?: string;
}

interface AdvancedInsertData {
  facility_id: number;
  title?: string;
  description: string;
  background?: string;
  challenges?: string;
  solutions?: string;
}

interface OtherInsertData {
  facility_id: number;
  title?: string;
  description?: string;
  networks?: string;
  future_outlook?: string;
  free_text?: string;
}

// ============================================
// シード処理関数
// ============================================

/**
 * 施設の基本情報を挿入
 */
async function seedFacilities(
  supabase: SupabaseClient,
  facilitiesDetail: Record<string, FacilityDetailJsonItem>,
): Promise<FacilityInsertData[]> {
  logInfo('施設基本情報を挿入しています...');

  const facilitiesData: FacilityInsertData[] = Object.values(facilitiesDetail).map((detail) => {
    const fullAddress = detail.fullAddress || '';
    const { postalCode, prefecture, city, addressDetail } = parseFullAddress(fullAddress);
    const establishedYear = parseEstablishedYear(detail.establishedYear, detail.id);

    return {
      id: detail.id,
      name: detail.name,
      corporation: detail.corporation || '',
      postal_code: postalCode,
      phone: detail.phone || '',
      prefecture,
      city,
      address_detail: addressDetail,
      established_year: establishedYear,
    };
  });

  const { data, error } = await supabase
    .from('facilities')
    .upsert(facilitiesData, { onConflict: 'id' })
    .select();

  if (error) {
    throw new Error(`施設基本情報の挿入に失敗しました: ${error.message}`);
  }

  logInfo(`✓ ${data?.length || 0}件の施設基本情報を挿入しました`);
  return data || [];
}

/**
 * 施設種類(dormitoryType)のマスタデータを挿入
 */
async function seedFacilityTypes(supabase: SupabaseClient): Promise<FacilityTypeData[]> {
  logInfo('施設種類マスタデータを挿入しています...');

  const facilityTypes: FacilityTypeData[] = [
    { name: '大舎' },
    { name: '中舎' },
    { name: '小舎' },
    { name: 'グループホーム' },
  ];

  // 既存のデータを取得
  const { data: existingTypes, error: fetchError } = await supabase
    .from('facility_types')
    .select('name, id');

  if (fetchError) {
    throw new Error(`施設種類の取得に失敗しました: ${fetchError.message}`);
  }

  const existingNames = new Set((existingTypes || []).map((t) => t.name));

  // 存在しないデータのみを挿入
  const newTypes = facilityTypes.filter((type) => !existingNames.has(type.name));

  if (newTypes.length > 0) {
    const { data, error } = await supabase.from('facility_types').insert(newTypes).select();

    if (error) {
      throw new Error(`施設種類の挿入に失敗しました: ${error.message}`);
    }

    logInfo(`✓ ${data?.length || 0}件の新しい施設種類データを挿入しました`);
  } else {
    logInfo('✓ すべての施設種類データは既に存在します');
  }

  // すべてのデータを再取得して返す
  const { data: allTypes, error: allError } = await supabase
    .from('facility_types')
    .select('name, id');

  if (allError) {
    throw new Error(`施設種類の再取得に失敗しました: ${allError.message}`);
  }

  return allTypes || [];
}

/**
 * 施設と施設種類の紐づけを挿入
 */
async function seedFacilityFacilityTypes(
  supabase: SupabaseClient,
  facilitiesDetail: Record<string, FacilityDetailJsonItem>,
  facilityTypesMap: Map<string, number>,
): Promise<void> {
  logInfo('施設と施設種類の紐づけを挿入しています...');

  const associations: Array<{ facility_id: number; facility_type_id: number }> = [];

  for (const [facilityIdStr, detail] of Object.entries(facilitiesDetail)) {
    const facilityId = parseInt(facilityIdStr, 10);
    const dormitoryTypes = detail.dormitoryType;

    // dormitoryType が配列でも文字列でも対応
    const typesArray = Array.isArray(dormitoryTypes)
      ? dormitoryTypes
      : dormitoryTypes
        ? [dormitoryTypes]
        : [];

    for (const dormitoryType of typesArray) {
      if (facilityTypesMap.has(dormitoryType)) {
        associations.push({
          facility_id: facilityId,
          facility_type_id: facilityTypesMap.get(dormitoryType)!,
        });
      }
    }
  }

  if (associations.length === 0) {
    logWarn('紐づけるデータがありません');
    return;
  }

  const { data, error } = await supabase
    .from('facility_facility_types')
    .upsert(associations, { onConflict: 'facility_id,facility_type_id' })
    .select();

  if (error) {
    throw new Error(`施設-施設種類紐づけの挿入に失敗しました: ${error.message}`);
  }

  logInfo(`✓ ${data?.length}件の施設-施設種類紐づけを更新しました`);
}

/**
 * 施設詳細テーブル(7つ)にデータを更新
 */
async function seedFacilityDetailTables(
  supabase: SupabaseClient,
  facilitiesDetail: Record<string, FacilityDetailJsonItem>,
): Promise<void> {
  logInfo('施設詳細テーブルにデータを更新しています...');

  // 各テーブルへの挿入データを準備
  const accessData: AccessInsertData[] = [];
  const philosophyData: PhilosophyInsertData[] = [];
  const specialtyData: SpecialtyInsertData[] = [];
  const staffData: StaffInsertData[] = [];
  const educationData: EducationInsertData[] = [];
  const advancedData: AdvancedInsertData[] = [];
  const otherData: OtherInsertData[] = [];

  for (const [facilityIdStr, detail] of Object.entries(facilitiesDetail)) {
    const facilityId = parseInt(facilityIdStr, 10);

    // アクセス情報
    if (detail.accessInfo) {
      accessData.push({
        facility_id: facilityId,
        location_address: detail.accessInfo.locationAddress,
        lat: detail.accessInfo.lat,
        lng: detail.accessInfo.lng,
        station: detail.accessInfo.station,
        description: detail.accessInfo.description,
        location_appeal: detail.accessInfo.locationAppeal,
        website_url: detail.websiteUrl,
        capacity: detail.capacity,
        provisional_capacity: detail.provisionalCapacity,
        relation_info: detail.relationInfo,
      });
    }

    // 理念情報
    if (detail.philosophyInfo) {
      philosophyData.push({
        facility_id: facilityId,
        description: detail.philosophyInfo.description,
        message: detail.philosophyInfo.message,
      });
    }

    // 特化領域情報
    if (detail.specialtyInfo) {
      specialtyData.push({
        facility_id: facilityId,
        features: Array.isArray(detail.specialtyInfo.features)
          ? detail.specialtyInfo.features.join('')
          : detail.specialtyInfo.features,
        programs: detail.specialtyInfo.programs,
      });
    }

    // 職員情報
    if (detail.staffInfo) {
      staffData.push({
        facility_id: facilityId,
        full_time_staff_count: detail.staffInfo.fullTimeStaffCount,
        part_time_staff_count: detail.staffInfo.partTimeStaffCount,
        specialties: detail.staffInfo.specialties,
        average_tenure: detail.staffInfo.averageTenure,
        age_distribution: detail.staffInfo.ageDistribution,
        work_style: detail.staffInfo.workStyle,
        has_university_lecturer: detail.staffInfo.hasUniversityLecturer,
        lecture_subjects: detail.staffInfo.lectureSubjects,
        external_activities: detail.staffInfo.externalActivities,
        qualifications_and_skills: detail.staffInfo.qualificationsAndSkills,
        internship_details: detail.staffInfo.internshipDetails,
      });
    }

    // 教育・進路支援
    if (detail.educationInfo) {
      educationData.push({
        facility_id: facilityId,
        graduation_rate: detail.educationInfo.graduationRate,
        graduation_rate_percentage: detail.educationInfo.graduationRatePercentage,
        learning_support: detail.educationInfo.learningSupport,
        career_support: detail.educationInfo.careerSupport,
      });
    }

    // 高機能化・多機能化
    if (detail.advancedInfo) {
      advancedData.push({
        facility_id: facilityId,
        title: detail.advancedInfo.title,
        description: detail.advancedInfo.description,
        background: detail.advancedInfo.background,
        challenges: detail.advancedInfo.challenges,
        solutions: detail.advancedInfo.solutions,
      });
    }

    // その他情報
    if (detail.otherInfo) {
      otherData.push({
        facility_id: facilityId,
        title: detail.otherInfo.title,
        description: detail.otherInfo.description,
        networks: detail.otherInfo.networks,
        future_outlook: detail.otherInfo.futureOutlook,
        free_text: detail.otherInfo.freeText,
      });
    }
  }

  // 各テーブルにデータを挿入
  const tables: Array<{ name: string; data: unknown[] }> = [
    { name: 'facility_access', data: accessData },
    { name: 'facility_philosophy', data: philosophyData },
    { name: 'facility_specialty', data: specialtyData },
    { name: 'facility_staff', data: staffData },
    { name: 'facility_education', data: educationData },
    { name: 'facility_advanced', data: advancedData },
    { name: 'facility_other', data: otherData },
  ];

  for (const table of tables) {
    if (table.data.length === 0) {
      logWarn(`${table.name}: データがありません`);
      continue;
    }

    const { data, error } = await supabase
      .from(table.name)
      .upsert(table.data, { onConflict: 'facility_id' })
      .select();

    if (error) {
      throw new Error(`${table.name} の更新に失敗しました: ${error.message}`);
    }

    logInfo(`✓ ${table.name}: ${data?.length}件のデータを更新しました`);
  }
}

// ============================================
// メイン処理
// ============================================

async function main(): Promise<void> {
  logInfo('Supabaseクライアントを初期化しています...');
  const supabase = createSeedClient();

  logInfo('施設詳細データを読み込んでいます...');
  const facilitiesDetailJson = readFileSync(FACILITIES_DETAIL_PATH, 'utf-8');
  const facilitiesDetail = JSON.parse(facilitiesDetailJson) as Record<
    string,
    FacilityDetailJsonItem
  >;

  // 1. 施設基本情報を挿入
  await seedFacilities(supabase, facilitiesDetail);

  // 2. 施設種類マスタを挿入
  const facilityTypesData = await seedFacilityTypes(supabase);

  // 施設種類名 → ID のマップを作成
  const facilityTypesMap = new Map<string, number>();
  for (const type of facilityTypesData) {
    if (type.id !== undefined) {
      facilityTypesMap.set(type.name, type.id);
    }
  }

  // 3. 施設と施設種類の紐づけを挿入
  await seedFacilityFacilityTypes(supabase, facilitiesDetail, facilityTypesMap);

  // 4. 施設詳細テーブル(7つ)にデータを挿入
  await seedFacilityDetailTables(supabase, facilitiesDetail);

  // 5. シーケンスをリセット（IDを明示指定したためシーケンスが追従していない）
  await resetFacilitySequences(supabase);

  logInfo('✓ 全ての施設詳細データの挿入が完了しました');
}

// スクリプトを実行
runSeedScript(main, '施設詳細シード');
