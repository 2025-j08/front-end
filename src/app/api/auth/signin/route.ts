import { NextResponse } from 'next/server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { validateEmail, validatePassword } from '@/lib/validation';
import { logWarn, logError } from '@/lib/logger';

type SignInRequestBody = {
  email: string;
  password: string;
};

type SignInResponseBody = {
  success?: boolean;
  error?: string;
  role?: string | null;
};

/**
 * リクエストからIPアドレスを取得
 */
const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || realIp || '不明';
};

const parseRequestBody = (
  body: unknown,
): { success: true; data: SignInRequestBody } | { success: false; message: string } => {
  if (typeof body !== 'object' || body === null) {
    return { success: false, message: '不正なリクエスト形式です' };
  }

  const { email, password } = body as Record<string, unknown>;

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

  if (typeof password !== 'string') {
    return { success: false, message: 'パスワードが不正です' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return { success: false, message: 'パスワードが不正です' };
  }

  return { success: true, data: { email: email.trim(), password } };
};

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = parseRequestBody(json);
    if (!parsed.success) {
      return NextResponse.json<SignInResponseBody>({ error: parsed.message }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const supabaseServer = await createServerClient();

    const { data, error } = await supabaseServer.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      // セキュリティ監視用のログを出力（パスワードは含めない）
      const clientIp = getClientIp(request);
      logWarn('ログイン失敗', {
        email,
        reason: error?.message || 'ユーザーが見つかりません',
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      });

      // エラー詳細は返さず、一般的なメッセージのみ返却
      return NextResponse.json<SignInResponseBody>(
        { error: 'メールまたはパスワードが不正です' },
        { status: 401 },
      );
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

    return NextResponse.json<SignInResponseBody>({ success: true, role: profile?.role ?? null });
  } catch (err) {
    logError('サインインAPIで予期しないエラーが発生しました', {
      error: err instanceof Error ? err : String(err),
    });
    return NextResponse.json<SignInResponseBody>(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}
