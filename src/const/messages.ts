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
