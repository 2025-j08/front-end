/**
 * アプリケーション全体で使用するエラーメッセージ定数
 */

/**
 * フォームバリデーションエラーメッセージ
 */
export const VALIDATION_MESSAGES = {
  /** 必須入力エラー */
  REQUIRED: (fieldName: string) => `${fieldName}を入力してください`,
  /** パスワード不一致エラー */
  PASSWORD_MISMATCH: 'パスワードが一致しません',
  /** 入力確認エラー */
  INPUT_CHECK_REQUIRED: '入力内容を確認してください',
} as const;

/**
 * API・送信関連エラーメッセージ
 */
export const API_MESSAGES = {
  /** 登録失敗 */
  REGISTRATION_FAILED: '登録に失敗しました。もう一度お試しください。',
  /** ログイン失敗 */
  LOGIN_FAILED: 'ログインに失敗しました。もう一度お試しください。',
  /** 通信エラー */
  NETWORK_ERROR: '通信エラーが発生しました。ネットワーク接続を確認してください。',
} as const;

/**
 * 招待認証関連エラーメッセージ
 * /auth/callback からのリダイレクト時に使用
 */
export const INVITATION_ERROR_MESSAGES = {
  /** トークンなし */
  no_code: '招待リンクが無効です。再度招待メールからアクセスしてください。',
  /** 招待情報が無効 */
  invalid_invitation: '招待情報が無効です。管理者にお問い合わせください。',
  /** 認証失敗 */
  auth_failed: '認証に失敗しました。再度招待メールからアクセスしてください。',
  /** 招待情報が見つからない */
  no_invitation: '招待情報が見つかりません。管理者に招待を依頼してください。',
  /** 招待期限切れ */
  expired_invitation: '招待の有効期限が切れています。管理者に再度招待を依頼してください。',
} as const;

/** 招待エラーコードの型 */
export type InvitationErrorCode = keyof typeof INVITATION_ERROR_MESSAGES;
