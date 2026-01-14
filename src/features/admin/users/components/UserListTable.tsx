'use client';

import type { User } from '@/types/api';

import { UserRow } from './UserRow';
import styles from '../users.module.scss';

/**
 * UserListTableコンポーネントのProps
 */
export interface UserListTableProps {
  /** ユーザー一覧データ */
  users: User[];
  /** 削除ボタンクリック時のハンドラ */
  onDelete?: (userId: string) => void;
  /** 保存ボタンクリック時のハンドラ（氏名更新） */
  onSave?: (userId: string, name: string) => void;
}

/**
 * ユーザー一覧テーブルコンポーネント
 */
export const UserListTable = ({ users, onDelete, onSave }: UserListTableProps) => {
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
          <UserRow key={user.id} user={user} onSave={onSave} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};
