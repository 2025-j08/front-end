'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  FacilityManagementTable,
  type FacilityUpdateData,
} from '@/features/admin/facilities/components/FacilityManagementTable';
import { AddFacilityButton } from '@/features/admin/facilities/components/AddFacilityButton';
import {
  getFacilityManagementList,
  type FacilityManagementItem,
} from '@/lib/supabase/queries/facilities';
import styles from '@/features/admin/facilities/styles/FacilityManagementPage.module.scss';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { SuccessOverlay } from '@/components/form/overlay/successOverlay';

export default function FacilityManagementPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<FacilityManagementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 削除ダイアログの状態
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 完了通知の状態
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 施設一覧を取得
  const fetchFacilities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFacilityManagementList();
      setFacilities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '施設一覧の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleSave = async (id: number, data: FacilityUpdateData) => {
    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'management',
          data: {
            name: data.name,
            postal_code: data.postalCode,
            prefecture: data.prefecture,
            city: data.city,
            address_detail: data.addressDetail,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新に失敗しました');
      }

      // ローカルの状態を更新
      setFacilities((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                name: data.name,
                postalCode: data.postalCode,
                prefecture: data.prefecture,
                city: data.city,
                addressDetail: data.addressDetail,
              }
            : f,
        ),
      );

      setSuccessMessage('施設情報を更新しました');
      setIsSuccessOpen(true);
      setTimeout(() => setIsSuccessOpen(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  const onClickDelete = (id: number) => {
    setFacilityToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (facilityToDelete === null || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/facilities/${facilityToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '削除に失敗しました');
      }

      // ローカルの状態を更新
      setFacilities((prev) => prev.filter((f) => f.id !== facilityToDelete));

      setIsDeleteDialogOpen(false);
      setFacilityToDelete(null);

      setSuccessMessage('施設を削除しました');
      setIsSuccessOpen(true);
      setTimeout(() => setIsSuccessOpen(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    router.push('/admin/facilities/new');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>施設管理</h1>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>施設管理</h1>
        <p className={styles.error}>{error}</p>
        <button onClick={fetchFacilities}>再読み込み</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>施設管理</h1>

      <FacilityManagementTable
        facilities={facilities}
        onSave={handleSave}
        onDelete={onClickDelete}
      />

      <AddFacilityButton onClick={handleAdd} />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="施設削除"
        message="本当にこの施設を削除しますか？この操作は取り消せません。"
        confirmLabel={isDeleting ? '削除中...' : '削除する'}
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <SuccessOverlay isVisible={isSuccessOpen} text={successMessage} />
    </div>
  );
}
