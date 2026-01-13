/**
 * Supabase施設データ取得クエリ
 * 施設の詳細情報を各テーブルから取得する関数群
 */

import type { PostgrestError } from '@supabase/supabase-js';

import { KINKI_PREFECTURES } from '@/const/searchConditions';
import { createClient } from '@/lib/supabase/client';
import {
  FACILITY_DETAIL_TABLE_LABELS,
  type FacilityDetailTableName,
} from '@/lib/supabase/constants/facility-tables';
import { extractFirstFromRelation } from '@/lib/supabase/utils/relation-helpers';
import type {
  FacilityDetail,
  AnnexFacility,
  FacilityListItem,
  DormitoryType,
} from '@/types/facility';
import type { FacilityLocation } from '@/types/facilityLocation';

// ============================================
// 型定義
// ============================================

/** Supabaseのリレーション結果の型（facility_facility_types経由） */
interface FacilityTypeRelation {
  facility_types: { name: string }[] | { name: string } | null;
}

/**
 * リレーション結果から施設種類名を取得するヘルパー
 */
function extractFacilityTypeName(relation: FacilityTypeRelation | null): string | undefined {
  if (!relation?.facility_types) return undefined;
  const facilityType = extractFirstFromRelation(relation.facility_types);
  return facilityType?.name;
}

/**
 * 都道府県・市区町村マップからSupabase用のOR条件を構築する
 * @param citiesMap - 都道府県をキー、市区町村配列を値とするマップ
 * @returns Supabaseのor()に渡す条件文字列の配列
 */
function buildCityFilterConditions(citiesMap: Record<string, string[]>): string[] {
  return Object.entries(citiesMap).flatMap(([prefName, cities]) =>
    cities.length === 0
      ? [`prefecture.eq.${prefName}`]
      : cities.map((city) => `and(prefecture.eq.${prefName},city.eq.${city})`),
  );
}

/** 施設一覧取得用のselect文（基本フィールド） */
const FACILITY_LIST_BASE_FIELDS = `
  id,
  name,
  postal_code,
  phone,
  prefecture,
  city,
  address_detail
`;

/** 施設一覧取得用のselect文（通常） */
const FACILITY_LIST_SELECT = `
  ${FACILITY_LIST_BASE_FIELDS},
  facility_facility_types (
    facility_types (
      name
    )
  )
`;

/** 施設一覧取得用のselect文（施設形態フィルタあり、inner join） */
const FACILITY_LIST_SELECT_WITH_TYPE_FILTER = `
  ${FACILITY_LIST_BASE_FIELDS},
  facility_facility_types!inner (
    facility_types!inner (
      name
    )
  )
`;

/** 施設一覧取得時の検索条件 */
export interface FacilitySearchConditions {
  /** 都道府県ごとの市区町村マップ (例: { '大阪府': ['大阪市', '堺市'] }) */
  cities?: Record<string, string[]>;
  /** 施設形態 (例: ['大舎', '小舎']) */
  types?: string[];
  /** キーワード検索 */
  keyword?: string;
}

/** 施設一覧取得結果 */
export interface FacilityListResult {
  facilities: FacilityListItem[];
  totalCount: number;
}

/**
 * 施設一覧を取得する
 * 検索条件に基づいてフィルタリングし、県→市→施設名の五十音順でソート
 *
 * @param conditions - 検索条件（省略時は全施設を取得）
 * @param page - ページ番号（1始まり）
 * @param limit - 1ページあたりの件数
 * @returns 施設一覧と総件数
 */
