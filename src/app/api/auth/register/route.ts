import { NextResponse } from 'next/server';

import type { RegisterRequest } from '@/types/api';
import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';
import { validateRequired, validatePassword } from '@/lib/validation';

/**
 * リクエストボディのバリデーション
 * @param body - リクエストボディ
 * @returns バリデーション結果
 */
const parseRequestBody = (
  body: unknown,
): { success: true; data: RegisterRequest } | { success: false; message: string } => {
  // JSON形式の確認
  if (typeof body !== 'object' || body === null) {
    return { success: false, message: '不正なリクエスト形式です' };
  }

  const { name, password } = body as Record<string, unknown>;

  // nameの型チェックとバリデーション
  if (typeof name !== 'string') {
    return { success: false, message: '氏名を入力してください' };
  }

  const nameValidation = validateRequired(name, '氏名');
  if (!nameValidation.isValid) {
    return { success: false, message: nameValidation.error ?? '氏名を入力してください' };
  }

  // passwordの型チェックとバリデーション
  if (typeof password !== 'string') {
    return { success: false, message: 'パスワードを入力してください' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      message: passwordValidation.errors.join('、'),
    };
  }

  return { success: true, data: { name: name.trim(), password } };
};

/**
 * POST /api/auth/register
 * 招待ユーザーの初期登録（氏名・パスワード設定）
 *
 * フロー:
 * 1. リクエストバリデーション
 * 2. JWT検証（セッション確認）
 * 3. 招待ユーザ確認（invitations テーブル）
 * 4. profiles.name 更新
 * 5. auth.users.password 更新
 */
export async function POST(request: Request) {
  try {
    // JSONリクエストボディ取得
    const json = await request.json().catch(() => null);

    // バリデーション
    const parsed = parseRequestBody(json);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.message }, { status: 400 });
    }

    const { name, password } = parsed.data;

    // サーバ用クライアントと管理者用クライアントを作成
    const supabaseServer = await createServerClient();
    const supabaseAdmin = createAdminClient();

    // JWT検証: Cookie経由でセッション取得
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    // 未認証のエラーレスポンス
    if (!user) {
      return NextResponse.json(
        { success: false, error: '認証が必要です。再度ログインしてください' },
        { status: 401 },
      );
    }

    // 招待ユーザ確認: invitations テーブルに該当レコードが存在するか
    const { data: invitation, error: invitationError } = await supabaseServer
      .from('invitations')
      .select('facility_id, expires_at')
      .eq('user_id', user.id)
      .single();

    // 招待情報が存在しない場合
    if (invitationError || !invitation) {
      console.warn('招待情報が見つかりません', {
        userId: user.id,
        email: user.email,
        error: invitationError?.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { success: false, error: '招待情報が見つかりません' },
        { status: 403 },
      );
    }

    // 有効期限チェック
    const expiresAt = new Date(invitation.expires_at);
    if (!Number.isFinite(expiresAt.getTime())) {
      console.error('無効な有効期限のフォーマットです', {
        userId: user.id,
        expiresAt: invitation.expires_at,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({ success: false, error: '招待情報が無効です' }, { status: 400 });
    }

    if (expiresAt < new Date()) {
      console.info('招待情報が有効期限切れです', {
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
        timestamp: new Date().toISOString(),
      });

      // 期限切れの招待レコードを削除
      await supabaseServer.from('invitations').delete().eq('user_id', user.id);

      return NextResponse.json(
        { success: false, error: '招待の有効期限が切れています' },
        { status: 403 },
      );
    }

    // ロールバック用に元のプロフィール情報を取得
    const { data: originalProfile, error: originalProfileError } = await supabaseServer
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    if (originalProfileError || !originalProfile) {
      console.error('プロフィール取得に失敗しました', {
        userId: user.id,
        error: originalProfileError?.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { success: false, error: 'プロフィールが見つかりません' },
        { status: 400 },
      );
    }

    const originalName = originalProfile.name;

    // profiles.name 更新
    const { error: profileUpdateError } = await supabaseServer
      .from('profiles')
      .update({ name })
      .eq('id', user.id);

    if (profileUpdateError) {
      console.error('プロフィール更新に失敗しました', {
        userId: user.id,
        error: profileUpdateError.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { success: false, error: 'プロフィールの更新に失敗しました' },
        { status: 500 },
      );
    }

    // auth.users.password 更新（Supabase Admin SDK使用）
    const { error: passwordUpdateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
    });

    // パスワード更新失敗時の補償処理
    if (passwordUpdateError) {
      console.error('パスワード更新に失敗しました', {
        userId: user.id,
        error: passwordUpdateError.message,
        timestamp: new Date().toISOString(),
      });

      // profiles.name をロールバック（元の値に復元）
      try {
        await supabaseServer.from('profiles').update({ name: originalName }).eq('id', user.id);
        console.log('プロフィールのロールバック成功', {
          userId: user.id,
          restoredName: originalName,
        });
      } catch (rollbackError) {
        console.error('FATAL: プロフィールのロールバック失敗', {
          userId: user.id,
          originalName,
          rollbackError: rollbackError instanceof Error ? rollbackError.message : rollbackError,
        });
      }

      return NextResponse.json(
        { success: false, error: 'パスワードの設定に失敗しました' },
        { status: 500 },
      );
    }

    // facility_profiles に登録（ユーザーと施設の紐付け）
    const { error: facilityProfileError } = await supabaseServer.from('facility_profiles').insert({
      facility_id: invitation.facility_id,
      user_id: user.id,
    });

    if (facilityProfileError) {
      console.error('施設紐付けの登録に失敗しました', {
        userId: user.id,
        facilityId: invitation.facility_id,
        error: facilityProfileError.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { success: false, error: '施設の紐付けに失敗しました' },
        { status: 500 },
      );
    }

    // 初期登録完了後、招待レコードを削除（期限切れ以外もクリーンアップ）
    const { error: deleteInvitationError } = await supabaseServer
      .from('invitations')
      .delete()
      .eq('user_id', user.id);

    if (deleteInvitationError) {
      console.warn('招待レコードの削除に失敗しました（初期登録は完了）', {
        userId: user.id,
        facilityId: invitation.facility_id,
        error: deleteInvitationError.message,
        timestamp: new Date().toISOString(),
      });
      // 招待削除失敗は致命的でないため、成功レスポンスを返す
    }

    // 成功レスポンス
    console.log('ユーザー初期登録完了', {
      userId: user.id,
      email: user.email,
      facilityId: invitation.facility_id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // 予期しないエラー
    console.error('初期登録API で予期しないエラーが発生しました', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}
