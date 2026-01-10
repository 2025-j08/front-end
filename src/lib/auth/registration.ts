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
  // originalName が取得できていない場合は、ロールバックを実施しない
  if (!originalName || typeof originalName !== 'string' || !originalName.trim()) {
    logFatal('プロフィールのロールバック失敗（元の名前が無効）', {
      userId,
      originalName,
    });
    return false;
  }

  const sanitizedOriginalName = originalName.trim();

  try {
    await supabaseAdmin.from('profiles').update({ name: sanitizedOriginalName }).eq('id', userId);

    logInfo('プロフィールのロールバック成功', {
      userId,
      restoredName: sanitizedOriginalName,
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
 * 複数の処理をロールバック（順次実行で一貫性を担保）
 *
 * - プロフィール名復元と施設紐付け削除を順に行い、どちらかが失敗した時点で終了
 * - 部分的な成功による不整合を避け、呼び出し元が失敗を把握できるようにする
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
  // 順次実行して一貫したロールバック状態を担保する
  const profileRolledBack = await restoreProfileName(supabaseAdmin, userId, originalName);
  if (!profileRolledBack) {
    logFatal('プロフィールのロールバックに失敗しました', {
      userId,
      facilityId,
    });
    return false;
  }

  const facilityUnlinked = await deleteFacilityProfile(supabaseAdmin, userId, facilityId);
  if (!facilityUnlinked) {
    logFatal('施設紐付けのロールバックに失敗しました', {
      userId,
      facilityId,
    });
    return false;
  }

  return true;
}
