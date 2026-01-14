'use client';

import { useState, useEffect, useRef } from 'react';

import type { InviteUserResponse } from '@/types/api';
import { validateEmail } from '@/lib/validation';
import { API_ENDPOINTS } from '@/const/api';
import { logError } from '@/lib/clientLogger';
import { FormField, LoadingOverlay, SuccessOverlay } from '@/components/form';

import styles from '../users.module.scss';

const SUCCESS_MESSAGE_DURATION = 2000;

/**
 * UserReissueModalコンポーネントのProps
 */
interface UserReissueModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 施設ID（招待先） */
  facilityId: number;
  /** 施設名（表示用） */
  facilityName: string;
  /** モーダルを閉じる時のコールバック */
  onClose: () => void;
  /** 発行成功時のコールバック */
  onSuccess: () => void;
}

/**
 * ユーザー再発行用モーダルコンポーネント
 * 削除後に同じ施設の新しいユーザーを発行するためのフォーム
 */
export const UserReissueModal = ({
  isOpen,
  facilityId,
  facilityName,
  onClose,
  onSuccess,
}: UserReissueModalProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  // モーダルの表示/非表示を制御
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // 成功メッセージの自動非表示
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
      }, SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onSuccess]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  /**
   * フォーム送信処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    const emailValidation = validateEmail(email.trim());
    if (!emailValidation.isValid) {
      setError(emailValidation.error ?? '有効なメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.INVITE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          facilityId,
        }),
      });

      const data: InviteUserResponse | null = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorMessage =
          data && !data.success ? data.error : '招待に失敗しました。もう一度お試しください。';
        throw new Error(errorMessage);
      }

      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      logError('ユーザー再発行に失敗しました', {
        component: 'UserReissueModal',
        facilityId,
        error: err instanceof Error ? err : String(err),
      });

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'システムエラーが発生しました。もう一度お試しください。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * キャンセル処理
   */
  const handleCancel = () => {
    setEmail('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className={styles.modal} aria-labelledby="reissue-modal-title">
      <div className={styles.modalContent}>
        <LoadingOverlay isVisible={isLoading} text="発行中..." />
        <SuccessOverlay isVisible={isSuccess} text="ユーザー発行が完了しました" />

        <h2 id="reissue-modal-title" className={styles.modalTitle}>
          ユーザー発行
        </h2>

        <p className={styles.modalDescription}>
          <strong>{facilityName}</strong> の新しいユーザーを発行します。
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="メールアドレス"
            type="email"
            id="reissue-email"
            name="email"
            placeholder="example@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ?? undefined}
          />

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              キャンセル
            </button>
            <button type="submit" className={styles.modalSubmitButton} disabled={isLoading}>
              {isLoading ? '発行中...' : '発行'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
