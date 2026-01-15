import { NextResponse } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';
import { logError, logInfo } from '@/lib/logger';

/**
 * GET /auth/callback
 * Supabase 認証コールバック（サーバーサイド処理）
 *
 * PKCE フロー（パスワードリセット等）のコード交換をサーバーサイドで処理
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const origin = requestUrl.origin;

  // デバッグ用: 受け取ったパラメータをログ出力
  logInfo('認証コールバック受信', {
    context: 'auth/callback',
    hasCode: !!code,
    type: type ?? 'none',
    fullUrl: request.url,
    searchParams: requestUrl.search,
  });

  // code パラメータがある場合（PKCE フロー）
  if (code) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        logError('PKCE コード交換エラー（サーバーサイド）', {
          context: 'auth/callback',
          supabaseError: error.message,
          errorCode: error.code,
        });
        return NextResponse.redirect(`${origin}/features/auth?error=auth_failed`);
      }

      // パスワードリセットフローの場合
      // セッションは確立されているが、パスワード再設定ページへ誘導
      if (type === 'recovery') {
        logInfo('パスワードリセットコールバック成功', { context: 'auth/callback' });
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }

      // その他のフロー（将来の拡張用）
      return NextResponse.redirect(`${origin}/`);
    } catch (e) {
      logError('PKCE コールバック処理で予期しないエラー', {
        context: 'auth/callback',
        error: e instanceof Error ? e.message : String(e),
      });
      return NextResponse.redirect(`${origin}/features/auth?error=auth_failed`);
    }
  }

  // code がない場合は、クライアントサイドのページにフォールバック
  // （ハッシュベースの招待フロー用）
  // ハッシュはサーバーに送信されないため、クライアントで処理する必要がある
  return NextResponse.redirect(`${origin}/auth/callback/client${requestUrl.hash}`);
}
