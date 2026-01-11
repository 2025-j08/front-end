import { useState, useEffect, useCallback } from 'react';

import { API_ENDPOINTS } from '@/const/api';

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
      await fetch(API_ENDPOINTS.AUTH.SIGNOUT, { method: 'POST', credentials: 'include' });
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回マウント時に認証状態を取得
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    checkAuth,
    signOut,
  };
};
