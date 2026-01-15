/**
 * 施設関連テーブルの定数定義
 * queries/mutations で共通利用するテーブル名とメッセージのマッピング
 */

/** 施設詳細テーブル名 */
export type FacilityDetailTableName =
  | 'facility_access'
  | 'facility_philosophy'
  | 'facility_specialty'
  | 'facility_staff'
  | 'facility_education'
  | 'facility_advanced'
  | 'facility_other';

/** 詳細テーブル名と日本語名のマッピング */
export const FACILITY_DETAIL_TABLE_LABELS: Record<FacilityDetailTableName, string> = {
  facility_access: 'アクセス情報',
  facility_philosophy: '運営方針',
  facility_specialty: '特色・強み',
  facility_staff: 'スタッフ情報',
  facility_education: '教育支援',
  facility_advanced: '高度な取り組み',
  facility_other: 'その他情報',
} as const;

/** セクション名からテーブル名へのマッピング */
export type FacilitySectionName =
  | 'access'
  | 'philosophy'
  | 'specialty'
  | 'staff'
  | 'education'
  | 'advanced'
  | 'other';

export const SECTION_TO_TABLE_MAP: Record<FacilitySectionName, FacilityDetailTableName> = {
  access: 'facility_access',
  philosophy: 'facility_philosophy',
  specialty: 'facility_specialty',
  staff: 'facility_staff',
  education: 'facility_education',
  advanced: 'facility_advanced',
  other: 'facility_other',
} as const;

/**
 * API で有効なセクション名の配列
 * TabUpdateData のセクション + management セクション + coordinates セクションを含む
 */
export const VALID_API_SECTIONS = [
  'basic',
  'access',
  'philosophy',
  'specialty',
  'staff',
  'education',
  'advanced',
  'other',
  'management',
  'coordinates',
] as const;

/** API で有効なセクション名の型 */
export type ValidApiSection = (typeof VALID_API_SECTIONS)[number];
