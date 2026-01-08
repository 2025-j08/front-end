import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Admin用Supabaseクライアント（Service Role Key使用）
 *
 * RLSをバイパスして以下の操作を実行：
 * - invitationsテーブルから招待情報を検証（有効期限、使用済み判定）
 * - 管理者のみがアクセス可能な招待レコードの読み取り
 */
const supabaseAdmin = createAdminClient();

export async function GET(request: NextRequest) {
  // リクエストから認可コードを取得
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // 招待コードをチェック
  if (!code) {
    return NextResponse.redirect(`${origin}/auth/signin?error=no_code`);
  }

  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  // 認証エラーハンドリング
  if (error || !user) {
    const errorUrl = new URL(`${origin}/auth/signin`);
    errorUrl.searchParams.set('error', error?.message || 'Authentication failed');
    return NextResponse.redirect(errorUrl);
  }

  // 3. 招待ユーザーかをセッション情報から確認
  const { data: invitation } = await supabaseAdmin
    .from('invitations')
    .select('id,email,expires_at,used_at')
    .eq('email', user.email)
    .single();

  // 招待情報がない場合はエラー
  if (!invitation) {
    return NextResponse.redirect(`${origin}/auth/signin?error=no_invitation`);
  }

  // 招待の期限切れチェック
  if (invitation.expires_at) {
    const expiresAt = new Date(invitation.expires_at);
    if (Number.isFinite(expiresAt.getTime()) && expiresAt < new Date()) {
      return NextResponse.redirect(`${origin}/auth/signin?error=expired_invitation`);
    }
  }

  // すでに使用済みの招待は無効
  if (invitation.used_at) {
    return NextResponse.redirect(`${origin}/auth/signin?error=used_invitation`);
  }

  // セットアップ機能にリダイレクト（招待情報をクエリパラメータで渡す）
  const setupUrl = new URL(`${origin}/auth/setup`);
  setupUrl.searchParams.set('invitation_id', invitation.id.toString());
  setupUrl.searchParams.set('email', user.email!);

  return NextResponse.redirect(setupUrl);
}
