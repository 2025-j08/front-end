import { createClient as createServerClient } from '@/lib/supabase/server';
import { validateEmail, validatePassword } from '@/lib/validation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logWarn, logError, maskEmail } from '@/lib/logger';
import {
  validateRequestBody,
  createErrorResponse,
  createSuccessResponse,
  type ParseResult,
} from '@/lib/api/validators';

type SignInRequestBody = {
  email: string;
  password: string;
};

type SignInSuccessData = {
  role: string | null;
};

/**
 * リクエストからIPアドレスを取得
 */
const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || realIp || '不明';
};

/**
 * サインインAPIリクエストボディのパース関数
 *
 * @param body - リクエストボディ
 * @returns パース結果
 */
const parseSignInRequestBody = (body: unknown): ParseResult<SignInRequestBody> => {
  // 基本的なJSONオブジェクト検証
  const bodyValidation = validateRequestBody(body);
  if (!bodyValidation.success) {
    return bodyValidation;
  }

  const obj = bodyValidation.data;

  // メールアドレスの検証
  if (typeof obj.email !== 'string') {
    return { success: false, message: '有効なメールアドレスを指定してください' };
  }

  const emailValidation = validateEmail(obj.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error ?? '有効なメールアドレスを指定してください',
    };
  }

  // パスワードの検証
  if (typeof obj.password !== 'string') {
    return { success: false, message: 'パスワードが不正です' };
  }

  const passwordValidation = validatePassword(obj.password);
  if (!passwordValidation.isValid) {
    return { success: false, message: 'パスワードが不正です' };
  }

  return { success: true, data: { email: obj.email.trim(), password: obj.password } };
};

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = parseSignInRequestBody(json);
    if (!parsed.success) {
      return createErrorResponse(parsed.message, HTTP_STATUS.BAD_REQUEST);
    }

    const { email, password } = parsed.data;

    const supabaseServer = await createServerClient();

    const { data, error } = await supabaseServer.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      // セキュリティ監視用のログを出力（パスワードとメールアドレスはプライバシー保護のためマスク）
      const clientIp = getClientIp(request);
      logWarn('ログイン失敗', {
        email: maskEmail(email),
        reason: error?.message || 'ユーザーが見つかりません',
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      });

      // エラー詳細は返さず、一般的なメッセージのみ返却
      return createErrorResponse('メールまたはパスワードが不正です', HTTP_STATUS.UNAUTHORIZED);
    }

    // 役割取得（RLS有効、セッションユーザー）
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      // 役割取得失敗時もログイン成功は維持するがロールはnull
      logWarn('プロフィール取得に失敗', {
        userId: data.user.id,
        error: profileError.message,
      });
    }

    return createSuccessResponse<SignInSuccessData>({ role: profile?.role ?? null });
  } catch (err) {
    logError('サインインAPIで予期しないエラーが発生しました', {
      error: err instanceof Error ? err : String(err),
    });
    return createErrorResponse('サーバーエラーが発生しました', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
