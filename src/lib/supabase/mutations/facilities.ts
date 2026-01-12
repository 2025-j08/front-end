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
  locationAppeal?: string;
  websiteUrl?: string;
  capacity?: number;
  provisionalCapacity?: number;
  relationInfo?: string;
};

/**
 * 理念情報の更新データ型
 */
export type PhilosophyInfoUpdateData = {
  description?: string;
};

/**
 * 特色情報の更新データ型
 */
export type SpecialtyInfoUpdateData = {
  features?: string[];
  programs?: string;
};

/**
 * 職員情報の更新データ型
 */
export type StaffInfoUpdateData = {
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

/**
 * 教育・進路支援情報の更新データ型
 */
export type EducationInfoUpdateData = {
  graduationRate?: string;
  learningSupport?: string;
  careerSupport?: string;
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
  futureOutlook?: string;
  freeText?: string;
};

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
 * facility_access テーブルの data カラム（JSONB）を更新
 * @param supabase - Supabaseクライアント
 * @param facilityId - 施設ID
 * @param data - 更新データ
 */
export async function updateFacilityAccessInfo(
  supabase: SupabaseClient,
  facilityId: number,
  data: AccessInfoUpdateData,
) {
  // 既存データを取得
  const { data: existing, error: fetchError } = await supabase
    .from('facility_access')
    .select('data')
    .eq('facility_id', facilityId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`アクセス情報の取得に失敗しました: ${fetchError.message}`);
  }

  // 既存のJSONBデータとマージ
  const mergedData = {
    ...(existing?.data || {}),
    ...data,
  };

  // upsert（存在すれば更新、なければ挿入）
  const { error } = await supabase
    .from('facility_access')
    .upsert({ facility_id: facilityId, data: mergedData }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`アクセス情報の更新に失敗しました: ${error.message}`);
  }
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
  const { error } = await supabase
    .from('facility_philosophy')
    .upsert({ facility_id: facilityId, data }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`理念情報の更新に失敗しました: ${error.message}`);
  }
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
  const { error } = await supabase
    .from('facility_specialty')
    .upsert({ facility_id: facilityId, data }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`特色情報の更新に失敗しました: ${error.message}`);
  }
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
  const { error } = await supabase
    .from('facility_staff')
    .upsert({ facility_id: facilityId, data }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`職員情報の更新に失敗しました: ${error.message}`);
  }
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
  const { error } = await supabase
    .from('facility_education')
    .upsert({ facility_id: facilityId, data }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`教育情報の更新に失敗しました: ${error.message}`);
  }
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
  const { error } = await supabase
    .from('facility_advanced')
    .upsert({ facility_id: facilityId, data }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`高機能化情報の更新に失敗しました: ${error.message}`);
  }
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
  const { error } = await supabase
    .from('facility_other')
    .upsert({ facility_id: facilityId, data }, { onConflict: 'facility_id' });

  if (error) {
    throw new Error(`その他情報の更新に失敗しました: ${error.message}`);
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
