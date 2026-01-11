import type { SupabaseClient } from '@supabase/supabase-js';

import { createAdmin } from '@/lib/supabase/server';
import { logInfo, logError, logWarn } from '@/lib/logger';

// Supabase の API レスポンスからエラー情報を安全に抽出するユーティリティ
function extractSupabaseError(result: unknown): string | undefined {
  const r = result as any;
  if (!r) return undefined;

  // 公式の `error` フィールドを優先
  if (r.error) {
    return typeof r.error === 'string' ? r.error : (r.error?.message ?? String(r.error));
  }

  // フォールバックで data?.error をチェック
  if (r.data?.error) {
    const de = r.data.error;
    return typeof de === 'string' ? de : (de?.message ?? String(de));
  }

  return undefined;
}

// 管理者クライアントを使って指定ユーザーのリフレッシュトークンを無効化する
export type RevokeResult = { success: true } | { success: false; reason: string };

async function revokeRefreshTokens(
  adminClient: SupabaseClient,
  userId: string,
): Promise<RevokeResult> {
  try {
    // 管理APIが存在するかチェックしてフォールバック
    const adminAuth = (adminClient as any).auth;
    if (
      !adminAuth ||
      !adminAuth.admin ||
      typeof adminAuth.admin.invalidateUserRefreshTokens !== 'function'
    ) {
      const reason = '管理API invalidateUserRefreshTokens が利用できません';
      logWarn(reason + '。フォールバックします。', { userId });
      return { success: false, reason };
    }

    // 実行
    const result = await adminAuth.admin.invalidateUserRefreshTokens(userId);

    // エラー抽出をヘルパーに委譲して可読性を向上
    const sbError = extractSupabaseError(result);

    if (sbError) {
      logError('リフレッシュトークンの無効化に失敗しました', { userId, error: sbError });
      return { success: false, reason: sbError };
    }

    logInfo('リフレッシュトークンを無効化しました (ユーザー全端末のログアウト)', { userId });
    return { success: true };
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    logError('リフレッシュトークン無効化中に予期しないエラーが発生しました', {
      userId,
      error: errMsg,
      stack: e instanceof Error ? e.stack : undefined,
    });
    return { success: false, reason: errMsg };
  }
}

// サーバーサイドの supabase クライアントで現在のリクエストのセッションを破棄（Cookieクリア等）
export async function signOutServerSide(supabaseServer: SupabaseClient): Promise<boolean> {
  try {
    const { error } = await supabaseServer.auth.signOut();
    if (error) {
      logError('サーバーサイドサインアウトに失敗しました', { error: error.message });
      return false;
    }
    logInfo('サーバーサイドセッションをサインアウトしました');
    return true;
  } catch (e) {
    logError('サーバーサイドサインアウト中に予期しないエラーが発生しました', {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    });
    return false;
  }
}

// 期限切れやトークン失効に伴う強制ログアウト
export async function forceLogoutOnTokenExpiry(
  userId: string,
  adminClient?: SupabaseClient,
): Promise<RevokeResult> {
  const admin = adminClient ?? createAdmin();
  return await revokeRefreshTokens(admin, userId);
}

// 一定時間無操作による自動ログアウト（サーバ側で閾値を満たしたユーザーを呼ぶ想定）
export async function forceLogoutOnInactivity(
  userId: string,
  adminClient?: SupabaseClient,
): Promise<RevokeResult> {
  const admin = adminClient ?? createAdmin();
  return await revokeRefreshTokens(admin, userId);
}

// リフレッシュトークンが失効したときに呼ぶ（例: refresh トークン検証失敗）
export async function forceLogoutOnRefreshTokenInvalid(
  userId: string,
  adminClient?: SupabaseClient,
): Promise<RevokeResult> {
  const admin = adminClient ?? createAdmin();
  return await revokeRefreshTokens(admin, userId);
}

// メールアドレス／パスワード等の資格情報を変更したときは既存セッションを無効化する
export async function forceLogoutOnCredentialChange(
  userId: string,
  adminClient?: SupabaseClient,
): Promise<RevokeResult> {
  const admin = adminClient ?? createAdmin();
  return await revokeRefreshTokens(admin, userId);
}

// 不正なユーザ検知によるログアウト: 別端末からの多重ログインが発生した場合は既存セッションを無効化
// currentSessionId を渡せば将来的に "それ以外を無効化" へ拡張可能（現状は全端末無効化）
export async function invalidateOtherSessionsOnMultiLogin(
  userId: string,
  _currentSessionId?: string,
  adminClient?: SupabaseClient,
): Promise<RevokeResult> {
  const admin = adminClient ?? createAdmin();
  return await revokeRefreshTokens(admin, userId);
}

// 管理者による強制ログアウト
export async function adminForceLogout(
  targetUserId: string,
  performedByAdminId?: string,
  adminClient?: SupabaseClient,
): Promise<RevokeResult> {
  const admin = adminClient ?? createAdmin();

  try {
    // 実行者のログを残す（権限チェックは呼び出し元で行うことを想定）
    logInfo('管理者による強制ログアウトを実行します', {
      targetUserId,
      performedByAdminId,
    });

    return await revokeRefreshTokens(admin, targetUserId);
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    logError('管理者強制ログアウト中にエラーが発生しました', {
      targetUserId,
      performedByAdminId,
      error: errMsg,
    });
    return { success: false, reason: errMsg };
  }
}

// 不正リクエストや認証エラーが起きた時に呼ぶ安全なログアウト処理
export async function forceLogoutOnAuthError(
  userId: string | null,
  adminClient?: SupabaseClient,
): Promise<RevokeResult> {
  if (!userId) {
    logWarn('forceLogoutOnAuthError: userId が空です。処理をスキップします');
    return { success: false, reason: 'userId is null' };
  }
  const admin = adminClient ?? createAdmin();
  return await revokeRefreshTokens(admin, userId);
}

// (imports were consolidated at file top)
