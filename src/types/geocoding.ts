/**
 * ジオコーディング API 関連の型定義
 * Yahoo ジオコーダ API を使用した住所→座標変換機能で使用
 */

/**
 * POST /api/geocode のリクエスト型
 * 住所から GPS 座標を取得する際に送信するデータ
 */
export interface GeocodeRequest {
  /** 変換対象の住所（都道府県から番地まで含む完全な住所） */
  address: string;
}

/**
 * GPS座標
 */
export interface Coordinates {
  /** 緯度 (-90 ～ 90) */
  lat: number;
  /** 経度 (-180 ～ 180) */
  lng: number;
}

/**
 * ジオコーディング成功時のレスポンス
 */
export interface GeocodeResponseSuccess {
  /** 変換が成功したことを示す */
  success: true;
  /** GPS座標 */
  coordinates: Coordinates;
  /** エラーフィールドは存在しない */
  error?: never;
}

/**
 * ジオコーディング失敗時のレスポンス
 */
export interface GeocodeResponseError {
  /** 変換が失敗したことを示す */
  success: false;
  /** エラーメッセージ */
  error: string;
  /** 座標フィールドは存在しない */
  coordinates?: never;
}

/**
 * ジオコーディング API のレスポンス型
 * success フィールドの値によって型が自動的に絞り込まれる
 *
 * @example
 * if (response.success) {
 *   // response.coordinates が利用可能
 *   console.log(response.coordinates.lat, response.coordinates.lng);
 * } else {
 *   // response.error が利用可能
 *   console.log(response.error);
 * }
 */
export type GeocodeResponse = GeocodeResponseSuccess | GeocodeResponseError;

/**
 * Yahoo ジオコーダ API V2 のレスポンス型（内部使用）
 * @see https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v2/geocoder.html
 */
export interface YahooGeocodeApiResponse {
  ResultInfo: {
    Count: number;
    Total: number;
    Start: number;
    Status: number;
    Description?: string;
  };
  Feature?: Array<{
    Geometry: {
      /** "緯度,経度" 形式の文字列 */
      Coordinates: string;
    };
    Property: {
      Address: string;
    };
  }>;
}
