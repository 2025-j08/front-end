'use client';

import { useState } from 'react';

import usersData from '@/dummy_data/users_list.json';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';

import { User } from './types';
import { UserListTable } from './components/UserListTable';
import styles from './users.module.scss';

/**
 * ユーザー管理画面メインコンポーネント
 */
export const UserList = () => {
  // ユーザー一覧の状態管理
  const [users, setUsers] = useState<User[]>(usersData);

  // 削除確認ダイアログの状態管理
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  /**
   * 削除ボタンクリック時（確認ダイアログを表示）
   */
  const handleDeleteClick = (userId: string) => {
    const targetUser = users.find((user) => user.id === userId);
    if (targetUser) {
      setDeleteTarget(targetUser);
    }
  };

  /**
   * 削除確認時の処理
   */
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  /**
   * 削除キャンセル時の処理
   */
  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ユーザー管理</h1>
      <UserListTable users={users} onDelete={handleDeleteClick} />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="削除の確認"
        message={
          <>
            <strong>{deleteTarget?.name}</strong> を削除しますか？
            <br />
            この操作は取り消せません。
          </>
        }
        confirmLabel="削除する"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
