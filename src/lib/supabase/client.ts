/**
 * クライアント用 Supabase クライアント
 * ブラウザで実行され、anon key を使用（RLS適用）
 */

import { createBrowserClient } from '@supabase/ssr';

import { supabaseConfig } from './config';

/**
 * クライアントサイド用の Supabase クライアントを作成
 *
 * @returns Supabase クライアント（anon key使用）
 *
 * @example
 * ```typescript
 * import { createClient } from '@/lib/supabase/client';
 *
 * const supabase = createClient();
 * const { data, error } = await supabase.from('facilities').select('*');
 * ```
 */
export function createClient() {
  return createBrowserClient(supabaseConfig.url!, supabaseConfig.anonKey!);
}
