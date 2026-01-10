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
  supabaseAdmin: SupabaseClient,
  userId: string,
  facilityId: number,
): Promise<boolean> {
  try {
    await supabaseAdmin
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
  supabaseAdmin: SupabaseClient,
  userId: string,
  originalName: string,
): Promise<boolean> {
  try {
    await supabaseAdmin.from('profiles').update({ name: originalName }).eq('id', userId);

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
 *
 * Promise.all を使用して並行実行する理由:
 * - 処理速度の向上（2つのDB操作を並行実行）
 * - 部分的なロールバックの許容（片方が失敗しても、もう片方は実行を継続）
 * - ロールバックは「可能な限り元の状態に戻す」ことが目的であり、
 *   片方が失敗したからといって、もう片方のロールバックを中止する必要はない
 * - 各処理の成否は個別にログ出力されるため、失敗箇所の特定が可能
 *
 * @param supabaseServer - Supabaseサーバークライアント
 * @param userId - ユーザーID
 * @param facilityId - 施設ID
 * @param originalName - 復元する元のプロフィール名
 * @returns すべてのロールバックが成功したかどうか
 */
export async function rollbackRegistration(
  supabaseAdmin: SupabaseClient,
  userId: string,
  facilityId: number,
  originalName: string,
): Promise<boolean> {
  // 並行実行により処理速度を向上させる
  // 片方が失敗しても、もう片方のロールバックは継続される（部分的なロールバックを許容）
  const results = await Promise.all([
    restoreProfileName(supabaseAdmin, userId, originalName),
    deleteFacilityProfile(supabaseAdmin, userId, facilityId),
  ]);

  // すべてのロールバックが成功した場合のみ true を返す
  const allSucceeded = results.every((result) => result === true);

  if (!allSucceeded) {
    logFatal('一部またはすべてのロールバック処理に失敗しました', {
      userId,
      facilityId,
      profileRollback: results[0],
      facilityProfileRollback: results[1],
    });
  }

  return allSucceeded;
}
