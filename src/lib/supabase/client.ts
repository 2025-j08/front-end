import { createBrowserClient } from '@supabase/ssr';

import { supabaseConfig } from './config';

// ブラウザ用のSupabaseクライアントを作成
export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
