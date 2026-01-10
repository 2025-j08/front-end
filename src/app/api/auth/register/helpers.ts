import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import { HTTP_STATUS } from '@/const/httpStatus';
import { logWarn, logError, logInfo, logFatal, maskEmail } from '@/lib/logger';
import { deleteFacilityProfile, restoreProfileName } from '@/lib/auth/registration';
import { createErrorResponse } from '@/lib/api/validators';

/**
 * 招待情報の型
 */
interface InvitationData {
  facility_id: number;
  expires_at: string;
}

/**
 * 施設情報の型
 */
interface FacilityData {
  id: number;
  name: string;
}

/**
 * 認証検証結果の型
 */
type AuthResult =
  | { success: true; user: User }
  | { success: false; error: ReturnType<typeof createErrorResponse> };

/**
 * 招待バリデーション結果の型
 */
type InvitationResult =
  | { success: true; invitation: InvitationData; facility: FacilityData }
  | { success: false; error: ReturnType<typeof createErrorResponse> };

/**
 * 登録実行結果の型
 */
type RegistrationResult =
  | { success: true }
  | { success: false; error: ReturnType<typeof createErrorResponse> };

/**
 * 認証済みユーザーの検証
 */
export async function verifyAuthentication(supabaseServer: SupabaseClient): Promise<AuthResult> {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: createErrorResponse(
        '認証が必要です。再度ログインしてください',
        HTTP_STATUS.UNAUTHORIZED,
      ),
    };
  }

  return { success: true, user };
}

/**
 * 招待情報のバリデーション
 * 招待レコードの存在確認、有効期限チェック、施設情報取得を行う
 */
export async function validateInvitation(
  supabaseServer: SupabaseClient,
  user: User,
): Promise<InvitationResult> {
  // 招待情報取得
  const { data: invitation, error: invitationError } = await supabaseServer
    .from('invitations')
    .select('facility_id, expires_at')
    .eq('user_id', user.id)
    .single();

  if (invitationError || !invitation) {
    logWarn('招待情報が見つかりません', {
      userId: user.id,
      email: maskEmail(user.email ?? ''),
      error: invitationError?.message,
    });
    return {
      success: false,
      error: createErrorResponse('招待情報が見つかりません', HTTP_STATUS.FORBIDDEN),
    };
  }

  // 施設情報を取得
  const { data: facility, error: facilityError } = await supabaseServer
    .from('facilities')
    .select('id, name')
    .eq('id', invitation.facility_id)
    .single();

  if (facilityError || !facility) {
    logError('施設情報の取得に失敗しました', {
      userId: user.id,
      facilityId: invitation.facility_id,
      error: facilityError?.message,
    });
    return {
      success: false,
      error: createErrorResponse('施設情報が見つかりません', HTTP_STATUS.BAD_REQUEST),
    };
  }

  // 有効期限チェック
  const expiresAt = new Date(invitation.expires_at);
  if (!Number.isFinite(expiresAt.getTime())) {
    logFatal('データベースの有効期限フォーマットが無効です（データ整合性エラー）', {
      userId: user.id,
      facilityId: invitation.facility_id,
      expiresAtRaw: invitation.expires_at,
      expiresAtParsed: expiresAt.toString(),
    });
    return {
      success: false,
      error: createErrorResponse(
        'システムエラーが発生しました。管理者にお問い合わせください',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ),
    };
  }

  if (expiresAt < new Date()) {
    logInfo('招待情報が有効期限切れです', {
      userId: user.id,
      expiresAt: expiresAt.toISOString(),
    });

    // 期限切れの招待レコードを削除
    await supabaseServer.from('invitations').delete().eq('user_id', user.id);

    return {
      success: false,
      error: createErrorResponse('招待の有効期限が切れています', HTTP_STATUS.FORBIDDEN),
    };
  }

  return { success: true, invitation, facility };
}

/**
 * ユーザー登録処理を実行
 */
export async function executeRegistration(
  supabaseServer: SupabaseClient,
  supabaseAdmin: SupabaseClient,
  userId: string,
  name: string,
  password: string,
  facilityId: number,
): Promise<RegistrationResult> {
  // ロールバック用に元のプロフィール情報を取得
  const { data: originalProfile, error: originalProfileError } = await supabaseServer
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .single();

  if (originalProfileError || !originalProfile) {
    logError('プロフィール取得に失敗しました', {
      userId,
      error: originalProfileError?.message,
    });
    return {
      success: false,
      error: createErrorResponse('プロフィールが見つかりません', HTTP_STATUS.BAD_REQUEST),
    };
  }

  const originalName = originalProfile.name;

  // 施設紐付けを先に実行（外部キー制約等の確認を含む）
  const { error: facilityProfileError } = await supabaseAdmin.from('facility_profiles').insert({
    facility_id: facilityId,
    user_id: userId,
  });

  if (facilityProfileError) {
    logError('施設紐付けの登録に失敗しました', {
      userId,
      facilityId,
      error: facilityProfileError.message,
    });
    return {
      success: false,
      error: createErrorResponse('施設の紐付けに失敗しました', HTTP_STATUS.INTERNAL_SERVER_ERROR),
    };
  }

  // profiles.name 更新
  const { error: profileUpdateError } = await supabaseServer
    .from('profiles')
    .update({ name })
    .eq('id', userId);

  if (profileUpdateError) {
    logError('プロフィール更新に失敗しました', {
      userId,
      error: profileUpdateError.message,
    });

    // 施設紐付けをロールバック
    await deleteFacilityProfile(supabaseAdmin, userId, facilityId);

    return {
      success: false,
      error: createErrorResponse(
        'プロフィールの更新に失敗しました',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ),
    };
  }

  // auth.users.password 更新（Supabase Admin SDK使用）
  const { error: passwordUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password,
  });

  // パスワード更新失敗時の補償処理
  if (passwordUpdateError) {
    logError('パスワード更新に失敗しました', {
      userId,
      error: passwordUpdateError.message,
    });

    // プロフィール名と施設紐付けをロールバック
    await restoreProfileName(supabaseAdmin, userId, originalName);
    await deleteFacilityProfile(supabaseAdmin, userId, facilityId);

    return {
      success: false,
      error: createErrorResponse(
        'パスワードの設定に失敗しました',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ),
    };
  }

  return { success: true };
}

/**
 * 招待レコードをクリーンアップ
 * 削除失敗は致命的でないため、警告ログのみ出力
 */
export async function cleanupInvitation(
  supabaseServer: SupabaseClient,
  userId: string,
  facilityId: number,
): Promise<void> {
  const { error: deleteInvitationError } = await supabaseServer
    .from('invitations')
    .delete()
    .eq('user_id', userId);

  if (deleteInvitationError) {
    logWarn('招待レコードの削除に失敗しました（初期登録は完了）', {
      userId,
      facilityId,
      error: deleteInvitationError.message,
    });
  }
}
