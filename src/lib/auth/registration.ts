/**
 * ユーザー初期登録のサーバーサイド処理用ユーティリティ
 *
 * 責務:
 * - ユーザープロフィールの初期化
 * - パスワード設定
 * - 施設紐付け登録
 * - トランザクション的なロールバック処理
 */

import { SupabaseClient } from '@supabase/supabase-js';

import { logInfo, logFatal } from '@/lib/logger';

/**
 * 施設紐付け情報の削除（ロールバック用）
 * @param supabaseServer - Supabaseサーバークライアント
 * @param userId - ユーザーID
 * @param facilityId - 施設ID
 * @returns 成功したかどうか
 */
export async function deleteFacilityProfile(
  supabaseServer: SupabaseClient,
  userId: string,
  facilityId: number,
): Promise<boolean> {
  try {
    await supabaseServer
      .from('facility_profiles')
      .delete()
      .eq('user_id', userId)
      .eq('facility_id', facilityId);

    logInfo('施設紐付けのロールバック成功', {
      userId,
      facilityId,
    });

    return true;
  } catch (rollbackError) {
    logFatal('施設紐付けのロールバック失敗', {
      userId,
      facilityId,
      rollbackError: rollbackError instanceof Error ? rollbackError.message : rollbackError,
    });

    return false;
  }
}

/**
 * プロフィール名の復元（ロールバック用）
 * @param supabaseServer - Supabaseサーバークライアント
 * @param userId - ユーザーID
 * @param originalName - 復元する元の名前
 * @returns 成功したかどうか
 */
export async function restoreProfileName(
  supabaseServer: SupabaseClient,
  userId: string,
  originalName: string,
): Promise<boolean> {
  try {
    await supabaseServer.from('profiles').update({ name: originalName }).eq('id', userId);

    logInfo('プロフィールのロールバック成功', {
      userId,
      restoredName: originalName,
    });

    return true;
  } catch (rollbackError) {
    logFatal('プロフィールのロールバック失敗', {
      userId,
      originalName,
      rollbackError: rollbackError instanceof Error ? rollbackError.message : rollbackError,
    });

    return false;
  }
}

/**
 * 複数の処理をロールバック
 * @param supabaseServer - Supabaseサーバークライアント
 * @param userId - ユーザーID
 * @param facilityId - 施設ID
 * @param originalName - 復元する元のプロフィール名
 * @returns すべてのロールバックが成功したかどうか
 */
export async function rollbackRegistration(
  supabaseServer: SupabaseClient,
  userId: string,
  facilityId: number,
  originalName: string,
): Promise<boolean> {
  const results = await Promise.all([
    restoreProfileName(supabaseServer, userId, originalName),
    deleteFacilityProfile(supabaseServer, userId, facilityId),
  ]);

  return results.every((result) => result === true);
}
