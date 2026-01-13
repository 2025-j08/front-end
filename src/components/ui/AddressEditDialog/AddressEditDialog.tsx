'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './AddressEditDialog.module.scss';

/**
 * AddressEditDialogコンポーネントのProps
 */
export interface AddressEditDialogProps {
  /** ダイアログを表示するかどうか */
  isOpen: boolean;
  /** 施設名 */
  facilityName: string;
  /** 現在の住所 */
  currentAddress: string;
  /** 保存時のハンドラ */
  onSave: (newAddress: string) => void;
  /** キャンセル時のハンドラ */
  onCancel: () => void;
}

/**
 * 住所変更用ダイアログコンポーネント
 */
export const AddressEditDialog = ({
  isOpen,
  facilityName,
  currentAddress,
  onSave,
  onCancel,
}: AddressEditDialogProps) => {
  const [address, setAddress] = useState(currentAddress);
  const inputRef = useRef<HTMLInputElement>(null);

  // ダイアログが開いたときにフォーカスを移動
  useEffect(() => {
    if (isOpen) {
      // 少し遅延させてフォーカス移動
      const timer = setTimeout(() => {
        inputRef.current?.focus();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSave(address);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel} role="presentation">
      <div
        className={styles.dialogBox}
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-edit-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="address-edit-dialog-title" className={styles.title}>
          住所の変更
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="address-input" className={styles.label}>
              {facilityName} の住所
            </label>
            <input
              id="address-input"
              ref={inputRef}
              type="text"
              className={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="住所を入力してください"
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveButton} disabled={!address.trim()}>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
