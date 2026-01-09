/**
 * 管理者ユーザーのシードスクリプト
 * - Supabase Admin APIでユーザー作成（メール確認済み）
 * - profilesへ role='admin' と name を upsert
 * - 任意で facility_profiles に施設割当を追加
 *
 * 実行前に以下の環境変数を設定してください：
 * - SUPABASE_SERVICE_ROLE_KEY
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SEED_ADMIN_EMAIL
 * - SEED_ADMIN_PASSWORD
 * - SEED_ADMIN_NAME (任意、未設定時は 'Administrator')
 * - SEED_ADMIN_FACILITY_ID (任意、施設割当を行う場合)
 */

import { createAdminClient } from '@/lib/supabase/server';

type SeedEnv = {
  email: string;
  password: string;
  name: string;
  facilityId?: number;
};

const getEnv = (): SeedEnv => {
  const email = 'admin@example.com';
  const password = 'password12345';
  const name = 'Administrator';
  const rawFacilityId = 1;

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
      console.warn('listUsers 取得に失敗しました', { error: error.message });
      return null;
    }
    const matched = data.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    return matched?.id ?? null;
  } catch (e) {
    console.warn('listUsers 実行エラー', e);
    return null;
  }
}

async function main() {
  const { email, password, name, facilityId } = getEnv();
  const supabaseAdmin = createAdminClient();

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
      console.warn('createUser に失敗しました', {
        code: createError.status,
        message: createError.message,
      });
      // 再取得を試行
      userId = await findUserIdByEmail(supabaseAdmin, email);
      if (!userId) {
        throw new Error('管理者ユーザーの作成または取得に失敗しました');
      }
    } else if (created?.user?.id) {
      userId = created.user.id;
      console.log('管理者ユーザーを作成しました', { userId, email });
    }
  } else {
    // 既存ユーザーのパスワード更新（必要時）
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, { password });
      console.log('既存管理者ユーザーのパスワードを更新しました', { userId, email });
    } catch (e) {
      console.warn('パスワード更新に失敗しました（既存ユーザー）', e);
    }
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

  console.log('profiles を更新しました', { userId, role: 'admin', name });

  // 任意の施設割当
  if (facilityId !== undefined) {
    const { error: assignError } = await supabaseAdmin
      .from('facility_profiles')
      .upsert({ facility_id: facilityId, user_id: userId }, { onConflict: 'facility_id,user_id' });

    if (assignError) {
      throw new Error(`facility_profiles upsert に失敗しました: ${assignError.message}`);
    }
    console.log('施設割当を追加しました', { facilityId, userId });
  }

  console.log('管理者シードが完了しました');
}

// 実行
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('管理者シードに失敗しました', err);
    process.exit(1);
  });
