/**
 * Supabase施設データ取得クエリ
 * 施設の詳細情報を各テーブルから取得する関数群
 */

import { createClient } from '@/lib/supabase/client';
import type { FacilityDetail, AnnexFacility } from '@/types/facility';

/**
 * 詳細テーブルのエラーチェック用ヘルパー関数
 * PGRST116（データが存在しない）以外のエラーをスロー
 */
const checkDetailTableError = (result: { error: unknown }, tableName: string) => {
  if (result.error && (result.error as { code?: string }).code !== 'PGRST116') {
    throw new Error(`${tableName}の取得に失敗しました: ${(result.error as Error).message}`);
  }
};

/**
 * 施設基本情報を取得
 * @param id - 施設ID
 * @returns 施設基本情報、存在しない場合はnull
 * @throws データ取得エラー時はErrorをスロー
 */
async function getFacilityBasicInfo(id: number) {
  const supabase = createClient();

  const { data: facility, error: facilityError } = await supabase
    .from('facilities')
    .select('*')
    .eq('id', id)
    .single();

  if (facilityError) {
    throw new Error(`施設基本情報の取得に失敗しました: ${facilityError.message}`);
  }

  return facility;
}

/**
 * 施設種類を取得
 * @param id - 施設ID
 * @returns 施設種類（dormitoryType）
 * @throws データ取得エラー時はErrorをスロー
 *
 * @remarks
 * データベース設計では facility_facility_types 中間テーブルを使用しており、
 * 将来的に1施設が複数の種類を持つ可能性を考慮している。
 * 現状は最初の1件のみを使用し、1施設1種類として運用。
 * 複数種類対応が必要になった場合は、戻り値を配列型に変更する。
 */
async function getFacilityTypes(id: number) {
  const supabase = createClient();

  const { data: facilityTypes, error: typesError } = await supabase
    .from('facility_facility_types')
    .select('facility_type_id, facility_types(name)')
    .eq('facility_id', id);

  if (typesError) {
    throw new Error(`施設種類の取得に失敗しました: ${typesError.message}`);
  }

  // 施設種類名を抽出（現状は最初の1件のみを使用）
  // 注: 複数の種類が登録されている場合、2件目以降は無視される
  const firstType = facilityTypes?.[0] as unknown as
    | { facility_types: { name: string } | null }
    | undefined;
  const dormitoryType = firstType?.facility_types?.name as
    | '大舎'
    | '中舎'
    | '小舎'
    | 'グループホーム'
    | '地域小規模'
    | undefined;

  return dormitoryType;
}

/**
 * 各詳細テーブルからデータを並列取得
 * @param id - 施設ID
 * @returns 7つの詳細情報（access, philosophy, specialty, staff, education, advanced, other）
 * @throws データ取得エラー時はErrorをスロー（データが存在しない場合は除く）
 */
async function getFacilityDetailTables(id: number) {
  const supabase = createClient();

  const [
    accessResult,
    philosophyResult,
    specialtyResult,
    staffResult,
    educationResult,
    advancedResult,
    otherResult,
  ] = await Promise.all([
    supabase.from('facility_access').select('*').eq('facility_id', id).single(),
    supabase.from('facility_philosophy').select('*').eq('facility_id', id).single(),
    supabase.from('facility_specialty').select('*').eq('facility_id', id).single(),
    supabase.from('facility_staff').select('*').eq('facility_id', id).single(),
    supabase.from('facility_education').select('*').eq('facility_id', id).single(),
    supabase.from('facility_advanced').select('*').eq('facility_id', id).single(),
    supabase.from('facility_other').select('*').eq('facility_id', id).single(),
  ]);

  // 全テーブルで均等にエラーチェック
  const detailTables = [
    { result: accessResult, name: 'アクセス情報' },
    { result: philosophyResult, name: '運営方針' },
    { result: specialtyResult, name: '特色・強み' },
    { result: staffResult, name: 'スタッフ情報' },
    { result: educationResult, name: '教育支援' },
    { result: advancedResult, name: '高度な取り組み' },
    { result: otherResult, name: 'その他情報' },
  ];

  detailTables.forEach(({ result, name }) => checkDetailTableError(result, name));

  return {
    accessResult,
    philosophyResult,
    specialtyResult,
    staffResult,
    educationResult,
    advancedResult,
    otherResult,
  };
}

