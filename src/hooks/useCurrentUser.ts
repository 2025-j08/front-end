import { useState, useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';

export type UserRole = 'admin' | 'staff' | null;

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
    const fetchCurrentUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setRole(null);
        setFacilityId(null);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);

      // プロフィールから権限を取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const userRole = (profile?.role as UserRole) ?? null;
      setRole(userRole);

      // staffの場合は施設IDを取得
      if (userRole === 'staff') {
        const { data: facilityProfile } = await supabase
          .from('facility_profiles')
          .select('facility_id')
          .eq('user_id', user.id)
          .single();

        setFacilityId(facilityProfile?.facility_id ?? null);
      }

      setIsLoading(false);
    };

    fetchCurrentUser();
  }, []);

  return { isLoggedIn, role, facilityId, isLoading };
}
