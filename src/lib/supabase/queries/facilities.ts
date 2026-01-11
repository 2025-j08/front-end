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

  // 施設種類名を抽出（最初のものを使用）
  const firstType = facilityTypes?.[0] as { facility_types: { name: string } } | undefined;
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
    supabase.from('facility_access').select('data').eq('facility_id', id).single(),
    supabase.from('facility_philosophy').select('data').eq('facility_id', id).single(),
    supabase.from('facility_specialty').select('data').eq('facility_id', id).single(),
    supabase.from('facility_staff').select('data').eq('facility_id', id).single(),
    supabase.from('facility_education').select('data').eq('facility_id', id).single(),
    supabase.from('facility_advanced').select('data').eq('facility_id', id).single(),
    supabase.from('facility_other').select('data').eq('facility_id', id).single(),
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

  // 4. facility_access の JSONB データから追加フィールドを取得
  const accessData = detailTables.accessResult.data?.data || {};
  const accessInfo = {
    locationAddress: accessData.locationAddress || fullAddress,
    lat: accessData.lat || 0,
    lng: accessData.lng || 0,
    station: accessData.station,
    description: accessData.description,
    locationAppeal: accessData.locationAppeal,
  };

  // 5. FacilityDetail 型に整形
  const facilityDetail: FacilityDetail = {
    id: facility.id,
    name: facility.name,
    fullAddress,
    phone: facility.phone,
    dormitoryType,
    targetAge: accessData.targetAge || '0～18歳',
    accessInfo,
    corporation: facility.corporation,
    websiteUrl: accessData.websiteUrl,
    establishedYear: facility.established_year?.toString(),
    building: accessData.building,
    capacity: accessData.capacity,
    provisionalCapacity: accessData.provisionalCapacity,
    annexFacilities,
    relationInfo: accessData.relationInfo,
    philosophyInfo: detailTables.philosophyResult.data?.data,
    specialtyInfo: detailTables.specialtyResult.data?.data,
    staffInfo: detailTables.staffResult.data?.data,
    educationInfo: detailTables.educationResult.data?.data,
    advancedInfo: detailTables.advancedResult.data?.data,
    otherInfo: detailTables.otherResult.data?.data,
  };

  return facilityDetail;
}
