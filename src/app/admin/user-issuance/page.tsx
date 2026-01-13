import { createAdminClient } from '@/lib/supabase/server';
import { UserIssuanceForm } from '@/features/admin/userIssuance/UserIssuanceForm';
import searchMapData from '@/dummy_data/searchmap_data.json';
import { logError } from '@/lib/logger';

/**
 * 管理者向けのユーザー発行ページコンポーネントです（Server Component）。
 * `/admin/user-issuance` に対応するページとして表示され、
 * ユーザー発行に必要な入力フォーム {@link UserIssuanceForm} を `<main>` コンテナ内に描画します。
 *
 * データベースから施設一覧を取得し、UserIssuanceFormに渡します。
 * ISR（Incremental Static Regeneration）により、24時間ごとに自動的に再生成されます。
 * データ取得に失敗した場合は、JSONファイルをフォールバックとして使用します。
 *
 * NOTE: 施設一覧の取得には認証が不要（RLSのselect_publicポリシー）のため、
 * createAdminClientを使用してStatic Generationを可能にしています。
 */

// ISR: 24時間ごとに再生成（施設の更新頻度が低いため）
export const revalidate = 86400;

export default async function AdminUserIssuancePage() {
  let facilities: { id: number; name: string }[] = [];

  try {
    // Server Componentでデータベースから施設一覧を取得
    // 認証不要のデータ取得なのでAdminClientを使用（ISR対応）
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('facilities').select('id, name').order('name');

    if (error) {
      throw error;
    }

    facilities = data || [];
  } catch (error) {
    // データ取得失敗時はJSONファイルをフォールバックとして使用
    logError('施設データの取得に失敗しました。フォールバックデータを使用します。', {
      component: 'AdminUserIssuancePage',
      error: error instanceof Error ? error.message : String(error),
    });

    // JSONファイルから施設データを取得（フォールバック）
    facilities = searchMapData.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }

  return (
    <main className="main-content">
      <UserIssuanceForm facilities={facilities} />
    </main>
  );
}
