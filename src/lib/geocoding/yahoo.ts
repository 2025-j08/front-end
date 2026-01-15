/**
 * Yahoo ジオコーダ API V2 を使用したジオコーディング機能
 * @see https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v2/geocoder.html
 */

import type { Coordinates, YahooGeocodeApiResponse } from '@/types/geocoding';

const YAHOO_GEOCODE_API_URL = 'https://map.yahooapis.jp/geocode/V2/geoCoder';

/**
 * Yahoo ジオコーダ API のエラーメッセージ
 */
export const GEOCODING_ERROR_MESSAGES = {
  MISSING_APP_ID: 'Yahoo APIのアプリケーションIDが設定されていません',
  ADDRESS_NOT_FOUND: '住所が見つかりませんでした',
  API_ERROR: 'ジオコーディングAPIでエラーが発生しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  INVALID_RESPONSE: 'APIレスポンスの形式が不正です',
} as const;

/**
 * Yahoo ジオコーダ API を呼び出して住所から座標を取得する
 *
 * @param address - 変換対象の住所
 * @returns GPS座標
 * @throws Error - API呼び出しに失敗した場合
 *
 * @example
 * ```typescript
 * const coords = await geocodeAddress('大阪府大阪市中央区本町1-1-1');
 * console.log(coords.lat, coords.lng); // 34.xxx, 135.xxx
 * ```
 */
export async function geocodeAddress(address: string): Promise<Coordinates> {
  const appId = process.env.YAHOO_GEOCODING_APP_ID;

  if (!appId) {
    throw new Error(GEOCODING_ERROR_MESSAGES.MISSING_APP_ID);
  }

  const params = new URLSearchParams({
    appid: appId,
    query: address,
    output: 'json',
  });

  const response = await fetch(`${YAHOO_GEOCODE_API_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(GEOCODING_ERROR_MESSAGES.API_ERROR);
  }

  const data: YahooGeocodeApiResponse = await response.json();

  if (data.ResultInfo.Count === 0 || !data.Feature || data.Feature.length === 0) {
    throw new Error(GEOCODING_ERROR_MESSAGES.ADDRESS_NOT_FOUND);
  }

  const coordinates = data.Feature[0].Geometry.Coordinates;
  const [lng, lat] = coordinates.split(',').map(Number);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error(GEOCODING_ERROR_MESSAGES.INVALID_RESPONSE);
  }

  return { lat, lng };
}
