/**
 * API レスポンスの共通型定義
 */

/**
 * POST /api/admin/invite のリクエスト型
 * 管理者がユーザーを招待する際に送信するデータ
 */
export interface InviteUserRequest {
  /** 招待対象ユーザーのメールアドレス */
  email: string;
  /** ユーザーが所属する施設のID */
  facilityId: number;
}

/**
 * POST /api/admin/invite のレスポンス型
 * API呼び出しの成功・失敗を示すレスポンス
 *
 * 成功時と失敗時で異なる型として定義され、
 * TypeScriptの型推論により自動的に型が絞り込まれます。
 */

/**
 * 招待成功時のレスポンス
 */
export interface InviteUserResponseSuccess {
  /** 招待が成功したことを示す */
  success: true;
  /** エラーフィールドは存在しない */
  error?: never;
}

/**
 * 招待失敗時のレスポンス
 */
export interface InviteUserResponseError {
  /** 招待が失敗したことを示す */
  success: false;
  /** エラーメッセージは必須 */
  error: string;
}

/**
 * 成功と失敗をユニオン型で表現
 * success フィールドの値によって型が自動的に絞り込まれる
 *
 * @example
 * if (response.success === true) {
 *   // この時点で response は InviteUserResponseSuccess 型
 * } else {
 *   // この時点で response は InviteUserResponseError 型
 *   console.log(response.error); // error フィールドへのアクセスが型安全
 * }
 */
export type InviteUserResponse = InviteUserResponseSuccess | InviteUserResponseError;

/**
 * POST /api/auth/register のリクエスト型
 * 招待ユーザーが初期登録する際に送信するデータ
 * 仮登録ユーザのみが実行可能（confirmed_at が null のユーザー）
 */
export interface RegisterRequest {
  /** ユーザーの氏名 */
  name: string;
  /** ユーザーの新しいパスワード（HTTPS で送信されハッシング処理される） */
  password: string;
}

/**
 * POST /api/auth/register のレスポンス型
 * 初期登録成功・失敗を示すレスポンス
 */

/**
 * 初期登録成功時のレスポンス
 */
export interface RegisterResponseSuccess {
  /** 初期登録が成功したことを示す */
  success: true;
  /** エラーフィールドは存在しない */
  error?: never;
  /** リダイレクト先URL（省略時はデフォルトのホーム画面） */
  redirectUrl?: string;
  /** 割り当てられた施設名（成功メッセージに表示可能） */
  facilityName?: string;
  /** 割り当てられた施設ID */
  facilityId?: number;
}

/**
 * 初期登録失敗時のレスポンス
 */
export interface RegisterResponseError {
  /** 初期登録が失敗したことを示す */
  success: false;
  /** エラーメッセージは必須 */
  error: string;
}

/**
 * 成功と失敗をユニオン型で表現
 * success フィールドの値によって型が自動的に絞り込まれる
 *
 * @example
 * if (response.success === true) {
 *   // この時点で response は RegisterResponseSuccess 型
 * } else {
 *   // この時点で response は RegisterResponseError 型
 *   console.log(response.error); // error フィールドへのアクセスが型安全
 * }
 */
export type RegisterResponse = RegisterResponseSuccess | RegisterResponseError;

/**
 * ユーザー情報の型定義
 * GET /api/admin/users のレスポンスおよびフロントエンドのユーザー管理で使用
 */
export interface User {
  /** ユーザーID */
  id: string;
  /** 所属施設ID（再発行時に使用） */
  facilityId: number;
  /** 所属施設名 */
  facilityName: string;
  /** ユーザー氏名 */
  name: string;
  /** メールアドレス */
  email: string;
}

/**
 * PATCH /api/admin/users/[id] のリクエスト型
 * ユーザー情報更新API
 */
export interface UpdateUserRequest {
  /** 更新後の氏名 */
  name: string;
}

/**
 * ユーザー操作成功時のレスポンス
 */
export interface UserOperationResponseSuccess {
  /** 操作が成功したことを示す */
  success: true;
  /** エラーフィールドは存在しない */
  error?: never;
}

/**
 * ユーザー操作失敗時のレスポンス
 */
export interface UserOperationResponseError {
  /** 操作が失敗したことを示す */
  success: false;
  /** エラーメッセージは必須 */
  error: string;
}

/**
 * ユーザー操作（削除・更新）のレスポンス型
 * success フィールドの値によって型が自動的に絞り込まれる
 */
export type UserOperationResponse = UserOperationResponseSuccess | UserOperationResponseError;
