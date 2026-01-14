/**
 * バリデーション関連の定数
 */

/**
 * 正規表現パターン
 */
export const VALIDATION_PATTERNS = {
  /** 電話番号（日本形式） */
  PHONE: /^0\d{1,4}[-]?\d{1,4}[-]?\d{3,4}$/,
  /** 郵便番号（日本形式） */
  POSTAL_CODE: /^\d{3}-?\d{4}$/,
} as const;

/**
 * 緯度経度の範囲
 */
export const GEO_BOUNDS = {
  LATITUDE_MIN: -90,
  LATITUDE_MAX: 90,
  LONGITUDE_MIN: -180,
  LONGITUDE_MAX: 180,
} as const;

/**
 * 緯度が有効範囲内かチェック
 */
export const isValidLatitude = (lat: number | undefined): boolean => {
  if (lat === undefined) return true;
  return lat >= GEO_BOUNDS.LATITUDE_MIN && lat <= GEO_BOUNDS.LATITUDE_MAX;
};

/**
 * 経度が有効範囲内かチェック
 */
export const isValidLongitude = (lng: number | undefined): boolean => {
  if (lng === undefined) return true;
  return lng >= GEO_BOUNDS.LONGITUDE_MIN && lng <= GEO_BOUNDS.LONGITUDE_MAX;
};

/**
 * 電話番号が有効形式かチェック
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return VALIDATION_PATTERNS.PHONE.test(phone.replace(/\s/g, ''));
};

/**
 * URLが有効形式かチェック
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
