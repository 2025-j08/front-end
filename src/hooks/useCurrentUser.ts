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

/**
 * 現在ログイン中のユーザー情報を取得するカスタムフック
 *
 * - ログイン状態
 * - ユーザー権限（admin / staff）
 * - 紐づけられた施設ID（staffの場合）
 */
export function useCurrentUser(): CurrentUser {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [facilityId, setFacilityId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) {
          setIsLoggedIn(false);
          setRole(null);
          setFacilityId(null);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoggedIn(true);
      }

      // プロフィールから権限を取得
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Failed to fetch user profile:', profileError);
        if (isMounted) {
          setRole(null);
          setFacilityId(null);
          setIsLoading(false);
        }
        return;
      }

      // 型安全性のためランタイムバリデーション
      const userRole: UserRole = isValidRole(profile?.role) ? profile.role : null;

      if (isMounted) {
        setRole(userRole);
      }

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

        if (isMounted) {
          setFacilityId(facilityProfile?.facility_id ?? null);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isLoggedIn, role, facilityId, isLoading };
}
