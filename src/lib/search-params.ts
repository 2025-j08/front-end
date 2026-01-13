/**
 * 施設検索URLパラメータのユーティリティ
 * URLパラメータの構築・解析ロジックを一箇所に集約
 */

import type { FacilitySearchConditions } from '@/lib/supabase/queries/facilities';

/** 施設一覧ページのパス */
export const FACILITIES_LIST_PATH = '/features/facilities';

/**
 * URLパラメータの形式:
 * - cities: 大阪府:大阪市,堺市|兵庫県:神戸市
 * - types: 大舎,小舎
 * - keyword: 検索キーワード
 */

/**
 * 検索条件からURLSearchParamsを構築する
 */
export function buildSearchParams(conditions: FacilitySearchConditions): URLSearchParams {
  const params = new URLSearchParams();

  // 都道府県・市区町村
  const citiesParam = Object.entries(conditions.cities || {})
    .filter(([, cities]) => cities.length > 0)
    .map(([pref, cities]) => `${pref}:${cities.join(',')}`)
    .join('|');
  if (citiesParam) {
    params.set('cities', citiesParam);
  }

  // 施設形態
  if (conditions.types?.length) {
    params.set('types', conditions.types.join(','));
  }

  // キーワード
  const trimmedKeyword = conditions.keyword?.trim();
  if (trimmedKeyword) {
    params.set('keyword', trimmedKeyword);
  }

  return params;
}

/**
 * URLSearchParamsから検索条件を解析する
 */
export function parseSearchParams(searchParams: URLSearchParams): FacilitySearchConditions {
  const conditions: FacilitySearchConditions = {};

  // cities パラメータを解析
  const citiesParam = searchParams.get('cities');
  if (citiesParam) {
    const citiesMap: Record<string, string[]> = {};
    citiesParam.split('|').forEach((prefData) => {
      const [prefName, citiesStr] = prefData.split(':');
      if (prefName && citiesStr) {
        citiesMap[prefName] = citiesStr.split(',').filter(Boolean);
      }
    });
    if (Object.keys(citiesMap).length > 0) {
      conditions.cities = citiesMap;
    }
  }

  // types パラメータを解析
  const typesParam = searchParams.get('types');
  if (typesParam) {
    conditions.types = typesParam.split(',').filter(Boolean);
  }

  // keyword パラメータを解析
  const keywordParam = searchParams.get('keyword');
  if (keywordParam) {
    conditions.keyword = keywordParam;
  }

  return conditions;
}

/**
 * 検索条件から施設一覧ページのURLを構築する
 */
export function buildFacilitiesListUrl(conditions: FacilitySearchConditions): string {
  const params = buildSearchParams(conditions);
  const queryString = params.toString();
  return queryString ? `${FACILITIES_LIST_PATH}?${queryString}` : FACILITIES_LIST_PATH;
}
