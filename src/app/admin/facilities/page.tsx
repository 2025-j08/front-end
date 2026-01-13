'use client';

import React, { useState } from 'react';

import { FacilityManagementTable } from '@/features/admin/facilities/components/FacilityManagementTable';
import { AddFacilityButton } from '@/features/admin/facilities/components/AddFacilityButton';
import { Facility, FacilityDetail, FacilityDataMap } from '@/types/facility';
import facilitiesData from '@/dummy_data/facilities_detail.json';
import styles from '@/features/admin/facilities/styles/FacilityManagementPage.module.scss';

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
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);

  const handleEdit = (id: number) => {
    alert(`Edit facility ${id}`);
    // ここで編集ページへの遷移処理を行います
  };

  const handleDelete = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      alert(`Delete facility ${id}`);
      // ここで削除ロジックを実行します
      setFacilities((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleAdd = () => {
    alert('Add new facility');
    // ここで追加ページへの遷移処理を行います
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>施設管理</h1>

      <FacilityManagementTable
        facilities={facilities}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddFacilityButton onClick={handleAdd} />
    </div>
  );
}
