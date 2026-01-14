'use client';

import { useState } from 'react';

import type { User } from '@/types/api';

import styles from '../users.module.scss';

/**
 * UserRowコンポーネントのProps
 */
interface UserRowProps {
  /** ユーザーデータ */
  user: User;
  /** 保存ボタンクリック時のハンドラ（氏名更新） */
  onSave?: (userId: string, name: string) => void;
  /** 削除ボタンクリック時のハンドラ */
  onDelete?: (userId: string) => void;
}

/**
 * ユーザー一覧テーブルの行コンポーネント
 * インライン編集機能を提供
 */
export const UserRow = ({ user, onSave, onDelete }: UserRowProps) => {
  // 編集中の氏名を管理
  const [name, setName] = useState(user.name);

  // バリデーション：空文字やホワイトスペースのみは無効
  const isValidName = name.trim().length > 0;

  // 変更があり、かつ有効な値かどうか
  const hasChanges = name !== user.name && isValidName;

  /**
   * 保存ボタンクリック時
   */
  const handleSave = () => {
    if (hasChanges && onSave) {
      onSave(user.id, name);
    }
  };

  /**
   * 削除ボタンクリック時
   */
  const handleDelete = () => {
    if (onDelete) {
      onDelete(user.id);
    }
  };

  return (
    <tr className={styles.tableRow}>
      <td>{user.facilityName}</td>
      <td>
        <input
          type="text"
          className={styles.nameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label={`${user.facilityName}の氏名`}
        />
      </td>
      <td>{user.email}</td>
      <td className={styles.actionCell}>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!hasChanges}
            aria-label={`${user.facilityName}の氏名変更を保存`}
          >
            保存
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label={`${user.facilityName}のユーザーを削除`}
          >
            削除
          </button>
        </div>
      </td>
    </tr>
  );
};
