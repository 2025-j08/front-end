/**
 * 管理者ユーザーのシードスクリプト
 *
 * 警告: このスクリプトは開発環境での使用のみを想定しています。
 * 本番環境では絶対に使用しないでください。
 * ハードコードされた認証情報は開発用のサンプル値です。
 *
 * - Supabase Admin APIでユーザー作成（メール確認済み）
 * - profilesへ role='admin' と name を upsert
 * - 任意で facility_profiles に施設割当を追加
 *
 * 実行前に以下の環境変数を設定してください：
 * - SUPABASE_SERVICE_ROLE_KEY (必須)
 * - NEXT_PUBLIC_SUPABASE_URL (必須)
 * - SEED_ADMIN_EMAIL (オプション、デフォルト: admin@example.com)
 * - SEED_ADMIN_PASSWORD (オプション、デフォルト: password12345)
 * - SEED_ADMIN_NAME (オプション、デフォルト: 'Administrator')
 * - SEED_ADMIN_FACILITY_ID (オプション、施設割当を行う場合)
 */

import { createAdminClient } from '@/lib/supabase/server';
import { logWarn, logInfo, logError } from '@/lib/logger';

type SeedEnv = {
  email: string;
  password: string;
  name: string;
  facilityId?: number;
};

const getEnv = (): SeedEnv => {
  // 開発用のデフォルト値（環境変数で上書き可能）
  // 本番環境では必ず環境変数で指定してください
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'password12345';
  const name = process.env.SEED_ADMIN_NAME || 'Administrator';
  const rawFacilityId = process.env.SEED_ADMIN_FACILITY_ID
    ? parseInt(process.env.SEED_ADMIN_FACILITY_ID, 10)
    : undefined;

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL または SEED_ADMIN_PASSWORD が設定されていません');
  }

  let facilityId: number | undefined;
  if (rawFacilityId !== undefined) {
    const parsed = Number(rawFacilityId);
    if (Number.isFinite(parsed) && parsed > 0) {
      facilityId = parsed;
    } else {
      throw new Error('SEED_ADMIN_FACILITY_ID は正の数値を指定してください');
    }
  }

  return { email, password, name, facilityId };
};

async function findUserIdByEmail(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  email: string,
): Promise<string | null> {
  try {
    // フィルタ付き取得（SDKによりサポート状況が異なるため存在チェック中心）
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      logWarn('listUsers 取得に失敗しました', { error: error.message });
      return null;
    }
    const matched = data.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    return matched?.id ?? null;
  } catch (e) {
    logWarn('listUsers 実行エラー', { error: e instanceof Error ? e.message : String(e) });
    return null;
  }
}

async function main() {
  const { email, password, name, facilityId } = getEnv();
  const supabaseAdmin = createAdminClient();

  // 開発用サンプル値を使用していることを警告
  if (email === 'admin@example.com' || password === 'password12345') {
    logWarn(
      '開発用のデフォルト認証情報を使用しています。本番環境では環境変数を設定してください。',
      {
        email,
        usingDefaults: true,
      },
    );
  }

  // 既存ユーザーの存在確認
  let userId = await findUserIdByEmail(supabaseAdmin, email);

  if (!userId) {
    // ユーザー作成（メール確認済み、管理メタ設定）
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role: 'admin' },
    });

    if (createError) {
      // 既存ユーザーなどのエラー時は冪等に継続
      logWarn('createUser に失敗しました', {
        code: createError.status,
        error: createError.message,
      });
      // 再取得を試行
      userId = await findUserIdByEmail(supabaseAdmin, email);
      if (!userId) {
        throw new Error('管理者ユーザーの作成または取得に失敗しました');
      }
    } else if (created?.user?.id) {
      userId = created.user.id;
      logInfo('管理者ユーザーを作成しました', { userId, email });
    }
  } else {
    // 既存ユーザーがいる場合はパスワードを変更しない（誤実行防止）
    logWarn('既存管理者ユーザーを検出したためパスワード更新をスキップしました', {
      userId,
      email,
    });
  }

  if (!userId) {
    throw new Error('管理者ユーザーIDを確定できませんでした');
  }

  // profiles を upsert（role='admin'）
  const { error: upsertProfileError } = await supabaseAdmin
    .from('profiles')
    .upsert({ id: userId, name, role: 'admin' }, { onConflict: 'id' });

  if (upsertProfileError) {
    throw new Error(`profiles upsert に失敗しました: ${upsertProfileError.message}`);
  }

  logInfo('profiles を更新しました', { userId, role: 'admin', name });

  // 任意の施設割当（処理順序を register/route.ts と統一）
  if (facilityId !== undefined) {
    const { error: assignError } = await supabaseAdmin
      .from('facility_profiles')
      .upsert({ facility_id: facilityId, user_id: userId }, { onConflict: 'facility_id,user_id' });

    if (assignError) {
      throw new Error(`facility_profiles upsert に失敗しました: ${assignError.message}`);
    }
    logInfo('施設割当を追加しました', { facilityId, userId });
  }

  logInfo('管理者シードが完了しました');
}

// 実行
main()
  .then(() => process.exit(0))
  .catch((err) => {
    logError('管理者シードに失敗しました', { error: err instanceof Error ? err : String(err) });
    process.exit(1);
  });
