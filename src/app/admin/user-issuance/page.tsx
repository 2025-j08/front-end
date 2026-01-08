import { UserIssuanceForm } from '@/features/admin/userIssuance/UserIssuanceForm';

/**
 * 管理者向けのユーザー発行ページコンポーネントです。
 * `/admin/user-issuance` に対応するページとして表示され、
 * ユーザー発行に必要な入力フォーム {@link UserIssuanceForm} を `<main>` コンテナ内に描画します。
 *
 * このコンポーネント自身は状態やビジネスロジックを持たず、
 * 管理画面レイアウトの一部としてフォームコンポーネントをラップする役割に特化しています。
 */

export default function AdminUserIssuancePage() {
  return (
    <main className="main-content">
      <UserIssuanceForm />
    </main>
  );
}
