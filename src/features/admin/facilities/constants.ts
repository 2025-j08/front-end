/**
 * 施設管理機能で使用する定数
 */

/**
 * 施設フォームのバリデーションメッセージ
 */
export const FACILITY_FORM_VALIDATION = {
  NAME_REQUIRED: '施設名を入力してください',
  CORPORATION_REQUIRED: '運営法人名を入力してください',
  POSTAL_CODE_REQUIRED: '郵便番号を入力してください',
  POSTAL_CODE_FIRST_REQUIRED: '郵便番号（前半）を入力してください',
  POSTAL_CODE_FIRST_INVALID: '3桁の数字を入力してください',
  POSTAL_CODE_SECOND_REQUIRED: '郵便番号（後半）を入力してください',
  POSTAL_CODE_SECOND_INVALID: '4桁の数字を入力してください',
  POSTAL_CODE_INVALID: '郵便番号の形式が正しくありません（例: 123-4567）',
  CITY_REQUIRED: '市区町村を入力してください',
  ADDRESS_DETAIL_REQUIRED: '番地などを入力してください',
} as const;

/**
 * 施設管理画面のルートパス
 */
export const FACILITY_ADMIN_ROUTES = {
  LIST: '/admin/facilities',
  NEW: '/admin/facilities/new',
  EDIT: (id: number) => `/admin/facilities/${id}/edit`,
} as const;
