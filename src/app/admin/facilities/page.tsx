'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FacilityManagementTable } from '@/features/admin/facilities/components/FacilityManagementTable';
import { AddFacilityButton } from '@/features/admin/facilities/components/AddFacilityButton';
import { Facility, FacilityDetail, FacilityDataMap } from '@/types/facility';
import facilitiesData from '@/dummy_data/facilities_detail.json';
import styles from '@/features/admin/facilities/styles/FacilityManagementPage.module.scss';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { SuccessOverlay } from '@/components/form/overlay/successOverlay';

// ダミーデータをリスト形式に変換
const initialFacilities: Facility[] = Object.values(
  facilitiesData as unknown as FacilityDataMap,
).map((detail: FacilityDetail) => ({
  id: detail.id,
  name: detail.name,
  postalCode: '', // TODO: facilities_detail.json では郵便番号が独立した項目として存在せず fullAddress 内に含まれているため、現在は空文字を設定している。郵便番号を使用する要件が追加された場合はデータ構造や変換処理を見直すこと。
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

  // 完了通知の状態
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = (id: number, name: string, address: string) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, name, address } : f)));

    setSuccessMessage('施設情報を更新しました');
    setIsSuccessOpen(true);
    setTimeout(() => setIsSuccessOpen(false), 3000);
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

      // 完了通知を表示
      setSuccessMessage('施設を削除しました');
      setIsSuccessOpen(true);
      setTimeout(() => setIsSuccessOpen(false), 3000); // 3秒後に閉じる
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
        onSave={handleSave}
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

      <SuccessOverlay isVisible={isSuccessOpen} text={successMessage} />
    </div>
  );
}
