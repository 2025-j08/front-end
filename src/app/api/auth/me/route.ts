import { NextRequest } from 'next/server';

import { createErrorResponse } from '@/lib/api/validators';
import { AUTH_ERROR_MESSAGES } from '@/const/messages';
import { HTTP_STATUS } from '@/const/httpStatus';

import { getCurrentUser } from './helpers';

/**
 * GET /api/auth/me
 * 現在の認証済みユーザー情報を返すAPI
 * - 未認証の場合は user: null
 * - 認証済みの場合は user: { id, email, name, role }
 */
export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    // 未認証でも認証済みでも200で返す（認証状態確認APIのため）
    return new Response(JSON.stringify({ user: user ?? null }), {
      status: HTTP_STATUS.OK,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('GET /api/auth/me error:', e);
    return createErrorResponse(AUTH_ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
