'use client';

import styles from '../users.module.scss';

type DeleteConfirmDialogProps = {
  /** ダイアログを表示するかどうか */
  isOpen: boolean;
  /** 削除対象のユーザー名 */
  userName: string;
  /** 削除実行時のハンドラ */
  onConfirm: () => void;
  /** キャンセル時のハンドラ */
  onCancel: () => void;
};

/**
 * 削除確認ダイアログコンポーネント
 */
export const DeleteConfirmDialog = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.dialogOverlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialogBox}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className={styles.dialogTitle}>
          削除の確認
        </h2>
        <p className={styles.dialogMessage}>
          <strong>{userName}</strong> を削除しますか？
          <br />
          この操作は取り消せません。
        </p>
        <div className={styles.dialogActions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            キャンセル
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirm}>
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};
