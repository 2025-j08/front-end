import { createServer, createAdmin } from '@/lib/supabase/server';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logInfo, logWarn, logError, maskEmail } from '@/lib/logger';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequestBody,
  validateStringField,
} from '@/lib/api/validators';
import { SIGNOUT_MESSAGES, AUTH_ERROR_MESSAGES } from '@/const/messages';

import {
  signOutServerSide,
  invalidateOtherSessionsOnMultiLogin,
  adminForceLogout,
} from './helpers';

type Action = 'signout' | 'invalidate_others' | 'admin_force';

/**
 * POST /api/auth/signout
 * - action: 'signout' (既定) | 'invalidate_others' | 'admin_force'
 * - targetUserId: 管理者が指定する強制ログアウト対象ユーザID (admin_force 時必須)
 */
export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);

    const parsedBody = validateRequestBody(json);
    if (!parsedBody.success) {
      return createErrorResponse(parsedBody.message, HTTP_STATUS.BAD_REQUEST);
    }

    const body = parsedBody.data;
    const rawAction = body.action as unknown as string | undefined;
    const action = (rawAction as Action) ?? 'signout';

    // サーバー用 Supabase クライアント
    const supabaseServer = await createServer();

    if (action === 'signout') {
      const ok = await signOutServerSide(supabaseServer);
      if (!ok) {
        logError('サーバーサイドサインアウトに失敗しました');
        return createErrorResponse(
          SIGNOUT_MESSAGES.SIGNOUT_FAILED,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }
      return createSuccessResponse();
    }

    if (action === 'invalidate_others') {
      // 認証確認
      const {
        data: { user },
      } = await supabaseServer.auth.getUser();

      if (!user) {
        return createErrorResponse(AUTH_ERROR_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED);
      }

      const adminClient = createAdmin();
      const invalidated = await invalidateOtherSessionsOnMultiLogin(
        user.id,
        undefined,
        adminClient,
      );
      if (!invalidated.success) {
        logError('他端末無効化に失敗しました', { userId: user.id, reason: invalidated.reason });
        return createErrorResponse(
          SIGNOUT_MESSAGES.INVALIDATE_OTHERS_FAILED,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }

      logInfo('ユーザーが他端末を無効化しました', {
        userId: user.id,
        email: maskEmail(user.email ?? ''),
      });
      return createSuccessResponse();
    }

    if (action === 'admin_force') {
      // targetUserId の検証
      const targetIdRes = validateStringField(
        body,
        'targetUserId',
        SIGNOUT_MESSAGES.TARGET_ID_REQUIRED,
      );
      if (!targetIdRes.success) {
        return createErrorResponse(targetIdRes.message, HTTP_STATUS.BAD_REQUEST);
      }
      const targetUserId = targetIdRes.data;

      // targetUserId の形式検証（UUID v4 形式を想定）
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(targetUserId)) {
        return createErrorResponse(SIGNOUT_MESSAGES.INVALID_TARGET_FORMAT, HTTP_STATUS.BAD_REQUEST);
      }

      // 実行者の認証＋権限チェック
      const {
        data: { user },
      } = await supabaseServer.auth.getUser();

      if (!user) {
        return createErrorResponse(AUTH_ERROR_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED);
      }

      const { data: profile, error: profileError } = await supabaseServer
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        logWarn('管理者権限チェックのためのプロフィール取得に失敗しました', {
          userId: user.id,
          error: profileError?.message,
        });
        return createErrorResponse(AUTH_ERROR_MESSAGES.PERMISSION_REQUIRED, HTTP_STATUS.FORBIDDEN);
      }

      if ((profile as any).role !== 'admin') {
        return createErrorResponse(AUTH_ERROR_MESSAGES.PERMISSION_REQUIRED, HTTP_STATUS.FORBIDDEN);
      }

      // 強制実行
      const adminClient = createAdmin();
      const forced = await adminForceLogout(targetUserId, user.id, adminClient);
      if (!forced.success) {
        logError('管理者強制ログアウトに失敗しました', {
          targetUserId,
          performedBy: user.id,
          reason: forced.reason,
        });
        return createErrorResponse(
          SIGNOUT_MESSAGES.ADMIN_FORCE_FAILED,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }

      logInfo('管理者がユーザーを強制ログアウトしました', {
        targetUserId,
        performedBy: user.id,
      });

      return createSuccessResponse();
    }

    return createErrorResponse(SIGNOUT_MESSAGES.INVALID_ACTION, HTTP_STATUS.BAD_REQUEST);
  } catch (err) {
    logError('サインアウトAPIで予期しないエラーが発生しました', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return createErrorResponse(AUTH_ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
