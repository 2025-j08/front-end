/**
 * Supabase施設データ更新用ミューテーション
 * 施設の詳細情報を各テーブルに更新する関数群
 */

import type { SupabaseClient } from '@supabase/supabase-js';

import {
  SECTION_TO_TABLE_MAP,
  type FacilityDetailTableName,
  type FacilitySectionName,
} from '@/lib/supabase/constants/facility-tables';
import type { AnnexFacility, KinkiPrefecture } from '@/types/facility';

/**
 * 施設作成データ型
 */
export type CreateFacilityData = {
  name: string;
  corporation: string;
  postal_code: string;
  prefecture: KinkiPrefecture;
  city: string;
  address_detail: string;
};

/**
 * 基本情報の更新データ型
 */
export type BasicInfoUpdateData = {
  name?: string;
  phone?: string;
  corporation?: string;
  established_year?: number;
  annex_facilities?: AnnexFacility[];
  /** 施設種類（中間テーブル経由で更新するため別処理）複数選択可 */
  dormitory_type?: string[];
};

/**
 * アクセス情報の更新データ型
 */
export type AccessInfoUpdateData = {
  location_address?: string;
  lat?: number;
  lng?: number;
  target_age?: string;
  building?: string;
  station?: string;
  description?: string;
  location_appeal?: string;
  website_url?: string;
  capacity?: number;
  provisional_capacity?: number;
  relation_info?: string;
};

/**
 * 理念情報の更新データ型
 */
export type PhilosophyInfoUpdateData = {
  message?: string;
  description?: string;
};

/**
 * 特化領域情報の更新データ型
 */
export type SpecialtyInfoUpdateData = {
  features?: string;
  programs?: string;
};

/**
 * 職員情報の更新データ型
 */
export type StaffInfoUpdateData = {
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
};

/**
 * 教育・進路支援情報の更新データ型
 */
export type EducationInfoUpdateData = {
  graduation_rate?: string;
  graduation_rate_percentage?: string;
  learning_support?: string;
  career_support?: string;
};

/**
 * 高機能化・多機能化への取り組みの更新データ型
 */
export type AdvancedInfoUpdateData = {
  title?: string;
  description?: string;
  background?: string;
  challenges?: string;
  solutions?: string;
};

/**
 * その他情報の更新データ型
 */
export type OtherInfoUpdateData = {
  title?: string;
  description?: string;
  networks?: string;
  future_outlook?: string;
  free_text?: string;
};

/**
 * undefinedの値をオブジェクトから除去するヘルパー関数
 */
function removeUndefinedValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

/**
 * 共通のupdateヘルパー関数（正規化されたスキーマ対応）
 * 既存レコードのみを更新（新規作成は行わない）
 */
async function updateFacilityData<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  tableName: FacilityDetailTableName,
  facilityId: number,
  data: T,
  errorMessage: string,
): Promise<void> {
  const cleanedData = removeUndefinedValues(data);

  if (Object.keys(cleanedData).length === 0) {
    return;
  }

  const { error } = await supabase
    .from(tableName)
    .update(cleanedData)
    .eq('facility_id', facilityId);

  if (error) {
    throw new Error(`${errorMessage}: ${error.message}`);
  }
}

/**
 * 施設種類を更新（中間テーブル経由）- 複数選択対応
 */
