'use client';

import { useState } from 'react';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { LoadingOverlay } from '@/components/form';
import type { User } from '@/types/api';

import { UserListTable } from './components/UserListTable';
import { UserReissueModal } from './components/UserReissueModal';
import { useUserList } from './hooks/useUserList';
import styles from './users.module.scss';

/**
 * ユーザー管理画面メインコンポーネント
 */
export const UserList = () => {
  // ユーザー一覧のデータ取得・操作
  const { users, isLoading, error, deleteUser, updateUser, refetch } = useUserList();

  // 削除確認ダイアログの状態管理
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 削除後の再発行確認ダイアログの状態管理
  const [reissueTarget, setReissueTarget] = useState<User | null>(null);

  // 再発行モーダルの状態管理
  const [showReissueModal, setShowReissueModal] = useState(false);
  const [reissueFacility, setReissueFacility] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const success = await deleteUser(deleteTarget.id);
    setIsDeleting(false);

    if (success) {
      // 削除成功 → 再発行確認ダイアログを表示
      setReissueTarget(deleteTarget);
    }
    setDeleteTarget(null);
  };

  /**
   * 削除キャンセル時の処理
   */
  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  /**
   * 再発行確認で「はい」を選択した時
   */
  const handleConfirmReissue = () => {
    if (reissueTarget) {
      setReissueFacility({
        id: reissueTarget.facilityId,
        name: reissueTarget.facilityName,
      });
      setShowReissueModal(true);
    }
    setReissueTarget(null);
  };

  /**
   * 再発行確認で「いいえ」を選択した時
   */
  const handleCancelReissue = () => {
    setReissueTarget(null);
  };

  /**
   * 再発行モーダルを閉じる
   */
  const handleCloseReissueModal = () => {
    setShowReissueModal(false);
    setReissueFacility(null);
  };

  /**
   * 再発行成功時
   */
  const handleReissueSuccess = () => {
    handleCloseReissueModal();
    refetch();
  };

  /**
   * 保存ボタンクリック時（氏名更新）
   */
  const handleSave = async (userId: string, name: string) => {
    await updateUser(userId, name);
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>ユーザー管理</h1>
        <LoadingOverlay isVisible={true} text="読み込み中..." />
      </div>
    );
  }

  // エラー発生時
  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>ユーザー管理</h1>
        <div className={styles.errorState} role="alert">
          <p className={styles.errorMessage}>{error}</p>
          <button type="button" className={styles.retryButton} onClick={refetch}>
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ユーザー管理</h1>

      {/* 削除処理中のオーバーレイ */}
      <LoadingOverlay isVisible={isDeleting} text="削除中..." />

      <UserListTable users={users} onDelete={handleDeleteClick} onSave={handleSave} />

      {/* 削除確認ダイアログ */}
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

      {/* 再発行確認ダイアログ */}
      <ConfirmDialog
        isOpen={reissueTarget !== null}
        title="ユーザー再発行"
        message={
          <>
            <strong>{reissueTarget?.facilityName}</strong> の新しいユーザーを発行しますか？
          </>
        }
        confirmLabel="発行する"
        cancelLabel="いいえ"
        onConfirm={handleConfirmReissue}
        onCancel={handleCancelReissue}
      />

      {/* 再発行モーダル */}
      {reissueFacility && (
        <UserReissueModal
          isOpen={showReissueModal}
          facilityId={reissueFacility.id}
          facilityName={reissueFacility.name}
          onClose={handleCloseReissueModal}
          onSuccess={handleReissueSuccess}
        />
      )}
    </div>
  );
};
