import type { RegisterRequest } from '@/types/api';
import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';
import { validateRequired, validatePassword } from '@/lib/validation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logWarn, logError, logInfo, logFatal, maskEmail } from '@/lib/logger';
import { deleteFacilityProfile, restoreProfileName } from '@/lib/auth/registration';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/validators';
import { createValidator, stringField } from '@/lib/api/createValidator';

/**
 * 登録APIリクエストボディのパース関数
 */
const parseRegisterRequestBody = createValidator<RegisterRequest>({
  name: {
    validator: stringField((value) => validateRequired(value, '氏名'), '氏名を入力してください'),
    errorMessage: '氏名を入力してください',
  },
  password: {
    validator: stringField(validatePassword, 'パスワードが要件を満たしていません', false),
    errorMessage: 'パスワードが要件を満たしていません',
  },
});

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
    const parsed = parseRegisterRequestBody(json);
    if (!parsed.success) {
      return createErrorResponse(parsed.message, HTTP_STATUS.BAD_REQUEST);
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
      return createErrorResponse(
        '認証が必要です。再度ログインしてください',
        HTTP_STATUS.UNAUTHORIZED,
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
      logWarn('招待情報が見つかりません', {
        userId: user.id,
        email: maskEmail(user.email ?? ''),
        error: invitationError?.message,
      });

      return createErrorResponse('招待情報が見つかりません', HTTP_STATUS.FORBIDDEN);
    }

    // 施設情報を取得（レスポンスに含めるため）
    const { data: facility, error: facilityError } = await supabaseServer
      .from('facilities')
      .select('id, name')
      .eq('id', invitation.facility_id)
      .single();

    if (facilityError || !facility) {
      logError('施設情報の取得に失敗しました', {
        userId: user.id,
        facilityId: invitation.facility_id,
        error: facilityError?.message,
      });

      return createErrorResponse('施設情報が見つかりません', HTTP_STATUS.BAD_REQUEST);
    }

    // 有効期限チェック
    const expiresAt = new Date(invitation.expires_at);
    if (!Number.isFinite(expiresAt.getTime())) {
      // 日付フォーマットが無効な場合はシステム側の問題
      logFatal('データベースの有効期限フォーマットが無効です（データ整合性エラー）', {
        userId: user.id,
        facilityId: invitation.facility_id,
        expiresAtRaw: invitation.expires_at,
        expiresAtParsed: expiresAt.toString(),
      });

      return createErrorResponse(
        'システムエラーが発生しました。管理者にお問い合わせください',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    if (expiresAt < new Date()) {
      logInfo('招待情報が有効期限切れです', {
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
      });

      // 期限切れの招待レコードを削除
      await supabaseServer.from('invitations').delete().eq('user_id', user.id);

      return createErrorResponse('招待の有効期限が切れています', HTTP_STATUS.FORBIDDEN);
    }

    // ロールバック用に元のプロフィール情報を取得
    const { data: originalProfile, error: originalProfileError } = await supabaseServer
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    if (originalProfileError || !originalProfile) {
      logError('プロフィール取得に失敗しました', {
        userId: user.id,
        error: originalProfileError?.message,
      });

      return createErrorResponse('プロフィールが見つかりません', HTTP_STATUS.BAD_REQUEST);
    }

    const originalName = originalProfile.name;

    // 施設紐付けを先に実行（外部キー制約等の確認を含む）
    // 失敗時のロールバックを最小限にするために、最初に実行
    const { error: facilityProfileError } = await supabaseAdmin.from('facility_profiles').insert({
      facility_id: invitation.facility_id,
      user_id: user.id,
    });

    if (facilityProfileError) {
      logError('施設紐付けの登録に失敗しました', {
        userId: user.id,
        facilityId: invitation.facility_id,
        error: facilityProfileError.message,
      });

      return createErrorResponse('施設の紐付けに失敗しました', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // profiles.name 更新
    const { error: profileUpdateError } = await supabaseServer
      .from('profiles')
      .update({ name })
      .eq('id', user.id);

    if (profileUpdateError) {
      logError('プロフィール更新に失敗しました', {
        userId: user.id,
        error: profileUpdateError.message,
      });

      // 施設紐付けをロールバック
      await deleteFacilityProfile(supabaseAdmin, user.id, invitation.facility_id);

      return createErrorResponse(
        'プロフィールの更新に失敗しました',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    // auth.users.password 更新（Supabase Admin SDK使用）
    const { error: passwordUpdateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
    });

    // パスワード更新失敗時の補償処理
    if (passwordUpdateError) {
      logError('パスワード更新に失敗しました', {
        userId: user.id,
        error: passwordUpdateError.message,
      });

      // プロフィール名と施設紐付けをロールバック
      await restoreProfileName(supabaseAdmin, user.id, originalName);
      await deleteFacilityProfile(supabaseAdmin, user.id, invitation.facility_id);

      return createErrorResponse(
        'パスワードの設定に失敗しました',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    // 初期登録完了後、招待レコードを削除（期限切れ以外もクリーンアップ）
    //
    // 削除失敗時の判断理由:
    // - ユーザーの初期登録（名前・パスワード設定・施設紐付け）は全て完了済み
    // - 招待レコードはあくまで「登録中」の状態管理用であり、削除失敗してもユーザー体験に影響しない
    // - 残存する招待レコードは有効期限切れで再利用されることはない
    // - 定期的なバッチ処理や手動クリーンアップで後から削除可能
    // - したがって、削除失敗は警告ログのみ出力し、ユーザーには成功を返す
    const { error: deleteInvitationError } = await supabaseServer
      .from('invitations')
      .delete()
      .eq('user_id', user.id);

    if (deleteInvitationError) {
      logWarn('招待レコードの削除に失敗しました（初期登録は完了）', {
        userId: user.id,
        facilityId: invitation.facility_id,
        error: deleteInvitationError.message,
      });
      // 招待削除失敗は致命的でないため、成功レスポンスを返す
      // フロントエンド側では登録完了として扱われ、ユーザーは通常通りサービスを利用可能
    }

    // 成功レスポンス
    logInfo('ユーザー初期登録完了', {
      userId: user.id,
      email: maskEmail(user.email ?? ''),
      facilityId: invitation.facility_id,
      facilityName: facility.name,
    });

    return createSuccessResponse({
      facilityId: facility.id,
      facilityName: facility.name,
      redirectUrl: '/',
    });
  } catch (error) {
    // 予期しないエラー
    logError('初期登録API で予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return createErrorResponse('サーバーエラーが発生しました', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
