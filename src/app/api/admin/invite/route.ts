import type { InviteUserRequest } from '@/types/api';
import { createServer, createAdmin } from '@/lib/supabase/server';
import { appConfig } from '@/lib/supabase/config';
import { validateEmail } from '@/lib/validation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logError, logInfo, logFatal, maskEmail } from '@/lib/logger';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/validators';
import { AUTH_ERROR_MESSAGES } from '@/const/messages';
import { createValidator, stringField, positiveIntegerField } from '@/lib/api/createValidator';

// 招待の有効期限（日数）を一元管理
const INVITATION_EXPIRES_IN_DAYS = 3;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

const buildExpiresAtUtc = () => {
  const expiresAt = new Date(Date.now() + INVITATION_EXPIRES_IN_DAYS * MS_IN_DAY);
  return expiresAt.toISOString();
};

/**
 * 招待APIリクエストボディのパース関数
 */
const parseInviteRequestBody = createValidator<InviteUserRequest>({
  email: {
    validator: stringField(validateEmail, '有効なメールアドレスを指定してください', false),
    errorMessage: '有効なメールアドレスを指定してください',
  },
  facilityId: {
    validator: positiveIntegerField('有効な施設IDを指定してください'),
    errorMessage: '有効な施設IDを指定してください',
  },
});

export async function POST(request: Request) {
  try {
    // jsonリクエストボディを取得(エラーがあればnull)
    const json = await request.json().catch(() => null);

    // 各パラメータをバリデーションする
    const parsed = parseInviteRequestBody(json);
    // 失敗時のエラーレスポンス
    if (!parsed.success) {
      return createErrorResponse(parsed.message, HTTP_STATUS.BAD_REQUEST);
    }

    // バリデーション済みデータを代入
    const { email, facilityId } = parsed.data;

    // サーバ用クライアントと管理者用クライアントを作成
    const supabaseServer = await createServer();
    const supabaseAdmin = createAdmin();

    // cookiesからセッションを参照し認証済みユーザかどうか調べている
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    // 未認証のエラーレスポンス
    if (!user) {
      return createErrorResponse(AUTH_ERROR_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED);
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
      return createErrorResponse(AUTH_ERROR_MESSAGES.PERMISSION_REQUIRED, HTTP_STATUS.FORBIDDEN);
    }

    // リクエストボディのメールアドレス宛に招待メールを送信
    // authモジュールの関数は管理者権限で実行する必要がある
    // redirectTo: 招待メール内のリンククリック後、ブラウザのクライアントページ(/auth/callback)へ遷移する
    // 招待リンクはハッシュ(#access_token 等)を返すため、サーバAPIではなくクライアントで処理する必要がある
    const { data, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${appConfig.baseUrl}/auth/callback`,
    });

    // 招待メールの送信に失敗した場合
    if (authError) {
      logError('招待メール送信に失敗しました', {
        email: maskEmail(email),
        error: authError.message,
        errorCode: authError.code,
      });
      return createErrorResponse('招待メール送信に失敗しました', HTTP_STATUS.BAD_REQUEST);
    }

    // ユーザーIDが取得できない場合（メールは送信済みの可能性がある）
    if (!data?.user?.id) {
      logError('招待ユーザーIDの取得に失敗しました（メール送信済みの可能性あり）', {
        email: maskEmail(email),
        dataReceived: data,
      });
      return createErrorResponse(
        '招待処理に失敗しました。管理者にお問い合わせください',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    // 招待ユーザ用テーブルに招待対象ユーザのIDとユーザが担当する施設のIDを保存
    // UPSERT: 既存レコードがあれば更新、なければ挿入（レースコンディション対策）
    // 管理者クライアントを使用してRLSをバイパス
    const { error: upsertError } = await supabaseAdmin.from('invitations').upsert(
      {
        user_id: data.user.id,
        facility_id: facilityId,
        // DBのデフォルト (now() + interval '3 days') と同一の期間をUTC基準で付与
        expires_at: buildExpiresAtUtc(),
      },
      {
        onConflict: 'user_id', // PRIMARY KEYで競合判定
      },
    );

    // invitations保存失敗時の補償処理（ユーザー作成を取り消す）
    if (upsertError) {
      // エラーの構造化ログを出力
      logError('ユーザー作成後の招待情報保存に失敗しました', {
        userId: data.user.id,
        email: maskEmail(email),
        facilityId: facilityId,
        error: upsertError.message,
      });

      // 補償トランザクションにより作成された認証ユーザーを削除
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        logInfo('ロールバック成功', { userId: data.user.id, email: maskEmail(email) });
      } catch (rollbackError) {
        // ロールバック失敗は手動対応が必要になる
        logFatal('ロールバックに失敗しました（手動クリーンアップが必要です）', {
          userId: data.user.id,
          email: maskEmail(email),
          facilityId: facilityId,
          originalError: upsertError.message,
          rollbackError: rollbackError instanceof Error ? rollbackError.message : rollbackError,
        });
      }

      return createErrorResponse('招待情報の保存に失敗しました', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // 成功レスポンス
    return createSuccessResponse();
  } catch (error) {
    // 処理中にエラーが発生した場合のレスポンス
    logError('招待APIで予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
    });
    return createErrorResponse(AUTH_ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
