import { NextResponse } from 'next/server';

import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Admin用Supabaseクライアント（Service Role Key使用）
 *
 * RLSをバイパスして以下の操作を実行：
 * - invitationsテーブルへの招待情報の保存
 * - Supabase Auth APIを使った招待メールの送信
 */
const supabaseAdmin = createAdminClient();

export async function POST(request: Request) {
  const { email, role, facilityIds } = await request.json();

  // リクエスト元が管理者か確認
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
  }

  // invitationsテーブルに保存
  const { error: inviteError } = await supabaseAdmin.from('invitations').upsert({
    email,
    role,
    facility_ids: facilityIds,
    invited_by: user.id,
  });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 400 });
  }

  // supabase authで招待メールを送信
  const { error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  });

  if (authError) {
    // 失敗したらinvitationsも削除する
    await supabaseAdmin.from('invitations').delete().eq('email', email);
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