async function updateFacilityDormitoryType(
  supabase: SupabaseClient,
  facilityId: number,
  dormitoryTypes: string[],
): Promise<void> {
  // 空配列の場合は既存の紐付けを全て削除
  if (dormitoryTypes.length === 0) {
    const { error: deleteError } = await supabase
      .from('facility_facility_types')
      .delete()
      .eq('facility_id', facilityId);

    if (deleteError) {
      throw new Error(`施設種類の削除に失敗しました: ${deleteError.message}`);
    }
    return;
  }

  // 各種類のIDを取得
  const { data: facilityTypeRecords, error: typeError } = await supabase
    .from('facility_types')
    .select('id, name')
    .in('name', dormitoryTypes);

  if (typeError) {
    throw new Error(`施設種類の取得に失敗しました: ${typeError.message}`);
  }

  if (!facilityTypeRecords || facilityTypeRecords.length === 0) {
    throw new Error(`指定された施設種類が見つかりません: ${dormitoryTypes.join(', ')}`);
  }

  // 既存の紐付けを削除
  const { error: deleteError } = await supabase
    .from('facility_facility_types')
    .delete()
    .eq('facility_id', facilityId);

  if (deleteError) {
    throw new Error(`施設種類の削除に失敗しました: ${deleteError.message}`);
  }

  // 新しい紐付けを挿入
  const associations = facilityTypeRecords.map((type) => ({
    facility_id: facilityId,
    facility_type_id: type.id,
  }));

  const { error: insertError } = await supabase
    .from('facility_facility_types')
    .insert(associations);

  if (insertError) {
    throw new Error(`施設種類の更新に失敗しました: ${insertError.message}`);
  }
}

/**
 * 施設の基本情報を更新
 */
export async function updateFacilityBasicInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: BasicInfoUpdateData,
): Promise<void> {
  const { dormitory_type, ...facilitiesData } = data;
  const cleanedData = removeUndefinedValues(facilitiesData);

  if (Object.keys(cleanedData).length > 0) {
    const { error } = await supabase.from('facilities').update(cleanedData).eq('id', facilityId);

    if (error) {
      throw new Error(`基本情報の更新に失敗しました: ${error.message}`);
    }
  }

  // dormitory_typeが配列として渡された場合（空配列含む）に更新処理を実行
  // 空配列の場合は既存の紐付けを全て削除する
  if (Array.isArray(dormitory_type)) {
    await updateFacilityDormitoryType(supabase, facilityId, dormitory_type);
  }
}

/**
 * タブ別更新用のユニオン型
 */
export type TabUpdateData =
  | { section: 'basic'; data: BasicInfoUpdateData }
  | { section: 'access'; data: AccessInfoUpdateData }
  | { section: 'philosophy'; data: PhilosophyInfoUpdateData }
  | { section: 'specialty'; data: SpecialtyInfoUpdateData }
  | { section: 'staff'; data: StaffInfoUpdateData }
  | { section: 'education'; data: EducationInfoUpdateData }
  | { section: 'advanced'; data: AdvancedInfoUpdateData }
  | { section: 'other'; data: OtherInfoUpdateData };

/** セクション名からエラーメッセージへのマッピング */
const SECTION_ERROR_MAP: Record<FacilitySectionName, string> = {
  access: 'アクセス情報の更新に失敗しました',
  philosophy: '理念情報の更新に失敗しました',
  specialty: '特色情報の更新に失敗しました',
  staff: '職員情報の更新に失敗しました',
  education: '教育情報の更新に失敗しました',
  advanced: '多機能化情報の更新に失敗しました',
  images: '画像情報の更新に失敗しました',
  other: 'その他情報の更新に失敗しました',
} as const;

/**
 * セクション別に施設情報を更新する統合関数
 */
export async function updateFacilityBySection(
  supabase: SupabaseClient,
  facilityId: number,
  update: TabUpdateData,
): Promise<void> {
  if (update.section === 'basic') {
    await updateFacilityBasicInfo(supabase, facilityId, update.data);
    return;
  }

  const tableName = SECTION_TO_TABLE_MAP[update.section];
  const errorMessage = SECTION_ERROR_MAP[update.section];

  await updateFacilityData(supabase, tableName, facilityId, update.data, errorMessage);
}

/**
 * 新規施設を作成
 * @returns 作成された施設のID
 */
export async function createFacility(
  supabase: SupabaseClient,
  data: CreateFacilityData,
): Promise<number> {
  const { data: facility, error } = await supabase
    .from('facilities')
    .insert({
      name: data.name,
      corporation: data.corporation,
      postal_code: data.postal_code,
      prefecture: data.prefecture,
      city: data.city,
      address_detail: data.address_detail,
      annex_facilities: [],
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`施設の作成に失敗しました: ${error.message}`);
  }

  return facility.id;
}

