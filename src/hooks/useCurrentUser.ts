import { useState, useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';

const VALID_ROLES = ['admin', 'staff'] as const;
export type UserRole = (typeof VALID_ROLES)[number] | null;

/**
 * 取得した値が有効なUserRoleであることをバリデーション
 */
function isValidRole(value: unknown): value is 'admin' | 'staff' {
  return typeof value === 'string' && VALID_ROLES.includes(value as 'admin' | 'staff');
}

type CurrentUser = {
  isLoggedIn: boolean;
  role: UserRole;
  facilityId: number | null;
  isLoading: boolean;
};

const INITIAL_STATE: CurrentUser = {
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
  const [state, setState] = useState<CurrentUser>(INITIAL_STATE);

  useEffect(() => {
    let isMounted = true;

    const updateState = (newState: Partial<CurrentUser>) => {
      if (isMounted) {
        setState((prev) => ({ ...prev, ...newState }));
      }
    };

    const fetchCurrentUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        updateState({ isLoading: false });
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
        console.error('Failed to fetch user profile:', profileError);
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
          console.error('Failed to fetch facility profile:', facilityError);
        }

        updateState({ facilityId: facilityProfile?.facility_id ?? null });
      }

      updateState({ isLoading: false });
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
