/**
 * Supabase施設データ取得クエリ
 * 施設の詳細情報を各テーブルから取得する関数群
 */

import { createClient } from '@/lib/supabase/client';
import type { FacilityDetail, AnnexFacility } from '@/types/facility';

/**
 * 施設の詳細情報を取得する
 * facilities テーブルと各詳細テーブルを結合して1つのオブジェクトにまとめる
 *
 * @param id - 施設ID
 * @returns 施設詳細情報、エラー時はnull
 * @throws データ取得エラー時は Error をスロー
 */
export async function getFacilityDetail(id: number): Promise<FacilityDetail | null> {
  const supabase = createClient();

  // 1. 施設基本情報を取得
  const { data: facility, error: facilityError } = await supabase
    .from('facilities')
    .select('*')
    .eq('id', id)
    .single();

  if (facilityError) {
    throw new Error(`施設基本情報の取得に失敗しました: ${facilityError.message}`);
  }

  if (!facility) {
    return null;
  }

  // 2. 施設種類を取得（facility_facility_types と facility_types を結合）
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

  // 3. 各詳細テーブルからデータを取得
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

  // エラーチェック（データが存在しない場合は無視）
  if (accessResult.error && accessResult.error.code !== 'PGRST116') {
    throw new Error(`アクセス情報の取得に失敗しました: ${accessResult.error.message}`);
  }

  // 4. 完全住所を構築
  const fullAddress = `${facility.prefecture}${facility.city}${facility.address_detail}`;

  // 5. 併設施設データの型変換
  const annexFacilities: AnnexFacility[] = Array.isArray(facility.annex_facilities)
    ? (facility.annex_facilities as AnnexFacility[])
    : [];

  // 6. facility_access の JSONB データから追加フィールドを取得
  const accessData = accessResult.data?.data || {};
  const accessInfo = {
    locationAddress: accessData.locationAddress || fullAddress,
    lat: accessData.lat || 0,
    lng: accessData.lng || 0,
    station: accessData.station,
    description: accessData.description,
    locationAppeal: accessData.locationAppeal,
  };

  // 7. FacilityDetail 型に整形
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
    philosophyInfo: philosophyResult.data?.data,
    specialtyInfo: specialtyResult.data?.data,
    staffInfo: staffResult.data?.data,
    educationInfo: educationResult.data?.data,
    advancedInfo: advancedResult.data?.data,
    otherInfo: otherResult.data?.data,
  };

  return facilityDetail;
}
