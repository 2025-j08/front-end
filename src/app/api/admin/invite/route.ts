import { NextResponse } from 'next/server';

import type { InviteUserRequest } from '@/types/api';
import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';
import { validateEmail } from '@/lib/validation';

// 関数式を使用して変数のように関数を定義
// 成功/失敗時の戻り値の種類を定義
const parseRequestBody = (
  body: unknown,
): { success: true; data: InviteUserRequest } | { success: false; message: string } => {
  // json形式になっているか(配列も含む)
  if (typeof body !== 'object' || body === null) {
    return { success: false, message: '不正なリクエスト形式です' };
  }

  // jsonのリクエストボディを代入
  const { email, facilityId } = body as Record<string, unknown>;

  // emailの型チェック
  if (typeof email !== 'string') {
    return { success: false, message: '有効なメールアドレスを指定してください' };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error ?? '有効なメールアドレスを指定してください',
    };
  }

  // facility_idの型チェック
  const parsedFacilityId = Number(facilityId);
  // 不適切な型だった
  if (!Number.isInteger(parsedFacilityId) || parsedFacilityId <= 0) {
    return { success: false, message: '有効な施設IDを指定してください' };
  }

  // 各値を返却する
  return { success: true, data: { email, facilityId: parsedFacilityId } };
};

export async function POST(request: Request) {
  try {
    // jsonリクエストボディを取得(エラーがあればnull)
    const json = await request.json().catch(() => null);

    // 各パラメータをバリデーションする
    const parsed = parseRequestBody(json);
    // 失敗時のエラーレスポンス
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.message }, { status: 400 });
    }

    // バリデーション済みデータを代入
    const { email, facilityId } = parsed.data;

    // 環境変数が正しく設定できているか
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    // 未設定のエラーレスポンス
    if (!appUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not set');
      return NextResponse.json(
        { success: false, error: '環境設定エラーが発生しました' },
        { status: 500 },
      );
    }

    // サーバ用クライアントと管理者用クライアントを作成
    const supabaseServer = await createServerClient();
    const supabaseAdmin = createAdminClient();

    // cookiesからセッションを参照し認証済みユーザかどうか調べている
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    // 未認証のエラーレスポンス
    if (!user) {
      return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
    }

    // 管理者ユーザか確認する(役割を抽出)
    // DBクライアントのセッション情報からuser_idを参照
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // 管理者ではなかったときのエラーレスポンス
    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: '管理者権限が必要です' }, { status: 403 });
    }

    // 既存の招待レコードを確認（メールアドレスからユーザーを検索）
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find((u) => u.email === email);

    // 既に招待レコードが存在する場合は削除
    if (existingUser) {
      const { error: deleteError } = await supabaseServer
        .from('invitations')
        .delete()
        .eq('user_id', existingUser.id);

      if (deleteError) {
        console.warn('Failed to delete existing invitation', {
          userId: existingUser.id,
          email: email,
          error: deleteError.message,
        });
      }
    }

    // リクエストボディのメールアドレス宛に招待メールを送信
    // authモジュールの関数は管理者権限で実行する必要がある
    // redirectTo: 招待メール内のリンククリック後、ブラウザのクライアントページ(/auth/callback)へ遷移する
    // 招待リンクはハッシュ(#access_token 等)を返すため、サーバAPIではなくクライアントで処理する必要がある
    const { data, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${appUrl}/auth/callback`,
    });

    // 招待ユーザのIDが取得できなかった or 招待メールの送信に失敗した
    // 失敗時のエラーレスポンス
    if (authError || !data?.user?.id) {
      console.error('inviteUserByEmail failed', authError);
      return NextResponse.json(
        { success: false, error: '招待メール送信に失敗しました' },
        { status: 400 },
      );
    }

    // 招待ユーザ用テーブルに招待対象ユーザのIDとユーザが担当する施設のIDを挿入する
    const { error: insertError } = await supabaseServer.from('invitations').insert({
      user_id: data.user.id,
      facility_id: facilityId,
    });

    // invitations挿入失敗時の補償処理（ユーザー作成を取り消す）
    if (insertError) {
      // エラーの構造化ログを出力
      console.error('invitations insert failed after user creation', {
        userId: data.user.id,
        email: email,
        facilityId: facilityId,
        error: insertError.message,
        timestamp: new Date().toISOString(),
      });

      // 補償トランザクションにより作成された認証ユーザーを削除
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        console.log('Rollback successful', { userId: data.user.id, email: email });
      } catch (rollbackError) {
        // ロールバック失敗は手動対応が必要になる
        console.error('FATAL: Rollback failed - manual cleanup required', {
          userId: data.user.id,
          email: email,
          facilityId: facilityId,
          originalError: insertError.message,
          rollbackError: rollbackError instanceof Error ? rollbackError.message : rollbackError,
        });
      }

      return NextResponse.json(
        { success: false, error: '招待情報の保存に失敗しました' },
        { status: 500 },
      );
    }

    // 成功レスポンス
    return NextResponse.json({ success: true });
  } catch (error) {
    // 処理中にエラーが発生した場合のレスポンス
    console.error('Unexpected error in invite API', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}
