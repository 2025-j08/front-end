/**
 * 施設詳細表示用のフォーマッター関数群
 * 表示ロジックを一元管理し、再利用性とテスタビリティを向上
 */

/**
 * 定員情報をフォーマット
 * @param capacity - 定員数
 * @param provisionalCapacity - 暫定定員数（オプション）
 * @returns フォーマット済み定員文字列（例: "50名（暫定60名）"）
 */
export const formatCapacity = (capacity?: number, provisionalCapacity?: number): string => {
  if (!capacity) return '-';
  if (provisionalCapacity) {
    return `${capacity}名（暫定${provisionalCapacity}名）`;
  }
  return `${capacity}名`;
};

/**
 * 住所情報を連結してフルアドレス文字列を生成
 * @param prefecture - 都道府県
 * @param city - 市区町村
 * @param addressDetail - 詳細住所
 * @returns 完全な住所文字列
 */
export const formatAddress = (prefecture: string, city: string, addressDetail: string): string => {
  return `${prefecture}${city}${addressDetail}`;
};

/**
 * 年情報をフォーマット（西暦→表示形式）
 * @param year - 年（数値または文字列）
 * @returns フォーマット済み年表示（例: "2010年"）、未定義の場合は "-"
 */
export const formatYear = (year?: string | number): string => {
  if (!year) return '-';
  return `${year}年`;
};

/**
 * 電話番号をフォーマット（ハイフンを統一）
 * @param phone - 電話番号文字列
 * @returns フォーマット済み電話番号、未定義の場合は "-"
 */
export const formatPhone = (phone?: string): string => {
  if (!phone) return '-';
  // 既にハイフンが含まれている場合はそのまま返す
  return phone;
};

/**
 * 汎用的な文字列値フォーマッター（未定義の場合に "-" を返す）
 * @param value - 任意の文字列値
 * @returns 値が存在する場合はそのまま、未定義の場合は "-"
 */
export const formatOptionalString = (value?: string): string => {
  return value || '-';
};

/**
 * 汎用的な数値フォーマッター（未定義の場合に "-" を返す）
 * @param value - 任意の数値
 * @returns 値が存在する場合は文字列化、未定義の場合は "-"
 */
export const formatOptionalNumber = (value?: number): string => {
  return value !== undefined ? String(value) : '-';
};
