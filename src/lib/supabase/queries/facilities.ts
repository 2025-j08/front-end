/**
 * Supabase施設データ取得クエリ
 * 施設の詳細情報を各テーブルから取得する関数群
 */

import type { PostgrestError } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/client';
import type {
  FacilityDetail,
  AnnexFacility,
  FacilityListItem,
  DormitoryType,
  PrefectureId,
} from '@/types/facility';
import { PREFECTURE_ID_TO_NAME } from '@/types/facility';

// ============================================
// 型定義
// ============================================

/** Supabaseのリレーション結果の型（facility_facility_types経由） */
interface FacilityTypeRelation {
  facility_types: { name: string }[] | { name: string } | null;
}

/**
 * リレーション結果から施設種類名を取得するヘルパー
 * Supabaseは1対多/多対1で配列/オブジェクトを返すため両方に対応
 */
function extractFacilityTypeName(relation: FacilityTypeRelation | null): string | undefined {
  if (!relation?.facility_types) return undefined;
  if (Array.isArray(relation.facility_types)) {
    return relation.facility_types[0]?.name;
  }
  return relation.facility_types.name;
}

/** 施設一覧取得時の検索条件 */
export interface FacilitySearchConditions {
  /** 都道府県ごとの市区町村マップ (例: { 'osaka': ['大阪市', '堺市'] }) */
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
  let query = supabase.from('facilities').select(
    hasTypeFilter
      ? `
      id,
      name,
      postal_code,
      phone,
      prefecture,
      city,
      address_detail,
      facility_facility_types!inner (
        facility_types!inner (
          name
        )
      )
    `
      : `
      id,
      name,
      postal_code,
      phone,
      prefecture,
      city,
      address_detail,
      facility_facility_types (
        facility_types (
          name
        )
      )
    `,
    { count: 'exact' },
  );

  // 検索条件によるフィルタリング
  if (conditions) {
    // 施設形態による絞り込み
    if (hasTypeFilter) {
      query = query.in('facility_facility_types.facility_types.name', conditions.types!);
    }

    // 都道府県・市区町村による絞り込み
    if (conditions.cities && Object.keys(conditions.cities).length > 0) {
      // 選択された都道府県と市区町村の条件を構築
      const orConditions: string[] = [];

      Object.entries(conditions.cities).forEach(([prefId, cities]) => {
        const prefName = PREFECTURE_ID_TO_NAME[prefId as PrefectureId];
        if (!prefName) return;

        if (cities.length === 0) {
          // 都道府県のみ選択（市区町村未選択）の場合は、その都道府県全体を対象
          orConditions.push(`prefecture.eq.${prefName}`);
        } else {
          // 市区町村が選択されている場合
          cities.forEach((city) => {
            orConditions.push(`and(prefecture.eq.${prefName},city.eq.${city})`);
          });
        }
      });

      if (orConditions.length > 0) {
        query = query.or(orConditions.join(','));
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
    const facilityTypes = facility.facility_facility_types as FacilityTypeRelation[];
    const facilityType = extractFacilityTypeName(facilityTypes?.[0]);

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
