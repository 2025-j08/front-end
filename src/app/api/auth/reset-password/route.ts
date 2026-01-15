import type { ResetPasswordRequest } from '@/types/api';
import { createServerClient } from '@/lib/supabase/server';
import { validatePassword } from '@/lib/validation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logError, logInfo, maskEmail } from '@/lib/logger';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/validators';
import { AUTH_ERROR_MESSAGES, PASSWORD_RESET_MESSAGES } from '@/const/messages';
import { createValidator, stringField } from '@/lib/api/createValidator';

/**
 * リクエストボディのパース関数
 */
const parseResetPasswordRequestBody = createValidator<ResetPasswordRequest>({
  password: {
    validator: stringField(validatePassword, 'パスワードが要件を満たしていません', false),
    errorMessage: 'パスワードが要件を満たしていません',
  },
});

/**
 * POST /api/auth/reset-password
 * パスワード再設定
 *
 * パスワードリセットリンクからのアクセス後、
 * セッションが確立された状態で呼び出される
 */
export async function POST(request: Request) {
  try {
    // リクエストバリデーション
    const json = await request.json().catch(() => null);
    const parsed = parseResetPasswordRequestBody(json);
    if (!parsed.success) {
      return createErrorResponse(parsed.message, HTTP_STATUS.BAD_REQUEST);
    }

    const { password } = parsed.data;

    // Supabaseクライアント作成
    const supabase = await createServerClient();

    // 現在のユーザーを取得（リセットトークンからセッションが確立されている必要がある）
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      logError('パスワード再設定: 認証エラー', {
        supabaseError: userError?.message,
      });
      return createErrorResponse(PASSWORD_RESET_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    const user = userData.user;

    // パスワード更新
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      logError('パスワード更新エラー', {
        userId: user.id,
        email: maskEmail(user.email ?? ''),
        supabaseError: updateError.message,
      });
      return createErrorResponse(PASSWORD_RESET_MESSAGES.RESET_FAILED, HTTP_STATUS.BAD_REQUEST);
    }

    logInfo('パスワード再設定完了', {
      userId: user.id,
      email: maskEmail(user.email ?? ''),
    });

    return createSuccessResponse();
  } catch (error) {
    // 予期しないエラー
    logError('パスワード再設定APIで予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return createErrorResponse(AUTH_ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
