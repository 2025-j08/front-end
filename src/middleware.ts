import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { supabaseConfig } from '@/lib/supabase/config';

/**
 * パスワードリセットフロー中に許可されるパス
 * これ以外のパスへのアクセスはブロックされる
 */
const RECOVERY_ALLOWED_PATHS = [
  '/auth/reset-password',
  '/api/auth/reset-password',
  '/api/auth/signout',
  '/features/auth', // パスワード再設定後のリダイレクト先
];

/**
 * JWTペイロードの型（amrを含む）
 */
interface JwtPayload {
  amr?: { method: string; timestamp: number }[];
  [key: string]: unknown;
}

/**
 * JWTのペイロード部分をデコード
 * middlewareではEdge Runtimeのため、外部ライブラリを使わずbase64デコード
 */
const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * パスワードリセットセッションかどうかを判定
 * amr (Authentication Methods Reference) に 'recovery' が含まれているかチェック
 */
const isRecoverySession = (amr: { method: string; timestamp: number }[] | undefined): boolean => {
  if (!amr) return false;
  return amr.some((m) => m.method === 'recovery');
};

/**
 * パスがリカバリー許可パスに含まれるかチェック
 */
const isRecoveryAllowedPath = (pathname: string): boolean => {
  return RECOVERY_ALLOWED_PATHS.some((path) => pathname.startsWith(path));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的アセット・公開パスはスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 保護対象のパスかチェック（従来の認可チェック用）
  const isAdminPath = pathname.startsWith('/admin');
  const isEditPath = pathname.endsWith('/edit');
  const isFacilitiesPath = pathname.startsWith('/features/facilities');
  const isProtectedPath = isAdminPath || (isFacilitiesPath && isEditPath);

  // Supabaseクライアントを作成
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // ユーザー認証状態を確認
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // パスワードリセットセッションのチェック
  // ユーザーが存在し、リカバリーセッションの場合は許可されたパス以外をブロック
  if (user) {
    // セッション情報を取得してamrをチェック
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // JWTをデコードしてamrを取得
      const jwtPayload = decodeJwtPayload(session.access_token);
      const amr = jwtPayload?.amr;

      if (isRecoverySession(amr) && !isRecoveryAllowedPath(pathname)) {
        // リカバリーセッション中は許可されたパス以外へのアクセスをブロック
        return NextResponse.redirect(new URL('/auth/reset-password', request.url));
      }
    }
  }

  // 保護対象パスでない場合はここで終了
  if (!isProtectedPath) {
    return response;
  }

  // 未認証の場合はホームにリダイレクト
  if (!user) {
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // /admin/* はadminロールのみアクセス可能
  if (isAdminPath) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      const redirectUrl = new URL('/', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|images).*)',
  ],
};