/**
 * 施設の詳細情報を取得する
 * facilities テーブルと各詳細テーブルを結合して1つのオブジェクトにまとめる
 *
 * @param id - 施設ID
 * @returns 施設詳細情報、エラー時はnull
 * @throws データ取得エラー時は Error をスロー
 */
export async function getFacilityDetail(id: number): Promise<FacilityDetail | null> {
  // 1. 基本情報、施設種類、詳細テーブルを並列取得
  const [facility, dormitoryType, detailTables] = await Promise.all([
    getFacilityBasicInfo(id),
    getFacilityTypes(id),
    getFacilityDetailTables(id),
  ]);

  if (!facility) {
    return null;
  }

  // 2. 完全住所を構築
  const fullAddress = `${facility.prefecture}${facility.city}${facility.address_detail}`;

  // 3. 併設施設データの型変換
  const annexFacilities: AnnexFacility[] = Array.isArray(facility.annex_facilities)
    ? (facility.annex_facilities as AnnexFacility[])
    : [];

  // 4. 各詳細テーブルのデータを取得（正規化後のカラムを直接参照）
  const accessData = detailTables.accessResult.data;
  const accessInfo = {
    locationAddress: accessData?.location_address || fullAddress,
    lat: accessData?.lat || 0,
    lng: accessData?.lng || 0,
    station: accessData?.station,
    description: accessData?.description,
    locationAppeal: accessData?.location_appeal,
  };

  const philosophyData = detailTables.philosophyResult.data;
  const specialtyData = detailTables.specialtyResult.data;
  const staffData = detailTables.staffResult.data;
  const educationData = detailTables.educationResult.data;
  const advancedData = detailTables.advancedResult.data;
  const otherData = detailTables.otherResult.data;

  // 5. FacilityDetail 型に整形
  const facilityDetail: FacilityDetail = {
    id: facility.id,
    name: facility.name,
    fullAddress,
    phone: facility.phone,
    dormitoryType,
    targetAge: accessData?.target_age || '0～18歳',
    accessInfo,
    corporation: facility.corporation,
    websiteUrl: accessData?.website_url,
    establishedYear: facility.established_year?.toString(),
    building: accessData?.building,
    capacity: accessData?.capacity || undefined,
    provisionalCapacity: accessData?.provisional_capacity || undefined,
    annexFacilities,
    relationInfo: accessData?.relation_info,
    philosophyInfo: philosophyData
      ? {
          message: philosophyData.message || undefined,
          description: philosophyData.description,
        }
      : undefined,
    specialtyInfo: specialtyData
      ? {
          features: specialtyData.features || [],
          programs: specialtyData.programs || undefined,
        }
      : undefined,
    staffInfo: staffData
      ? {
          fullTimeStaffCount: staffData.full_time_staff_count || undefined,
          partTimeStaffCount: staffData.part_time_staff_count || undefined,
          specialties: staffData.specialties || undefined,
          averageTenure: staffData.average_tenure || undefined,
          ageDistribution: staffData.age_distribution || undefined,
          workStyle: staffData.work_style || undefined,
          hasUniversityLecturer: staffData.has_university_lecturer || undefined,
          lectureSubjects: staffData.lecture_subjects || undefined,
          externalActivities: staffData.external_activities || undefined,
          qualificationsAndSkills: staffData.qualifications_and_skills || undefined,
          internshipDetails: staffData.internship_details || undefined,
        }
      : undefined,
    educationInfo: educationData
      ? {
          graduationRate: educationData.graduation_rate || undefined,
          graduationRatePercentage: educationData.graduation_rate_percentage || undefined,
          learningSupport: educationData.learning_support || undefined,
          careerSupport: educationData.career_support || undefined,
        }
      : undefined,
    advancedInfo: advancedData
      ? {
          title: advancedData.title || undefined,
          description: advancedData.description,
          background: advancedData.background || undefined,
          challenges: advancedData.challenges || undefined,
          solutions: advancedData.solutions || undefined,
        }
      : undefined,
    otherInfo: otherData
      ? {
          title: otherData.title || undefined,
          description: otherData.description || undefined,
          networks: otherData.networks || undefined,
          futureOutlook: otherData.future_outlook || undefined,
          freeText: otherData.free_text || undefined,
        }
      : undefined,
  };

  return facilityDetail;
}
