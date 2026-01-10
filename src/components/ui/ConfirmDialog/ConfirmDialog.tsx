'use client';

import { useEffect, useRef } from 'react';

import styles from './ConfirmDialog.module.scss';

/**
 * ConfirmDialogコンポーネントのProps
 */
export interface ConfirmDialogProps {
  /** ダイアログを表示するかどうか */
  isOpen: boolean;
  /** タイトル */
  title?: string;
  /** メッセージ本文 */
  message: React.ReactNode;
  /** 確定ボタンのラベル（デフォルト: OK） */
  confirmLabel?: string;
  /** キャンセルボタンのラベル（デフォルト: キャンセル） */
  cancelLabel?: string;
  /** 危険なアクション（赤色ボタン）かどうか */
  isDanger?: boolean;
  /** 確定時のハンドラ */
  onConfirm: () => void;
  /** キャンセル時のハンドラ */
  onCancel: () => void;
}

/**
 * 汎用確認ダイアログコンポーネント
 * window.confirm の代わりに使用します
 */
export const ConfirmDialog = ({
  isOpen,
  title = '確認',
  message,
  confirmLabel = 'OK',
  cancelLabel = 'キャンセル',
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // ダイアログが開いたときにフォーカスを移動
  useEffect(() => {
    if (isOpen) {
      // 少し遅延させてフォーカス移動（アニメーション考慮）
      const timer = setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel} role="presentation">
      <div
        className={styles.dialogBox}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className={styles.title}>
          {title}
        </h2>
        <div id="confirm-dialog-message" className={styles.message}>
          {message}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmButtonRef}
            className={`${styles.confirmButton} ${isDanger ? styles.danger : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
