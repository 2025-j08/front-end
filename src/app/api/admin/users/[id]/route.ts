import type { UpdateUserRequest } from '@/types/api';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logError, logInfo } from '@/lib/logger';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/validators';
import { AUTH_ERROR_MESSAGES, USER_MANAGEMENT_MESSAGES } from '@/const/messages';
import { createValidator, stringField } from '@/lib/api/createValidator';

const NAME_VALIDATION_ERROR = '氏名を入力してください';

/**
 * 氏名更新リクエストのバリデーター
 */
const parseUpdateUserRequest = createValidator<UpdateUserRequest>({
  name: {
    validator: stringField(
      (value) => ({ isValid: value.trim().length > 0 }),
      NAME_VALIDATION_ERROR,
    ),
    errorMessage: NAME_VALIDATION_ERROR,
  },
});

type AuthError = { error: string; status: number };
type AuthSuccess = {
  user: { id: string };
  supabaseServer: Awaited<ReturnType<typeof createServerClient>>;
};
type AuthResult = AuthError | AuthSuccess;

/**
 * 認証・認可チェックの共通処理
 */
async function checkAdminAuth(): Promise<AuthResult> {
  const supabaseServer = await createServerClient();

  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return { error: AUTH_ERROR_MESSAGES.AUTH_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED };
  }

  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: AUTH_ERROR_MESSAGES.PERMISSION_REQUIRED, status: HTTP_STATUS.FORBIDDEN };
  }

  return { user, supabaseServer };
}

/**
 * DELETE /api/admin/users/[id]
 * ユーザーを完全削除する（adminユーザー限定）
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 認証・認可チェック
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const { user } = authResult;

    // 自己削除防止
    if (id === user.id) {
      return createErrorResponse(
        USER_MANAGEMENT_MESSAGES.SELF_OPERATION_FORBIDDEN,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    // Admin SDKでユーザーを完全削除
    // CASCADE設定により profiles, facility_profiles, invitations も削除される
    const supabaseAdmin = createAdminClient();
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (deleteError) {
      logError('ユーザー削除に失敗しました', {
        userId: id,
        error: deleteError.message,
      });
      return createErrorResponse(
        USER_MANAGEMENT_MESSAGES.DELETE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    logInfo('ユーザーを削除しました', {
      deletedUserId: id,
      deletedBy: user.id,
    });

    return createSuccessResponse();
  } catch (error) {
    logError('ユーザー削除で予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
    });
    return createErrorResponse(AUTH_ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * PATCH /api/admin/users/[id]
 * ユーザー情報を更新する（氏名のみ、adminユーザー限定）
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 認証・認可チェック
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const { user, supabaseServer } = authResult;

    // 自己編集防止
    if (id === user.id) {
      return createErrorResponse(
        USER_MANAGEMENT_MESSAGES.SELF_OPERATION_FORBIDDEN,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    // リクエストボディのパース・バリデーション
    const json = await request.json().catch(() => null);
    const parsed = parseUpdateUserRequest(json);

    if (!parsed.success) {
      return createErrorResponse(parsed.message, HTTP_STATUS.BAD_REQUEST);
    }

    const { name } = parsed.data;

    // 対象ユーザーの存在確認
    const { data: targetProfile, error: findError } = await supabaseServer
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !targetProfile) {
      return createErrorResponse(USER_MANAGEMENT_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // 氏名を更新
    const { error: updateError } = await supabaseServer
      .from('profiles')
      .update({ name })
      .eq('id', id);

    if (updateError) {
      logError('ユーザー情報の更新に失敗しました', {
        userId: id,
        error: updateError.message,
      });
      return createErrorResponse(
        USER_MANAGEMENT_MESSAGES.UPDATE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    logInfo('ユーザー情報を更新しました', {
      updatedUserId: id,
      updatedBy: user.id,
    });

    return createSuccessResponse();
  } catch (error) {
    logError('ユーザー情報更新で予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
    });
    return createErrorResponse(AUTH_ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
