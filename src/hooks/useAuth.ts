import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

import { API_ENDPOINTS } from '@/const/api';
import { createClient } from '@/lib/supabase/client';

// ユーザー型（必要に応じて拡張）
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * グローバルな認証状態管理フック
 * - 認証状態・ユーザー情報の取得
 * - サインアウトAPI連携
 * - ログイン/ログアウトUI切り替え用state提供
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // 認証状態取得
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) throw new Error('認証情報の取得に失敗しました');
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // サインアウト
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      // サーバーサイドのセッションをクリア
      await fetch(API_ENDPOINTS.AUTH.SIGNOUT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      // クライアント側のSupabaseセッションもクリア（onAuthStateChangeを発火させる）
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回マウント時およびページ遷移時に認証状態を取得
  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    checkAuth,
    signOut,
  };
};
