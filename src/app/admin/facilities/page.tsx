'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FacilityManagementTable } from '@/features/admin/facilities/components/FacilityManagementTable';
import { AddFacilityButton } from '@/features/admin/facilities/components/AddFacilityButton';
import { Facility, FacilityDetail, FacilityDataMap } from '@/types/facility';
import facilitiesData from '@/dummy_data/facilities_detail.json';
import styles from '@/features/admin/facilities/styles/FacilityManagementPage.module.scss';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';

// ダミーデータをリスト形式に変換
const initialFacilities: Facility[] = Object.values(
  facilitiesData as unknown as FacilityDataMap,
).map((detail: FacilityDetail) => ({
  id: detail.id,
  name: detail.name,
  postalCode: '', // 詳細はルートで郵便番号が分割されていませんが、fullAddressに含まれています。今のところダミーで問題ありません。
  address: detail.accessInfo.locationAddress || detail.fullAddress, // accessInfoから取得
  phone: detail.phone,
  imagePath: null,
}));

export default function FacilityManagementPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);

  // 削除ダイアログの状態
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    // 編集ページへ遷移
    router.push(`/admin/facilities/${id}/edit`);
  };

  const onClickDelete = (id: number) => {
    setFacilityToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (facilityToDelete !== null) {
      // 削除ロジック実行
      setFacilities((prev) => prev.filter((f) => f.id !== facilityToDelete));

      // ダイアログを閉じてリセット
      setIsDeleteDialogOpen(false);
      setFacilityToDelete(null);
    }
  };

  const handleAdd = () => {
    // 追加ページへ遷移
    router.push('/admin/facilities/new');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>施設管理</h1>

      <FacilityManagementTable
        facilities={facilities}
        onEdit={handleEdit}
        onDelete={onClickDelete}
      />

      <AddFacilityButton onClick={handleAdd} />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="施設削除"
        message="本当にこの施設を削除しますか？この操作は取り消せません。"
        confirmLabel="削除する"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
