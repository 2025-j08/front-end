/**
 * Supabase 環境変数の検証と管理
 */

// 必須の環境変数を検証
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL が設定されていません');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません');
}

// サーバーサイドでのみ必要（クライアント側では未定義でも可）
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// エクスポート用の設定オブジェクト
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: serviceRoleKey,
} as const;

// サーバーサイド用の検証関数
export function validateServiceRoleKey(): string {
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY が設定されていません。サーバーサイドでのみ使用してください。',
    );
  }
  return supabaseConfig.serviceRoleKey;
}
