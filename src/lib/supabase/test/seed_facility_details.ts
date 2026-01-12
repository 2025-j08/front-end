// 施設詳細テーブル(7つ)と施設種類テーブルに初期データを追加する
// 実行方法:
// NEXT_PUBLIC_SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> tsx src/lib/supabase/test/seed_facility_details.ts
import { readFileSync } from 'fs';
import { join } from 'path';

import { createClient } from '@supabase/supabase-js';

import { logInfo, logError } from '@/lib/logger';

// JSONファイルのパス
const FACILITIES_DETAIL_PATH = join(__dirname, '../../../dummy_data/facilities_detail.json');

// 型定義
type FacilityDetailItem = {
  id: number;
  name: string;
  dormitoryType?: string;
  accessInfo?: unknown;
  relationInfo?: string;
  philosophyInfo?: unknown;
  specialtyInfo?: unknown;
  staffInfo?: unknown;
  educationInfo?: unknown;
  advancedInfo?: unknown;
  otherInfo?: unknown;
  [key: string]: unknown;
};

/**
 * 施設種類(dormitoryType)のマスタデータを挿入
 */
async function seedFacilityTypes(supabase: ReturnType<typeof createClient>) {
  console.log('施設種類マスタデータを挿入しています...');

  const facilityTypes = [
    { name: '大舎' },
    { name: '中舎' },
    { name: '小舎' },
    { name: 'グループホーム' },
    { name: '地域小規模' },
  ];

  // 既存のデータを取得
  const { data: existingTypes, error: fetchError } = await supabase
    .from('facility_types')
    .select('name, id');

  if (fetchError) {
    throw fetchError;
  }

  const existingNames = new Set((existingTypes || []).map((t: any) => t.name));

  // 存在しないデータのみを挿入
  const newTypes = facilityTypes.filter((type) => !existingNames.has(type.name));

  let insertedData: any[] = [];
  if (newTypes.length > 0) {
    const { data, error } = await supabase
      .from('facility_types')
      .insert(newTypes as any)
      .select();

    if (error) {
      throw error;
    }

    insertedData = data || [];
    logInfo(`✓ ${insertedData.length}件の新しい施設種類データを挿入しました`);
  } else {
    logInfo('✓ すべての施設種類データは既に存在します');
  }

  // すべてのデータを再取得して返す
  const { data: allTypes, error: allError } = await supabase
    .from('facility_types')
    .select('name, id');

  if (allError) {
    throw allError;
  }

  return allTypes;
}

/**
 * 施設と施設種類の紐づけを挿入
 */
async function seedFacilityFacilityTypes(
  supabase: ReturnType<typeof createClient>,
  facilitiesDetail: Record<string, FacilityDetailItem>,
  facilityTypesMap: Map<string, number>,
) {
  console.log('施設と施設種類の紐づけを挿入しています...');

  const associations: Array<{ facility_id: number; facility_type_id: number }> = [];

  for (const [facilityIdStr, detail] of Object.entries(facilitiesDetail)) {
    const facilityId = parseInt(facilityIdStr, 10);
    const dormitoryType = detail.dormitoryType;

    if (dormitoryType && facilityTypesMap.has(dormitoryType)) {
      associations.push({
        facility_id: facilityId,
        facility_type_id: facilityTypesMap.get(dormitoryType)!,
      });
    }
  }

  if (associations.length === 0) {
    console.warn('紐づけるデータがありません');
    return;
  }

  const { data, error } = await supabase
    .from('facility_facility_types')
    .insert(associations as never)
    .select();

  if (error) {
    throw error;
  }

  logInfo(`✓ ${data?.length}件の施設-施設種類紐づけを挿入しました`);
}

/**
 * 施設詳細テーブル(7つ)にデータを挿入
 */
async function seedFacilityDetailTables(
  supabase: ReturnType<typeof createClient>,
  facilitiesDetail: Record<string, FacilityDetailItem>,
) {
  console.log('施設詳細テーブルにデータを挿入しています...');

  // 各テーブルへの挿入データを準備（正規化されたスキーマに対応）
  const accessData: Array<{
    facility_id: number;
    location_address: string;
    lat: number;
    lng: number;
    station?: string;
    description?: string;
    location_appeal?: string;
    website_url?: string;
    target_age: string;
    building?: string;
    capacity?: number;
    provisional_capacity?: number;
    relation_info?: string;
  }> = [];
  const philosophyData: Array<{ facility_id: number; description: string }> = [];
  const specialtyData: Array<{ facility_id: number; features: string[]; programs?: string }> = [];
  const staffData: Array<{
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
  }> = [];
  const educationData: Array<{
    facility_id: number;
    graduation_rate?: string;
    learning_support?: string;
    career_support?: string;
  }> = [];
  const advancedData: Array<{
    facility_id: number;
    title?: string;
    description: string;
    background?: string;
    challenges?: string;
    solutions?: string;
  }> = [];
  const otherData: Array<{
    facility_id: number;
    title?: string;
    description?: string;
    networks?: string;
    future_outlook?: string;
    free_text?: string;
  }> = [];

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
        target_age: detail.targetAge || '0～18歳',
        building: detail.building,
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
      });
    }

    // 生活環境・特色
    if (detail.specialtyInfo) {
      specialtyData.push({
        facility_id: facilityId,
        features: detail.specialtyInfo.features,
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
  const tables = [
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
      console.warn(`${table.name}: データがありません`);
      continue;
    }

    const { data, error } = await supabase
      .from(table.name)
      .insert(table.data as never)
      .select();

    if (error) {
      throw new Error(`${table.name} の挿入に失敗しました: ${error.message}`);
    }

    logInfo(`✓ ${table.name}: ${data?.length}件のデータを挿入しました`);
  }
}

/**
 * メイン処理
 */
async function seedFacilityDetails() {
  try {
    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        '環境変数 NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が設定されていません',
      );
    }

    console.log('Supabaseクライアントを初期化しています...');

    // Supabaseクライアントを作成（Service Roleキーを使用）
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('施設詳細データを読み込んでいます...');
    const facilitiesDetailJson = readFileSync(FACILITIES_DETAIL_PATH, 'utf-8');
    const facilitiesDetail = JSON.parse(facilitiesDetailJson) as Record<string, FacilityDetailItem>;

    // 1. 施設種類マスタを挿入
    const facilityTypesData = await seedFacilityTypes(supabase);

    // 施設種類名 → ID のマップを作成
    const facilityTypesMap = new Map<string, number>();
    if (facilityTypesData) {
      for (const type of facilityTypesData) {
        facilityTypesMap.set(type.name, type.id);
      }
    }

    // 2. 施設と施設種類の紐づけを挿入
    await seedFacilityFacilityTypes(supabase, facilitiesDetail, facilityTypesMap);

    // 3. 施設詳細テーブル(7つ)にデータを挿入
    await seedFacilityDetailTables(supabase, facilitiesDetail);

    logInfo('✓ 全ての施設詳細データの挿入が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    logError('エラーが発生しました', {
      error: error instanceof Error ? error.message : JSON.stringify(error),
    });
    process.exit(1);
  }
}

// スクリプトを実行
seedFacilityDetails();
