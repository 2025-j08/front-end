/**
 * Supabase 設定ファイル
 *
 * このファイルは必須の環境変数を検証し、アプリケーション全体で使用する設定を提供します。
 * アプリケーション起動時に環境変数が欠けている場合は早期にエラーを発生させます。
 *
 * 検証される環境変数:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase プロジェクトのURL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase の匿名キー（クライアント用）
 * - NEXT_PUBLIC_APP_URL: アプリケーションのベースURL（招待メールのリダイレクトなどで使用）
 * - SUPABASE_SERVICE_ROLE_KEY: Supabase のサービスロールキー（サーバーサイドの管理者権限操作用）
 */

// 必須の環境変数を検証
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL が設定されていません');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません');
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL が設定されていません');
}

// エクスポート用の設定オブジェクト
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

/**
 * アプリケーションのベースURL
 * 招待メールのリダイレクトURLなどで使用
 */
export const appConfig = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL,
} as const;

// サーバー用の検証関数
export function getServiceRoleKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY が設定されていません。');
  }
  return serviceRoleKey;
}
