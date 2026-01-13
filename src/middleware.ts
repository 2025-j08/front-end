import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { supabaseConfig } from '@/lib/supabase/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 保護対象のパスかチェック
  const isAdminPath = pathname.startsWith('/admin');
  const isEditPath = pathname.endsWith('/edit');
  const isFacilitiesPath = pathname.startsWith('/features/facilities');

  const isProtectedPath = isAdminPath || (isFacilitiesPath && isEditPath);

  if (!isProtectedPath) {
    return NextResponse.next();
  }

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
  matcher: ['/admin/:path*', '/features/facilities/:path*/edit'],
};
