'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { logError } from '@/lib/clientLogger';

// 招待リンクのハッシュを安全にパースする関数
const parseHashParams = (
  hash: string,
): {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
} => {
  if (!hash || !hash.startsWith('#')) return {};
  const params = new URLSearchParams(hash.slice(1));
  const accessToken = params.get('access_token') ?? undefined;
  const refreshToken = params.get('refresh_token') ?? undefined;
  const expires = params.get('expires_at');
  const expiresAt = expires ? Number(expires) : undefined;
  return { accessToken, refreshToken, expiresAt };
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const signOutSafely = useCallback(
    async (reason: string, redirectPath: string) => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logError('サインアウトに失敗しました', {
          context: 'auth/callback',
          reason,
          error: error.message,
        });
      }
      router.replace(redirectPath);
    },
    [router, supabase.auth],
  );

  useEffect(() => {
    // コンポーネントのマウント状態を追跡
    let isMounted = true;
    const { accessToken, refreshToken, expiresAt } = parseHashParams(window.location.hash);

    // ハッシュにトークンが含まれない場合はログイン画面へ
    if (!accessToken || !refreshToken) {
      router.replace('/features/auth?error=no_code');
      return;
    }

    // 有効期限の形式が不正ならログイン画面へ
    if (expiresAt !== undefined && !Number.isFinite(expiresAt)) {
      router.replace('/features/auth?error=invalid_invitation');
      return;
    }

    // セッションを確立
    // ブラウザ側でCookieが設定され、この後のRLSクエリおよびページ遷移が有効になる
    (async () => {
      try {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

        // 現在のユーザーを取得
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          if (isMounted) router.replace('/features/auth?error=auth_failed');
          return;
        }

        const userId = userData.user.id;

        // 招待情報を取得（RLSにより自分のレコードのみ参照可能）
        const { data: invitation, error: invitationError } = await supabase
          .from('invitations')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (invitationError || !invitation) {
          // セッション破棄してログインへ
          if (isMounted) await signOutSafely('no_invitation', '/features/auth?error=no_invitation');
          return;
        }

        // 期限チェック
        // 複数の日付比較で一貫性を保つため、現在時刻を一度だけ取得
        const now = new Date();
        const expires = new Date(invitation.expires_at);
        if (!Number.isFinite(expires.getTime())) {
          if (isMounted)
            await signOutSafely('invalid_invitation', '/features/auth?error=invalid_invitation');
          return;
        }

        if (expires < now) {
          // 期限切れ招待を削除（ポリシー上、本人も削除可能）
          await supabase.from('invitations').delete().eq('user_id', userId);
          if (isMounted)
            await signOutSafely('expired_invitation', '/features/auth?error=expired_invitation');
          return;
        }

        // 正常：初期登録画面へ遷移
        if (isMounted) router.replace('/registration');
      } catch (e) {
        // 予期しないエラー時は安全側へ遷移
        logError('認証コールバック処理で予期しないエラーが発生しました', {
          context: 'auth/callback',
          error: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack : undefined,
        });
        if (isMounted) router.replace('/features/auth?error=auth_failed');
      }
    })();

    // Cleanup関数: コンポーネントのアンマウント時にフラグを更新
    return () => {
      isMounted = false;
    };
  }, [router, supabase, signOutSafely]);

  // シンプルなステータス表示（アクセシビリティ対応）
  return (
    <div role="status" aria-live="polite" aria-busy="true" style={{ padding: 24 }}>
      認証処理中です。しばらくお待ちください…
    </div>
  );
}
