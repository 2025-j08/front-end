import { createServer } from '@/lib/supabase/server';
import { logError } from '@/lib/logger';

/**
 * 現在の認証済みユーザー情報を取得する
 * - 未認証の場合はnullを返す
 * - 認証済みの場合はid, email, name, roleを返す
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;

    // プロフィール情報取得（name, role）
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      logError('プロフィール取得失敗', { userId: user.id, error: profileError.message });
    }

    return {
      id: user.id,
      email: user.email,
      name: profile?.name ?? undefined,
      role: profile?.role ?? undefined,
    };
  } catch (e) {
    logError('getCurrentUserで例外', { error: e instanceof Error ? e.message : String(e) });
    return null;
  }
}
