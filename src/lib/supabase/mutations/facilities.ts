/**
 * Supabase施設データ更新用ミューテーション
 * 施設の詳細情報を各テーブルに更新する関数群
 */

import type { SupabaseClient } from '@supabase/supabase-js';

import type { FacilityDetail, AnnexFacility } from '@/types/facility';

/**
 * 基本情報の更新データ型
 */
export type BasicInfoUpdateData = {
  name?: string;
  phone?: string;
  corporation?: string;
  established_year?: number;
  annex_facilities?: AnnexFacility[];
};

/**
 * アクセス情報の更新データ型
 */
export type AccessInfoUpdateData = {
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
 * 共通のupsertヘルパー関数（正規化されたスキーマ対応）
 * @param supabase - Supabaseクライアント
 * @param tableName - テーブル名
 * @param facilityId - 施設ID
 * @param data - 更新データ（個別カラムのデータ）
 * @param errorMessage - エラーメッセージ
 */
async function upsertFacilityData(
  supabase: SupabaseClient,
  tableName: string,
  facilityId: number,
  data: Record<string, unknown>,
  errorMessage: string,
) {
  const { error } = await supabase
    .from(tableName)
    .upsert({ facility_id: facilityId, ...data }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`${errorMessage}: ${error.message}`);
  }
}

/**
 * 施設の基本情報を更新
 * @param supabase - Supabaseクライアント（サーバー側から渡される）
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityBasicInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: BasicInfoUpdateData,
) {
  const { error } = await supabase.from('facilities').update(data).eq('id', facilityId);

  if (error) {
    throw new Error(`基本情報の更新に失敗しました: ${error.message}`);
  }
}

/**
 * アクセス情報を更新（upsert形式）
 * facility_access テーブルの個別カラムを更新
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityAccessInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: AccessInfoUpdateData,
) {
  await upsertFacilityData(
    supabase,
    'facility_access',
    facilityId,
    data,
    'アクセス情報の更新に失敗しました',
  );
}

/**
 * 理念情報を更新（upsert形式）
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityPhilosophyInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: PhilosophyInfoUpdateData,
) {
  await upsertFacilityData(
    supabase,
    'facility_philosophy',
    facilityId,
    data,
    '理念情報の更新に失敗しました',
  );
}

/**
 * 特色情報を更新（upsert形式）
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilitySpecialtyInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: SpecialtyInfoUpdateData,
) {
  await upsertFacilityData(
    supabase,
    'facility_specialty',
    facilityId,
    data,
    '特色情報の更新に失敗しました',
  );
}

/**
 * 職員情報を更新（upsert形式）
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityStaffInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: StaffInfoUpdateData,
) {
  await upsertFacilityData(
    supabase,
    'facility_staff',
    facilityId,
    data,
    '職員情報の更新に失敗しました',
  );
}

/**
 * 教育・進路支援情報を更新（upsert形式）
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityEducationInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: EducationInfoUpdateData,
) {
  await upsertFacilityData(
    supabase,
    'facility_education',
    facilityId,
    data,
    '教育情報の更新に失敗しました',
  );
}

/**
 * 高機能化・多機能化情報を更新（upsert形式）
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityAdvancedInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: AdvancedInfoUpdateData,
) {
  await upsertFacilityData(
    supabase,
    'facility_advanced',
    facilityId,
    data,
    '高機能化情報の更新に失敗しました',
  );
}

/**
 * その他情報を更新（upsert形式）
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityOtherInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: OtherInfoUpdateData,
) {
  await upsertFacilityData(
    supabase,
    'facility_other',
    facilityId,
    data,
    'その他情報の更新に失敗しました',
  );
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

/**
 * セクション別に施設情報を更新する統合関数
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param updates - セクション別の更新データ
 */
export async function updateFacilityBySection(
  supabase: SupabaseClient,
  facilityId: number,
  update: TabUpdateData,
) {
  switch (update.section) {
    case 'basic':
      await updateFacilityBasicInfo(supabase, facilityId, update.data);
      break;
    case 'access':
      await updateFacilityAccessInfo(supabase, facilityId, update.data);
      break;
    case 'philosophy':
      await updateFacilityPhilosophyInfo(supabase, facilityId, update.data);
      break;
    case 'specialty':
      await updateFacilitySpecialtyInfo(supabase, facilityId, update.data);
      break;
    case 'staff':
      await updateFacilityStaffInfo(supabase, facilityId, update.data);
      break;
    case 'education':
      await updateFacilityEducationInfo(supabase, facilityId, update.data);
      break;
    case 'advanced':
      await updateFacilityAdvancedInfo(supabase, facilityId, update.data);
      break;
    case 'other':
      await updateFacilityOtherInfo(supabase, facilityId, update.data);
      break;
  }
}
