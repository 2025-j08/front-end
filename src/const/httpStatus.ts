/**
 * HTTPステータスコード定数
 *
 * API レスポンスで使用するHTTPステータスコードを一元管理します。
 * マジックナンバーの使用を避け、コードの可読性と保守性を向上させます。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTTP/Status
 */
export const HTTP_STATUS = {
  /** 200 OK - リクエストが成功 */
  OK: 200,

  /** 400 Bad Request - 不正なリクエスト */
  BAD_REQUEST: 400,

  /** 401 Unauthorized - 認証が必要 */
  UNAUTHORIZED: 401,

  /** 403 Forbidden - アクセス権限なし */
  FORBIDDEN: 403,

  /** 404 Not Found - リソースが見つからない */
  NOT_FOUND: 404,

  /** 500 Internal Server Error - サーバー内部エラー */
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** HTTPステータスコードの型 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
