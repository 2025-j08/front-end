'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { logError } from '@/lib/logger';

// 認証リンクのハッシュを安全にパースする関数
const parseHashParams = (
  hash: string,
): {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  type?: string;
} => {
  if (!hash || !hash.startsWith('#')) return {};
  const params = new URLSearchParams(hash.slice(1));
  const accessToken = params.get('access_token') ?? undefined;
  const refreshToken = params.get('refresh_token') ?? undefined;
  const expires = params.get('expires_at');
  const expiresAt = expires ? Number(expires) : undefined;
  const type = params.get('type') ?? undefined;
  return { accessToken, refreshToken, expiresAt, type };
};

/**
 * クライアントサイド認証コールバック
 * ハッシュベースの招待フロー用
 */
export default function AuthCallbackClientPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // コンポーネントのマウント状態を追跡
    let isMounted = true;

    // ハッシュからトークンを取得
    const { accessToken, refreshToken, expiresAt, type } = parseHashParams(window.location.hash);

    // signOutSafely関数をuseEffect内で定義（isMountedにアクセスするため）
    const signOutSafely = async (reason: string, redirectPath: string) => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logError('サインアウトに失敗しました', {
          context: 'auth/callback/client',
          reason,
          error: error.message,
        });
      }
      if (!isMounted) return;
      router.replace(redirectPath);
    };

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
    (async () => {
      try {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

        // 現在のユーザーを取得
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          if (isMounted) router.replace('/features/auth?error=auth_failed');
          return;
        }

        // パスワードリセットフローはサーバーサイド（callback/route.ts）で処理されるため、
        // ここには到達しない。万が一到達した場合はログイン画面へリダイレクト
        if (type === 'recovery') {
          if (isMounted) router.replace('/features/auth');
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
          if (isMounted) await signOutSafely('no_invitation', '/features/auth?error=no_invitation');
          return;
        }

        // 期限チェック
        const now = new Date();
        const expires = new Date(invitation.expires_at);
        if (!Number.isFinite(expires.getTime())) {
          if (isMounted)
            await signOutSafely('invalid_invitation', '/features/auth?error=invalid_invitation');
          return;
        }

        if (expires < now) {
          // 期限切れ招待を削除試行
          try {
            const { error: deleteError } = await supabase
              .from('invitations')
              .delete()
              .eq('user_id', userId);
            if (deleteError) {
              logError('期限切れ招待レコードの削除に失敗しました', {
                context: 'auth/callback/client',
                userId,
                supabaseError: deleteError.message,
              });
            }
          } catch (e) {
            logError('期限切れ招待レコードの削除中に予期しないエラーが発生しました', {
              context: 'auth/callback/client',
              userId,
              error: e instanceof Error ? e.message : String(e),
            });
          }

          if (isMounted)
            await signOutSafely('expired_invitation', '/features/auth?error=expired_invitation');
          return;
        }

        // 正常：初期登録画面へ遷移
        if (isMounted) router.replace('/registration');
      } catch (e) {
        logError('認証コールバック処理で予期しないエラーが発生しました', {
          context: 'auth/callback/client',
          error: e instanceof Error ? e.message : String(e),
        });
        if (isMounted) router.replace('/features/auth?error=auth_failed');
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  return (
    <div role="status" aria-live="polite" aria-busy="true" style={{ padding: 24 }}>
      認証処理中です。しばらくお待ちください…
    </div>
  );
}
