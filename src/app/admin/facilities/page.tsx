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
import { FACILITY_ADMIN_ROUTES } from '@/features/admin/facilities/constants';
import { fetchApi } from '@/lib/api/fetchApi';
import { useGeocode } from '@/lib/geocoding/useGeocode';

/** 住所変更時に保持するデータ */
interface PendingAddressUpdate {
  facilityId: number;
  data: FacilityUpdateData;
  fullAddress: string;
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

  // ジオコーディング確認ダイアログの状態
  const [isGeocodeDialogOpen, setIsGeocodeDialogOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<PendingAddressUpdate | null>(null);
  const { geocode, isLoading: isGeocoding } = useGeocode();

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

  /** 施設情報をAPIで更新 */
  const saveFacilityInfo = async (id: number, data: FacilityUpdateData) => {
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
  };

  /** GPS座標を更新 */
  const updateCoordinates = async (id: number, fullAddress: string) => {
    const coords = await geocode(fullAddress);
    if (coords) {
      await fetchApi(
        `/api/facilities/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'coordinates',
            data: {
              lat: coords.lat,
              lng: coords.lng,
              location_address: fullAddress,
            },
          }),
        },
        'GPS座標の更新に失敗しました',
      );
      return true;
    }
    return false;
  };

  /**
   * 住所が変更されたかどうかを判定
   * 変更された場合はジオコーディング確認ダイアログを表示するために使用
   * NOTE: originalが見つからない場合はfalseを返し、ダイアログをスキップして直接保存する
   *       （通常は発生しないが、防御的なフォールバック動作として実装）
   */
  const isAddressChanged = (id: number, data: FacilityUpdateData): boolean => {
    const original = facilities.find((f) => f.id === id);
    if (!original) return false;
    return (
      original.prefecture !== data.prefecture ||
      original.city !== data.city ||
      original.addressDetail !== data.addressDetail
    );
  };

  const handleSave = async (id: number, data: FacilityUpdateData) => {
    const fullAddress = `${data.prefecture}${data.city}${data.addressDetail}`;

    // 住所が変更された場合は確認ダイアログを表示
    if (isAddressChanged(id, data)) {
      setPendingUpdate({ facilityId: id, data, fullAddress });
      setIsGeocodeDialogOpen(true);
      return;
    }

    // 住所変更なしの場合は直接保存
    try {
      await saveFacilityInfo(id, data);
      showSuccess(FACILITY_MESSAGES.UPDATE_SUCCESS);
    } catch (err) {
      showError(err instanceof Error ? err.message : FACILITY_MESSAGES.UPDATE_FAILED);
    }
  };

  /** ジオコーディングダイアログで「座標を更新」を選択 */
  const handleGeocodeConfirm = async () => {
    if (!pendingUpdate || isGeocoding) return;

    try {
      await saveFacilityInfo(pendingUpdate.facilityId, pendingUpdate.data);
      const success = await updateCoordinates(pendingUpdate.facilityId, pendingUpdate.fullAddress);
      if (success) {
        showSuccess('施設情報とGPS座標を更新しました');
      } else {
        showSuccess('施設情報を更新しました（GPS座標の取得に失敗しました）');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : FACILITY_MESSAGES.UPDATE_FAILED);
    } finally {
      setIsGeocodeDialogOpen(false);
      setPendingUpdate(null);
    }
  };

  /** ジオコーディングダイアログで「座標はそのまま」を選択 */
  const handleGeocodeCancel = async () => {
    if (!pendingUpdate) {
      setIsGeocodeDialogOpen(false);
      return;
    }

    try {
      await saveFacilityInfo(pendingUpdate.facilityId, pendingUpdate.data);
      showSuccess(FACILITY_MESSAGES.UPDATE_SUCCESS);
    } catch (err) {
      showError(err instanceof Error ? err.message : FACILITY_MESSAGES.UPDATE_FAILED);
    } finally {
      setIsGeocodeDialogOpen(false);
      setPendingUpdate(null);
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
    router.push(FACILITY_ADMIN_ROUTES.NEW);
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

      <div className={styles.toolbar}>
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
        <AddFacilityButton onClick={handleAdd} />
      </div>

      <FacilityManagementTable
        facilities={filteredFacilities}
        onSave={handleSave}
        onDelete={onClickDelete}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="施設削除"
        message="本当にこの施設を削除しますか？この操作は取り消せません。"
        confirmLabel={isDeleting ? '削除中...' : '削除する'}
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={isGeocodeDialogOpen}
        title="GPS座標の更新"
        message={
          <>
            住所が変更されました。
            <br />
            GPS座標も自動取得して更新しますか？
          </>
        }
        confirmLabel={isGeocoding ? '取得中...' : '座標を更新'}
        cancelLabel="座標はそのまま"
        onConfirm={handleGeocodeConfirm}
        onCancel={handleGeocodeCancel}
      />

      <SuccessOverlay isVisible={isSuccessOpen} text={successMessage} />

      {errorMessage && (
        <div role="alert" className={styles.errorToast}>
          {errorMessage}
        </div>
      )}

      <p className={styles.attribution}>
        <a href="https://developer.yahoo.co.jp/sitemap/" target="_blank" rel="noopener noreferrer">
          Webサービス by Yahoo! JAPAN
        </a>
      </p>
    </div>
  );
}
