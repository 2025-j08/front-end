/**
 * フィールド名マッピングユーティリティ
 * camelCaseとsnake_case間の型安全な変換
 */

import type { FacilityDetail } from '@/types/facility';
import type { TabUpdateData } from '@/lib/supabase/mutations/facilities';

/** タブセクション名の配列（動的生成用） */
export const TAB_SECTIONS = [
  'basic',
  'access',
  'philosophy',
  'specialty',
  'staff',
  'education',
  'advanced',
  'images',
  'other',
] as const;

/** タブセクション名 */
export type TabSection = (typeof TAB_SECTIONS)[number];

/**
 * 基本情報のフィールドマッピング
 */
export const basicInfoFieldMapping = {
  establishedYear: 'established_year',
  annexFacilities: 'annex_facilities',
} as const;

/**
 * camelCaseのフィールド名をsnake_caseに変換
 * マッピングが定義されていない場合はそのまま返す
 */
export function toSnakeCase<T extends string>(
  field: T,
  mapping: Record<string, string> = basicInfoFieldMapping,
): string {
  return mapping[field] || field;
}

/**
 * snake_caseのフィールド名をcamelCaseに変換
 */
export function toCamelCase(field: string, mapping: Record<string, string>): string {
  const reverseMapping = Object.entries(mapping).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {} as Record<string, string>,
  );
  return reverseMapping[field] || field;
}

// ============================================
// セクション別フィールド設定
// ============================================

/**
 * フィールド設定の型
 * - source: FacilityDetail内のフィールドパス（ネストはドット記法）
 * - target: API送信時のsnake_caseキー
 * - transform: 値変換関数（オプション）
 */
type FieldConfig = {
  source: string;
  target: string;
  transform?: (value: unknown) => unknown;
};

/**
 * セクション別のフィールド設定
 */
const SECTION_FIELD_CONFIGS: Record<TabSection, FieldConfig[]> = {
  basic: [
    { source: 'name', target: 'name' },
    { source: 'phone', target: 'phone' },
    { source: 'corporation', target: 'corporation' },
    {
      source: 'establishedYear',
      target: 'established_year',
      transform: (v) => {
        if (!v) return undefined;
        const parsed = parseInt(v as string, 10);
        return isNaN(parsed) ? undefined : parsed;
      },
    },
    { source: 'annexFacilities', target: 'annex_facilities' },
    { source: 'dormitoryType', target: 'dormitory_type' },
  ],
  access: [
    { source: 'accessInfo.locationAddress', target: 'location_address' },
    { source: 'accessInfo.lat', target: 'lat' },
    { source: 'accessInfo.lng', target: 'lng' },
    { source: 'targetAge', target: 'target_age' },
    { source: 'building', target: 'building' },
    { source: 'accessInfo.description', target: 'description' },
    { source: 'accessInfo.locationAppeal', target: 'location_appeal' },
    { source: 'websiteUrl', target: 'website_url' },
    { source: 'capacity', target: 'capacity' },
    { source: 'provisionalCapacity', target: 'provisional_capacity' },
    { source: 'relationInfo', target: 'relation_info' },
  ],
  philosophy: [
    { source: 'philosophyInfo.message', target: 'message' },
    { source: 'philosophyInfo.description', target: 'description' },
  ],
  specialty: [
    { source: 'specialtyInfo.features', target: 'features' },
    { source: 'specialtyInfo.programs', target: 'programs' },
  ],
  staff: [
    { source: 'staffInfo.fullTimeStaffCount', target: 'full_time_staff_count' },
    { source: 'staffInfo.partTimeStaffCount', target: 'part_time_staff_count' },
    { source: 'staffInfo.specialties', target: 'specialties' },
    { source: 'staffInfo.averageTenure', target: 'average_tenure' },
    { source: 'staffInfo.ageDistribution', target: 'age_distribution' },
    { source: 'staffInfo.workStyle', target: 'work_style' },
    { source: 'staffInfo.hasUniversityLecturer', target: 'has_university_lecturer' },
    { source: 'staffInfo.lectureSubjects', target: 'lecture_subjects' },
    { source: 'staffInfo.externalActivities', target: 'external_activities' },
    { source: 'staffInfo.qualificationsAndSkills', target: 'qualifications_and_skills' },
    { source: 'staffInfo.internshipDetails', target: 'internship_details' },
  ],
  education: [
    { source: 'educationInfo.graduationRate', target: 'graduation_rate' },
    { source: 'educationInfo.graduationRatePercentage', target: 'graduation_rate_percentage' },
    { source: 'educationInfo.learningSupport', target: 'learning_support' },
    { source: 'educationInfo.careerSupport', target: 'career_support' },
  ],
  advanced: [
    { source: 'advancedInfo.description', target: 'description' },
    { source: 'advancedInfo.background', target: 'background' },
    { source: 'advancedInfo.challenges', target: 'challenges' },
    { source: 'advancedInfo.solutions', target: 'solutions' },
  ],
  // 画像は別途アップロード処理されるため、フィールドマッピングは不要
  images: [],
  other: [
    { source: 'otherInfo.title', target: 'title' },
    { source: 'otherInfo.description', target: 'description' },
    { source: 'otherInfo.networks', target: 'networks' },
    { source: 'otherInfo.futureOutlook', target: 'future_outlook' },
    { source: 'otherInfo.freeText', target: 'free_text' },
  ],
};

/**
 * ネストしたセクションかどうかを判定
 * （philosophyInfo, specialtyInfo などはnullの場合、更新データを返さない）
 */
const NULLABLE_SECTIONS: TabSection[] = ['philosophy', 'specialty', 'advanced'];

/**
 * ドット記法のパスからネストした値を取得
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

/**
 * セクション別に更新データを構築するヘルパー関数
 */
export function buildUpdateData(
  section: TabSection,
  formData: Partial<FacilityDetail>,
): TabUpdateData | null {
  const configs = SECTION_FIELD_CONFIGS[section];

  // nullable セクションの場合、ソースオブジェクトが存在するかチェック
  if (NULLABLE_SECTIONS.includes(section)) {
    const sectionKey = `${section}Info` as keyof FacilityDetail;
    if (!formData[sectionKey]) {
      return null;
    }
  }

  // フィールド設定に基づいてデータを構築
  const data: Record<string, unknown> = {};
  for (const config of configs) {
    const value = getNestedValue(formData as Record<string, unknown>, config.source);
    const transformedValue = config.transform ? config.transform(value) : value;
    data[config.target] = transformedValue;
  }

  return {
    section,
    data,
  } as TabUpdateData;
}
