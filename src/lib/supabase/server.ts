import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { supabaseConfig, getServiceRoleKey } from './config';

/**
 * サーバーサイド用のSupabaseクライアント
 * Cookie経由でユーザーセッションを保持
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (error) {
          console.error('Cookieの設定に失敗しました');
        }
      },
    },
  });
}

/**
 * Admin用のSupabaseクライアント
 */
export function createAdminClient(): SupabaseClient {
  // 使用する環境変数の取得
  const supabaseUrl = supabaseConfig.url;
  const serviceRoleKey = getServiceRoleKey();

  // Supabaseクライアントの作成（Service Role Key使用）
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // サーバーサイドでは自動トークン更新は不要
      autoRefreshToken: false,
      // サーバーサイドではセッション永続化は不要
      persistSession: false,
    },
  });
}
