import type { ForgotPasswordRequest } from '@/types/api';
import { createServerClient } from '@/lib/supabase/server';
import { appConfig } from '@/lib/supabase/config';
import { validateEmail } from '@/lib/validation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logError, logInfo, maskEmail } from '@/lib/logger';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/validators';
import { createValidator, stringField } from '@/lib/api/createValidator';

/**
 * リクエストボディのパース関数
 */
const parseForgotPasswordRequestBody = createValidator<ForgotPasswordRequest>({
  email: {
    validator: stringField(validateEmail, '有効なメールアドレスを入力してください'),
    errorMessage: 'メールアドレスを入力してください',
  },
});

/**
 * POST /api/auth/forgot-password
 * パスワードリセットメール送信
 *
 * セキュリティ: メールアドレスの存在有無を漏らさないため、
 * 存在しないメールアドレスでも成功レスポンスを返す
 */
export async function POST(request: Request) {
  try {
    // リクエストバリデーション
    const json = await request.json().catch(() => null);
    const parsed = parseForgotPasswordRequestBody(json);
    if (!parsed.success) {
      return createErrorResponse(parsed.message, HTTP_STATUS.BAD_REQUEST);
    }

    const { email } = parsed.data;

    // Supabaseクライアント作成
    const supabase = await createServerClient();

    // リダイレクト先URL（コールバックページ）
    // type=recovery を含めることで、コールバック側でパスワードリセットフローと識別できる
    const redirectTo = `${appConfig.baseUrl}/auth/callback?type=recovery`;

    // パスワードリセットメール送信
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      // エラーが発生しても、セキュリティのため成功レスポンスを返す
      // ただし内部ログには記録
      logError('パスワードリセットメール送信エラー', {
        email: maskEmail(email),
        supabaseError: error.message,
      });
    } else {
      logInfo('パスワードリセットメール送信', {
        email: maskEmail(email),
      });
    }

    // 常に成功レスポンスを返す（メールアドレス存在確認攻撃を防ぐ）
    return createSuccessResponse();
  } catch (error) {
    // 予期しないエラー
    logError('パスワードリセットAPIで予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // 予期しないエラーでも成功レスポンスを返す（セキュリティ対策）
    return createSuccessResponse();
  }
}
