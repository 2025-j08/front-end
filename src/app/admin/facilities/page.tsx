'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { UI_TIMEOUTS } from '@/const/ui';
import { FACILITY_MESSAGES } from '@/const/messages';

/** APIリクエスト用のヘルパー関数 */
async function fetchApi<T>(
  url: string,
  options: RequestInit,
  defaultErrorMessage: string,
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || defaultErrorMessage);
  }
  return response.json();
}

export default function FacilityManagementPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<FacilityManagementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 削除ダイアログの状態
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 通知の状態
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** 成功通知を表示 */
  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
    setTimeout(() => setIsSuccessOpen(false), UI_TIMEOUTS.SUCCESS_OVERLAY);
  }, []);

  /** エラー通知を表示 */
  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), UI_TIMEOUTS.SUCCESS_OVERLAY);
  }, []);

  // 施設名検索の状態管理
  const [searchQuery, setSearchQuery] = useState('');

  // 施設名でフィルタリングされた施設一覧
  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) {
      return facilities;
    }
    const query = searchQuery.toLowerCase();
    return facilities.filter((facility) => facility.name.toLowerCase().includes(query));
  }, [facilities, searchQuery]);

  // 施設一覧を取得
  const fetchFacilities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFacilityManagementList();
      setFacilities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : FACILITY_MESSAGES.FETCH_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleSave = async (id: number, data: FacilityUpdateData) => {
    try {
      await fetchApi(
        `/api/facilities/${id}`,
        {
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
        },
        FACILITY_MESSAGES.UPDATE_FAILED,
      );

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

      showSuccess(FACILITY_MESSAGES.UPDATE_SUCCESS);
    } catch (err) {
      showError(err instanceof Error ? err.message : FACILITY_MESSAGES.UPDATE_FAILED);
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
      await fetchApi(
        `/api/facilities/${facilityToDelete}`,
        { method: 'DELETE' },
        FACILITY_MESSAGES.DELETE_FAILED,
      );

      // ローカルの状態を更新
      setFacilities((prev) => prev.filter((f) => f.id !== facilityToDelete));

      setIsDeleteDialogOpen(false);
      setFacilityToDelete(null);

      showSuccess(FACILITY_MESSAGES.DELETE_SUCCESS);
    } catch (err) {
      showError(err instanceof Error ? err.message : FACILITY_MESSAGES.DELETE_FAILED);
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

      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="施設名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="施設名で検索"
        />
        {searchQuery && (
          <span className={styles.searchResult}>
            {filteredFacilities.length}件 / {facilities.length}件
          </span>
        )}
      </div>

      <FacilityManagementTable
        facilities={filteredFacilities}
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

      {errorMessage && (
        <div role="alert" className={styles.errorToast}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
