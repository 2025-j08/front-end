import { useState, useEffect, useCallback } from 'react';

import { API_ENDPOINTS } from '@/const/api';
import { logError } from '@/lib/clientLogger';
import { createClient } from '@/lib/supabase/client';

const VALID_ROLES = ['admin', 'staff'] as const;
export type UserRole = (typeof VALID_ROLES)[number] | null;

/**
 * 取得した値が有効なUserRoleであることをバリデーション
 */
function isValidRole(value: unknown): value is 'admin' | 'staff' {
  return typeof value === 'string' && VALID_ROLES.includes(value as 'admin' | 'staff');
}

type CurrentUserState = {
  isLoggedIn: boolean;
  role: UserRole;
  facilityId: number | null;
  isLoading: boolean;
};

type CurrentUser = CurrentUserState & {
  signOut: () => Promise<void>;
};

const INITIAL_STATE: CurrentUserState = {
  isLoggedIn: false,
  role: null,
  facilityId: null,
  isLoading: true,
};

/**
 * 現在ログイン中のユーザー情報を取得するカスタムフック
 *
 * - ログイン状態
 * - ユーザー権限（admin / staff）
 * - 紐づけられた施設ID（staffの場合）
 */
export function useCurrentUser(): CurrentUser {
  const [state, setState] = useState<CurrentUserState>(INITIAL_STATE);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const updateState = (newState: Partial<CurrentUserState>) => {
      if (isMounted) {
        setState((prev) => ({ ...prev, ...newState }));
      }
    };

    const fetchCurrentUser = async (options?: { skipLoadingState?: boolean }) => {
      if (!options?.skipLoadingState) {
        updateState({ isLoading: true });
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        updateState({ ...INITIAL_STATE, isLoading: false });
        return;
      }

      updateState({ isLoggedIn: true });

      // プロフィールから権限を取得
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        logError('Failed to fetch user profile', {
          component: 'useCurrentUser',
          error: profileError.message,
        });
        updateState({ isLoading: false });
        return;
      }

      // 型安全性のためランタイムバリデーション
      const userRole: UserRole = isValidRole(profile?.role) ? profile.role : null;

      updateState({ role: userRole });

      // staffの場合は施設IDを取得
      if (userRole === 'staff') {
        const { data: facilityProfile, error: facilityError } = await supabase
          .from('facility_profiles')
          .select('facility_id')
          .eq('user_id', user.id)
          .single();

        if (facilityError) {
          logError('Failed to fetch facility profile', {
            component: 'useCurrentUser',
            error: facilityError.message,
          });
        }

        updateState({ facilityId: facilityProfile?.facility_id ?? null });
      }

      updateState({ isLoading: false });
    };

    fetchCurrentUser();

    // 認証状態の変更を監視
    // 認証イベント時はローディング表示をスキップしてUIのちらつきを防止
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        fetchCurrentUser({ skipLoadingState: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // サインアウト処理（エラーハンドリング付き）
  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // サーバーサイドのセッションをクリア
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNOUT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`サインアウトAPIエラー: ${response.status}`);
      }

      // クライアント側のSupabaseセッションもクリア
      const supabase = createClient();
      const { error: supabaseError } = await supabase.auth.signOut();

      if (supabaseError) {
        throw supabaseError;
      }

      // 状態をリセット
      setState({ ...INITIAL_STATE, isLoading: false });
    } catch (error) {
      logError('サインアウト処理に失敗しました', {
        component: 'useCurrentUser',
        error: error instanceof Error ? error.message : String(error),
      });

      // エラーが発生してもローディング状態は解除
      setState((prev) => ({ ...prev, isLoading: false }));

      // ユーザーに通知（エラーを再スローして呼び出し元で処理可能にする）
      throw error;
    }
  }, []);

  return {
    ...state,
    signOut,
  };
}
