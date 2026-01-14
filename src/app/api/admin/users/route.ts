import type { User } from '@/types/api';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { HTTP_STATUS } from '@/const/httpStatus';
import { logError } from '@/lib/logger';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/validators';
import { AUTH_ERROR_MESSAGES, USER_MANAGEMENT_MESSAGES } from '@/const/messages';

/**
 * GET /api/admin/users
 * ユーザー一覧を取得する（adminユーザー限定）
 * 自分自身は除外、role=staffのユーザーのみ返却
 */
export async function GET() {
  try {
    const supabaseServer = await createServerClient();
    const supabaseAdmin = createAdminClient();

    // 認証チェック
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      return createErrorResponse(AUTH_ERROR_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    // 管理者権限チェック
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return createErrorResponse(AUTH_ERROR_MESSAGES.PERMISSION_REQUIRED, HTTP_STATUS.FORBIDDEN);
    }

    // staffユーザー一覧を取得（自分自身を除外）
    const { data: staffProfiles, error: profilesError } = await supabaseServer
      .from('profiles')
      .select('id, name')
      .eq('role', 'staff')
      .neq('id', user.id);

    if (profilesError) {
      logError('ユーザー一覧取得に失敗しました', {
        error: profilesError.message,
        code: profilesError.code,
      });
      return createErrorResponse(
        USER_MANAGEMENT_MESSAGES.FETCH_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    // 施設紐付け情報を取得
    const staffIds = (staffProfiles ?? []).map((p) => p.id);
    const { data: facilityProfiles, error: facilityError } = await supabaseServer
      .from('facility_profiles')
      .select(
        `
        user_id,
        facility_id,
        facilities (
          name
        )
      `,
      )
      .in('user_id', staffIds.length > 0 ? staffIds : ['']);

    if (facilityError) {
      logError('施設情報取得に失敗しました', {
        error: facilityError.message,
        code: facilityError.code,
      });
      return createErrorResponse(
        USER_MANAGEMENT_MESSAGES.FETCH_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    // Auth APIからメールアドレスを取得
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      logError('認証ユーザー一覧取得に失敗しました', {
        error: authError.message,
      });
      return createErrorResponse(
        USER_MANAGEMENT_MESSAGES.FETCH_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    // メールアドレスをIDでマッピング
    const emailMap = new Map<string, string>();
    authUsers.users.forEach((authUser) => {
      if (authUser.email) {
        emailMap.set(authUser.id, authUser.email);
      }
    });

    // 施設情報をユーザーIDでマッピング
    const facilityMap = new Map<string, { facility_id: number; facility_name: string }>();
    (facilityProfiles ?? []).forEach((fp) => {
      const facility = Array.isArray(fp.facilities) ? fp.facilities[0] : fp.facilities;
      facilityMap.set(fp.user_id, {
        facility_id: fp.facility_id,
        facility_name: facility?.name ?? '不明',
      });
    });

    // レスポンス形式に変換
    const users: User[] = (staffProfiles ?? []).map((profile) => {
      const facilityInfo = facilityMap.get(profile.id);

      return {
        id: profile.id,
        facilityId: facilityInfo?.facility_id ?? 0,
        facilityName: facilityInfo?.facility_name ?? '不明',
        name: profile.name ?? '未設定',
        email: emailMap.get(profile.id) ?? '不明',
      };
    });

    return createSuccessResponse(users);
  } catch (error) {
    logError('ユーザー一覧取得で予期しないエラーが発生しました', {
      error: error instanceof Error ? error : String(error),
    });
    return createErrorResponse(AUTH_ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
