'use client';

import { User } from '../types';
import styles from '../users.module.scss';

type UserListTableProps = {
  /** ユーザー一覧データ */
  users: User[];
  /** 削除ボタンクリック時のハンドラ */
  onDelete?: (userId: string) => void;
};

/**
 * ユーザー一覧テーブルコンポーネント
 */
export const UserListTable = ({ users, onDelete }: UserListTableProps) => {
  const handleDelete = (userId: string) => {
    if (onDelete) {
      onDelete(userId);
    }
  };

  // ユーザーが0件の場合は空状態を表示
  if (users.length === 0) {
    return (
      <div className={styles.emptyState} role="status" aria-live="polite">
        <p className={styles.emptyMessage}>ユーザーが登録されていません</p>
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead className={styles.tableHeader}>
        <tr>
          <th>施設名</th>
          <th>氏名</th>
          <th>メールアドレス</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className={styles.tableRow}>
            <td>{user.facilityName}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td className={styles.actionCell}>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDelete(user.id)}
                aria-label={`${user.name}を削除`}
              >
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