export async function getFacilityList(
  conditions?: FacilitySearchConditions,
  page: number = 1,
  limit: number = 10,
): Promise<FacilityListResult> {
  const supabase = createClient();

  // 施設形態フィルタの有無でクエリを分岐
  // !inner を使うとそのリレーションが存在する行のみに絞り込める
  const hasTypeFilter = conditions?.types && conditions.types.length > 0;

  // 基本クエリ: 施設基本情報 + 施設種類を取得
  const selectQuery = hasTypeFilter ? FACILITY_LIST_SELECT_WITH_TYPE_FILTER : FACILITY_LIST_SELECT;
  let query = supabase.from('facilities').select(selectQuery, { count: 'exact' });

  // 検索条件によるフィルタリング
  if (conditions) {
    // 施設形態による絞り込み
    if (hasTypeFilter) {
      query = query.in('facility_facility_types.facility_types.name', conditions.types!);
    }

    // 都道府県・市区町村による絞り込み
    if (conditions.cities && Object.keys(conditions.cities).length > 0) {
      const cityFilters = buildCityFilterConditions(conditions.cities);
      if (cityFilters.length > 0) {
        query = query.or(cityFilters.join(','));
      }
    }

    // キーワード検索（施設名で部分一致）
    if (conditions.keyword && conditions.keyword.trim()) {
      query = query.ilike('name', `%${conditions.keyword.trim()}%`);
    }
  }

  // ソート: 都道府県 → 市区町村 → 施設名（すべて五十音順）
  query = query.order('prefecture', { ascending: true });
  query = query.order('city', { ascending: true });
  query = query.order('name', { ascending: true });

  // ページネーション
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`施設一覧の取得に失敗しました: ${error.message}`);
  }

  // データを FacilityListItem 型に変換
  const facilities: FacilityListItem[] = (data || []).map((facility) => {
    // 施設種類を取得（最初の1件のみ）
    const firstRelation = extractFirstFromRelation(
      facility.facility_facility_types as FacilityTypeRelation[] | FacilityTypeRelation | null,
    );
    const facilityType = extractFacilityTypeName(firstRelation ?? null);

    return {
      id: facility.id,
      name: facility.name,
      postalCode: facility.postal_code,
      address: `${facility.prefecture}${facility.city}${facility.address_detail}`,
      phone: facility.phone,
      imagePath: null, // 画像は現状未対応
      prefecture: facility.prefecture,
      city: facility.city,
      facilityType,
    };
  });

  return {
    facilities,
    totalCount: count || 0,
  };
}

/**
 * 施設の総数を取得する（検索条件なし）
 */
export async function getFacilityTotalCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('facilities')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`施設総数の取得に失敗しました: ${error.message}`);
  }

  return count || 0;
}

// ============================================
// 住所情報取得（検索画面用）
// ============================================

/** 都道府県と市区町村のマッピング */
export interface PrefectureCitiesMap {
  [prefecture: string]: string[];
}

/**
 * Supabaseから都道府県・市区町村の選択肢を取得する
 * 関西6府県のみにフィルタリングし、都道府県ごとに市区町村をグループ化
 *
 * @returns 都道府県をキー、市区町村配列を値とするマップ
 */
export async function getPrefectureCities(): Promise<PrefectureCitiesMap> {
  const supabase = createClient();

  // 都道府県と市区町村のユニークな組み合わせを取得
  const { data, error } = await supabase
    .from('facilities')
    .select('prefecture, city')
    .in('prefecture', KINKI_PREFECTURES)
    .order('prefecture', { ascending: true })
    .order('city', { ascending: true });

  if (error) {
    throw new Error(`住所情報の取得に失敗しました: ${error.message}`);
  }

  // 都道府県ごとに市区町村をグループ化（重複を排除）
  const result: PrefectureCitiesMap = {};

  // 関西6府県を初期化（データがなくても空配列で表示するため）
  KINKI_PREFECTURES.forEach((pref) => {
    result[pref] = [];
  });

  // データをグループ化
  (data || []).forEach((row) => {
    if (row.prefecture && row.city) {
      if (!result[row.prefecture].includes(row.city)) {
        result[row.prefecture].push(row.city);
      }
    }
  });

  return result;
}

// ============================================
// 地図表示用データ取得
// ============================================

/**
 * 地図表示用の施設位置情報を取得する
 * 関西6府県の施設のみを取得し、緯度経度が設定されているもののみを返す
 *
 * @returns 施設位置情報の配列
 */
export async function getFacilityLocations(): Promise<FacilityLocation[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('facilities')
    .select(
      `
      id,
      name,
      postal_code,
      phone,
      prefecture,
      city,
      address_detail,
      facility_access (
        lat,
        lng
      )
    `,
    )
    .in('prefecture', KINKI_PREFECTURES)
    .order('prefecture', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`施設位置情報の取得に失敗しました: ${error.message}`);
  }

  // Supabaseのリレーションは配列または単一オブジェクトで返される
  type AccessData = { lat: number; lng: number } | { lat: number; lng: number }[] | null;

  // 緯度経度が設定されている施設のみを返す
  return (data || [])
    .map((facility) => {
      const accessItem = extractFirstFromRelation(facility.facility_access as AccessData);
      return { facility, accessItem };
    })
    .filter(({ accessItem }) => accessItem?.lat && accessItem?.lng)
    .map(({ facility, accessItem }) => ({
      id: facility.id,
      name: facility.name,
      postalCode: facility.postal_code,
      address: `${facility.prefecture}${facility.city}${facility.address_detail}`,
      phone: facility.phone,
      lat: accessItem!.lat,
      lng: accessItem!.lng,
    }));
}

// ============================================
// 施設詳細取得
// ============================================

/**
 * 詳細テーブルのエラーチェック用ヘルパー関数
 * PGRST116（データが存在しない）以外のエラーをスロー
 */
