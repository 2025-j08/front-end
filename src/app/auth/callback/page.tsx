'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

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

  useEffect(() => {
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
          router.replace('/features/auth?error=auth_failed');
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
          await supabase.auth.signOut();
          router.replace('/features/auth?error=no_invitation');
          return;
        }

        // 期限チェック
        // 複数の日付比較で一貫性を保つため、現在時刻を一度だけ取得
        const now = new Date();
        const expires = new Date(invitation.expires_at);
        if (!Number.isFinite(expires.getTime())) {
          await supabase.auth.signOut();
          router.replace('/features/auth?error=invalid_invitation');
          return;
        }

        if (expires < now) {
          // 期限切れ招待を削除（ポリシー上、本人も削除可能）
          await supabase.from('invitations').delete().eq('user_id', userId);
          await supabase.auth.signOut();
          router.replace('/features/auth?error=expired_invitation');
          return;
        }

        // 正常：初期登録画面へ遷移
        router.replace('/registration');
      } catch (e) {
        // 予期しないエラー時は安全側へ遷移
        router.replace('/features/auth?error=auth_failed');
      }
    })();
  }, [router, supabase.auth]);

  // シンプルなステータス表示（アクセシビリティ対応）
  return (
    <div role="status" aria-live="polite" aria-busy="true" style={{ padding: 24 }}>
      認証処理中です。しばらくお待ちください…
    </div>
  );
}