/**
 * 施設を削除
 * 関連する詳細テーブルはCASCADE削除される想定
 */
export async function deleteFacility(supabase: SupabaseClient, facilityId: number): Promise<void> {
  const { error } = await supabase.from('facilities').delete().eq('id', facilityId);

  if (error) {
    throw new Error(`施設の削除に失敗しました: ${error.message}`);
  }
}

/**
 * 施設管理画面用の更新データ型（住所分割対応）
 */
export type FacilityManagementUpdateData = {
  name?: string;
  postal_code?: string;
  prefecture?: string;
  city?: string;
  address_detail?: string;
};

/**
 * 施設管理画面から施設の基本情報を更新（住所分割対応）
 */
export async function updateFacilityManagementInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: FacilityManagementUpdateData,
): Promise<void> {
  const cleanedData = removeUndefinedValues(data);

  if (Object.keys(cleanedData).length === 0) {
    return;
  }

  const { error } = await supabase.from('facilities').update(cleanedData).eq('id', facilityId);

  if (error) {
    throw new Error(`施設情報の更新に失敗しました: ${error.message}`);
  }
}

/**
 * GPS座標更新用のデータ型
 */
export type GeocoordinatesUpdateData = {
  lat: number;
  lng: number;
  location_address: string;
};

/**
 * 施設のGPS座標を更新
 */
export async function updateFacilityCoordinates(
  supabase: SupabaseClient,
  facilityId: number,
  data: GeocoordinatesUpdateData,
): Promise<void> {
  const { error } = await supabase
    .from('facility_access')
    .update({
      lat: data.lat,
      lng: data.lng,
      location_address: data.location_address,
    })
    .eq('facility_id', facilityId);

  if (error) {
    throw new Error(`GPS座標の更新に失敗しました: ${error.message}`);
  }
}

// =============================================================================
// 画像関連の操作
// =============================================================================

/** 画像データの型 */
export type FacilityImageData = {
  facility_id: number;
  image_type: 'thumbnail' | 'gallery';
  image_url: string;
  display_order: number;
};

/**
 * 施設画像をデータベースに登録
 */
export async function insertFacilityImage(
  supabase: SupabaseClient,
  data: FacilityImageData,
): Promise<{ id: number }> {
  const { data: result, error } = await supabase
    .from('facility_images')
    .insert(data)
    .select('id')
    .single();

  if (error) {
    throw new Error(`画像情報の登録に失敗しました: ${error.message}`);
  }

  return { id: result.id };
}

/**
 * 施設の画像一覧を取得
 */
export async function getFacilityImages(
  supabase: SupabaseClient,
  facilityId: number,
): Promise<(FacilityImageData & { id: number })[]> {
  const { data, error } = await supabase
    .from('facility_images')
    .select('id, facility_id, image_type, image_url, display_order')
    .eq('facility_id', facilityId)
    .order('image_type')
    .order('display_order');

  if (error) {
    throw new Error(`画像一覧の取得に失敗しました: ${error.message}`);
  }

  return data || [];
}

/** 新規画像データ（RPC用） */
export type NewImageInput = {
  image_type: 'thumbnail' | 'gallery';
  image_url: string;
  display_order: number;
};

/** RPC結果 */
type ManageFacilityImagesResult = {
  deleted_urls: string[];
  inserted_ids: number[];
};

/**
 * 施設画像の一括更新（削除・追加）をRPCで実行
 * DBトランザクション内でアトミックに処理し、ユニーク制約違反を回避
 */
export async function manageFacilityImages(
  supabase: SupabaseClient,
  facilityId: number,
  deleteIds: number[],
  newImages: NewImageInput[],
): Promise<ManageFacilityImagesResult> {
  const { data, error } = await supabase.rpc('manage_facility_images', {
    p_facility_id: facilityId,
    p_delete_ids: deleteIds,
    p_new_images: newImages,
  });

  if (error) {
    throw new Error(`画像の一括更新に失敗しました: ${error.message}`);
  }

  return data as ManageFacilityImagesResult;
}
