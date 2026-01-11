import type { RegisterRequest } from '@/types/api';
import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';
import { validateRequired, validatePassword } from '@/lib/validation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logError, logInfo, maskEmail } from '@/lib/logger';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/validators';
import { createValidator, stringField } from '@/lib/api/createValidator';

import {
  verifyAuthentication,
  validateInvitation,
  executeRegistration,
  cleanupInvitation,
} from './helpers';

/**
 * 登録APIリクエストボディのパース関数
 */
const parseRegisterRequestBody = createValidator<RegisterRequest>({
  name: {
    validator: stringField((value) => validateRequired(value, '氏名'), '氏名を入力してください'),
    errorMessage: '氏名を入力してください',
  },
  password: {
    validator: stringField(validatePassword, 'パスワードが要件を満たしていません', false),
    errorMessage: 'パスワードが要件を満たしていません',
  },
});

/**
 * POST /api/auth/register
 * 招待ユーザーの初期登録（氏名・パスワード設定）
 *
 * フロー:
 * 1. リクエストバリデーション
 * 2. JWT検証（セッション確認）
 * 3. 招待ユーザ確認（invitations テーブル）
 * 4. profiles.name 更新
 * 5. auth.users.password 更新
 */
export async function POST(request: Request) {
  try {
    // リクエストバリデーション
    const json = await request.json().catch(() => null);
    const parsed = parseRegisterRequestBody(json);
    if (!parsed.success) {
      return createErrorResponse(parsed.message, HTTP_STATUS.BAD_REQUEST);
    }

    const { name, password } = parsed.data;

    // Supabaseクライアント作成
    const supabaseServer = await createServerClient();
    const supabaseAdmin = createAdminClient();

    // 認証検証
    const authResult = await verifyAuthentication(supabaseServer);
    if (!authResult.success) {
      return authResult.error;
    }
    const user = authResult.user;

    // 招待情報検証（有効期限チェック、施設情報取得を含む）
    const invitationResult = await validateInvitation(supabaseServer, user);
    if (!invitationResult.success) {
      return invitationResult.error;
    }
    const { invitation, facility } = invitationResult;

    // ユーザー登録処理を実行
    const registrationResult = await executeRegistration(
      supabaseServer,
      supabaseAdmin,
      user.id,
      name,
      password,
      invitation.facility_id,
    );

    if (!registrationResult.success) {
      return registrationResult.error;
    }

    // 招待レコードをクリーンアップ（失敗しても致命的ではない）
    await cleanupInvitation(supabaseServer, user.id, invitation.facility_id);

    // 成功レスポンス
    logInfo('ユーザー初期登録完了', {
      userId: user.id,
      email: maskEmail(user.email ?? ''),
      facilityId: invitation.facility_id,
      facilityName: facility.name,
    });

    return createSuccessResponse({
      facilityId: facility.id,
      facilityName: facility.name,
      redirectUrl: '/',
    });
  } catch (error) {
    // 予期しないエラー
    logError('初期登録API で予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return createErrorResponse('サーバーエラーが発生しました', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
