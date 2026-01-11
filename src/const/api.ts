/**
 * APIエンドポイント定数
 *
 * アプリケーション全体で使用するAPIエンドポイントを一元管理します。
 * URLのタイポや不整合を防ぎ、エンドポイント変更時の影響範囲を最小化します。
 */
export const API_ENDPOINTS = {
  /** 管理者専用API */
  ADMIN: {
    /** ユーザー招待API */
    INVITE: '/api/admin/invite',
  },

  /** 認証関連API */
  AUTH: {
    /** サインインAPI */
    SIGNIN: '/api/auth/signin',

    /** サインアウトAPI */
    SIGNOUT: 'api/auth/signout',

    /** ユーザー登録API */
    REGISTER: '/api/auth/register',
  },
} as const;

/** APIエンドポイントの型 */
export type ApiEndpoint =
  (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS][keyof (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS]];