function checkDetailTableError(result: { error: PostgrestError | null }, tableName: string): void {
  if (result.error && result.error.code !== 'PGRST116') {
    throw new Error(`${tableName}の取得に失敗しました: ${result.error.message}`);
  }
}

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
async function getFacilityTypes(id: number): Promise<DormitoryType | undefined> {
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
  const firstType = facilityTypes?.[0] as FacilityTypeRelation | undefined;
  const typeName = extractFacilityTypeName(firstType ?? null);

  // DormitoryType として有効な値かチェック
  const validTypes: DormitoryType[] = ['大舎', '中舎', '小舎', 'グループホーム', '地域小規模'];
  return validTypes.includes(typeName as DormitoryType) ? (typeName as DormitoryType) : undefined;
}

/** 詳細テーブル取得用のキー（順序を明示的に定義） */
const DETAIL_TABLE_KEYS = [
  'facility_access',
  'facility_philosophy',
  'facility_specialty',
  'facility_staff',
  'facility_education',
  'facility_advanced',
  'facility_other',
] as const satisfies FacilityDetailTableName[];

/**
 * 各詳細テーブルからデータを並列取得
 * @param id - 施設ID
 * @returns 各詳細情報のデータ（存在しない場合はnull）
 * @throws データ取得エラー時はErrorをスロー（データが存在しない場合は除く）
 */
async function getFacilityDetailTables(id: number) {
  const supabase = createClient();

  const results = await Promise.all(
    DETAIL_TABLE_KEYS.map((tableName) =>
      supabase.from(tableName).select('*').eq('facility_id', id).single(),
    ),
  );

  // エラーチェック
  results.forEach((result, index) => {
    checkDetailTableError(result, FACILITY_DETAIL_TABLE_LABELS[DETAIL_TABLE_KEYS[index]]);
  });

  // 明示的なキーでオブジェクトを構築（配列順序への依存を排除）
  return {
    access: results[0].data,
    philosophy: results[1].data,
    specialty: results[2].data,
    staff: results[3].data,
    education: results[4].data,
    advanced: results[5].data,
    other: results[6].data,
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

  // 4. 各詳細テーブルのデータを展開
  const { access, philosophy, specialty, staff, education, advanced, other } = detailTables;

  const accessInfo = {
    locationAddress: access?.location_address || fullAddress,
    lat: access?.lat || 0,
    lng: access?.lng || 0,
    station: access?.station,
    description: access?.description,
    locationAppeal: access?.location_appeal,
  };

  // 5. FacilityDetail 型に整形
  const facilityDetail: FacilityDetail = {
    id: facility.id,
    name: facility.name,
    fullAddress,
    phone: facility.phone,
    dormitoryType,
    targetAge: access?.target_age || '0～18歳',
    accessInfo,
    corporation: facility.corporation,
    websiteUrl: access?.website_url,
    establishedYear: facility.established_year?.toString(),
    building: access?.building,
    capacity: access?.capacity || undefined,
    provisionalCapacity: access?.provisional_capacity || undefined,
    annexFacilities,
    relationInfo: access?.relation_info,
    philosophyInfo: philosophy
      ? {
          message: philosophy.message || undefined,
          description: philosophy.description,
        }
      : undefined,
    specialtyInfo: specialty
      ? {
          features: specialty.features || undefined,
          programs: specialty.programs || undefined,
        }
      : undefined,
    staffInfo: staff
      ? {
          fullTimeStaffCount: staff.full_time_staff_count || undefined,
          partTimeStaffCount: staff.part_time_staff_count || undefined,
          specialties: staff.specialties || undefined,
          averageTenure: staff.average_tenure || undefined,
          ageDistribution: staff.age_distribution || undefined,
          workStyle: staff.work_style || undefined,
          hasUniversityLecturer: staff.has_university_lecturer || undefined,
          lectureSubjects: staff.lecture_subjects || undefined,
          externalActivities: staff.external_activities || undefined,
          qualificationsAndSkills: staff.qualifications_and_skills || undefined,
          internshipDetails: staff.internship_details || undefined,
        }
      : undefined,
    educationInfo: education
      ? {
          graduationRate: education.graduation_rate || undefined,
          graduationRatePercentage: education.graduation_rate_percentage || undefined,
          learningSupport: education.learning_support || undefined,
          careerSupport: education.career_support || undefined,
        }
      : undefined,
    advancedInfo: advanced
      ? {
          title: advanced.title || undefined,
          description: advanced.description,
          background: advanced.background || undefined,
          challenges: advanced.challenges || undefined,
          solutions: advanced.solutions || undefined,
        }
      : undefined,
    otherInfo: other
      ? {
          title: other.title || undefined,
          description: other.description || undefined,
          networks: other.networks || undefined,
          futureOutlook: other.future_outlook || undefined,
          freeText: other.free_text || undefined,
        }
      : undefined,
  };

  return facilityDetail;
}
