import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

import { createClient as createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // URL(auth/callback)から認可コードを取得
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');

    // 接続用クライアント（RLS有効）
    const supabaseServer = await createServerClient();

    // 認可コードをチェック
    if (!code) {
      console.warn('認可コードが見つかりません', { timestamp: new Date().toISOString() });
      return NextResponse.redirect(`${origin}/auth/signin?error=no_code`);
    }

    // 認証情報を取得する
    // Cookieセッションを復元している
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.exchangeCodeForSession(code);

    // 認証エラーハンドリング（機密情報は露出しない）
    if (authError || !user) {
      console.error('認証エラー', {
        errorCode: authError?.code,
        errorMessage: authError?.message,
        timestamp: new Date().toISOString(),
      });

      const errorUrl = new URL(`${origin}/auth/signin`);
      errorUrl.searchParams.set('error', 'auth_failed');
      return NextResponse.redirect(errorUrl);
    }

    // 招待情報を取得
    // RLS有効なクライアントを使用してセキュリティを確保
    const { data: invitation, error: invitationError } = await supabaseServer
      .from('invitations')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 招待情報がない場合のエラーハンドリング
    if (invitationError || !invitation) {
      console.error('招待情報が見つかりません', {
        userId: user.id,
        email: user.email,
        error: invitationError?.message,
        timestamp: new Date().toISOString(),
      });

      // セッションを破棄
      // 不正なユーザーがセッションを保持しないようにする
      await supabaseServer.auth.signOut();

      return NextResponse.redirect(`${origin}/auth/signin?error=no_invitation`);
    }

    // 有効期限が設定されているか
    if (!invitation.expires_at) {
      console.error('招待情報に有効期限が設定されていません', {
        userId: user.id,
        facilityId: invitation.facility_id,
        timestamp: new Date().toISOString(),
      });

      // セッションを破棄
      await supabaseServer.auth.signOut();

      return NextResponse.redirect(`${origin}/auth/signin?error=invalid_invitation`);
    }

    const expiresAt = new Date(invitation.expires_at);

    // 有効な日付フォーマットであるか
    if (!Number.isFinite(expiresAt.getTime())) {
      console.error('無効な有効期限のフォーマットです', {
        userId: user.id,
        expiresAt: invitation.expires_at,
        timestamp: new Date().toISOString(),
      });

      // セッションを破棄
      await supabaseServer.auth.signOut();

      return NextResponse.redirect(`${origin}/auth/signin?error=invalid_invitation`);
    }

    // 有効期限は切れているか
    if (expiresAt < new Date()) {
      console.info('招待情報が有効期限切れです', {
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
        timestamp: new Date().toISOString(),
      });

      // 期限切れの招待レコードを削除
      const { error: deleteError } = await supabaseServer
        .from('invitations')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('期限切れ招待の削除に失敗しました', {
          userId: user.id,
          error: deleteError.message,
          timestamp: new Date().toISOString(),
        });
        // 削除失敗しても処理は継続
        // セッション破棄とリダイレクトを行うため
      }

      // セッションを破棄
      await supabaseServer.auth.signOut();

      return NextResponse.redirect(`${origin}/auth/signin?error=expired_invitation`);
    }

    // セットアップ機能にリダイレクト
    // セッション(Cookie)経由でuser_idが自動で渡される
    return NextResponse.redirect(`${origin}/auth/setup`);
  } catch (error) {
    // 予期しないエラーのログ
    console.error('予期しないエラーが発生しました', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // 詳細なエラー情報は見せない
    return new NextResponse('Internal server error', { status: 500 });
  }
}
