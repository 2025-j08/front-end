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
  /** 保存ボタンクリック時のハンドラ（氏名更新）。成功時はtrue、失敗時はfalseを返す */
  onSave?: (userId: string, name: string) => Promise<boolean>;
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
  // 保存中の状態
  const [isSaving, setIsSaving] = useState(false);
  // エラーメッセージ
  const [saveError, setSaveError] = useState<string | null>(null);

  // バリデーション：空文字やホワイトスペースのみは無効
  const isValidName = name.trim().length > 0;

  // 変更があり、かつ有効な値かどうか
  const hasChanges = name !== user.name && isValidName;

  /**
   * 保存ボタンクリック時
   */
  const handleSave = async () => {
    if (!hasChanges || !onSave) return;

    setIsSaving(true);
    setSaveError(null);

    const success = await onSave(user.id, name);

    setIsSaving(false);

    if (!success) {
      setSaveError('保存に失敗しました');
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
          onChange={(e) => {
            setName(e.target.value);
            setSaveError(null);
          }}
          disabled={isSaving}
          aria-label={`${user.facilityName}の氏名`}
        />
        {saveError && (
          <span className={styles.saveError} role="alert">
            {saveError}
          </span>
        )}
      </td>
      <td>{user.email}</td>
      <td className={styles.actionCell}>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            aria-label={`${user.facilityName}の氏名変更を保存`}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isSaving}
            aria-label={`${user.facilityName}のユーザーを削除`}
          >
            削除
          </button>
        </div>
      </td>
    </tr>
  );
};
