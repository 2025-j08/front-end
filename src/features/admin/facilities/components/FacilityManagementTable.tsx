'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { Facility } from '@/types/facility';

import styles from '../styles/FacilityManagementTable.module.scss';

/**
 * FacilityManagementTableコンポーネントのProps
 */
interface FacilityManagementTableProps {
  /** 表示する施設のリスト */
  facilities: Facility[];
  /** 保存ボタン押下時のハンドラ */
  onSave: (id: number, name: string, address: string) => void;
  /** 削除ボタン押下時のハンドラ */
  onDelete: (id: number) => void;
}

/**
 * テーブルの行コンポーネント
 * 各行でフォームの状態を管理します
 */
const FacilityRow = ({
  facility,
  onSave,
  onDelete,
}: {
  facility: Facility;
  onSave: (id: number, name: string, address: string) => void;
  onDelete: (id: number) => void;
}) => {
  const [name, setName] = useState(facility.name);
  const [address, setAddress] = useState(facility.address);

  // 変更があるかどうか判定
  const hasChanges = name !== facility.name || address !== facility.address;

  const handleSave = () => {
    if (hasChanges) {
      onSave(facility.id, name, address);
    }
  };

  return (
    <tr>
      <td className={styles.facilityNameCol}>
        <input
          type="text"
          className={styles.nameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label={`${facility.name}の施設名`}
        />
      </td>
      <td className={styles.addressCol}>
        <input
          type="text"
          className={styles.addressInput}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          aria-label={`${facility.name}の住所`}
        />
      </td>
      <td className={styles.actionCol}>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!hasChanges}
            aria-label={`${facility.name}の変更を保存`}
          >
            保存
          </button>
          <Link
            href={`/admin/facilities/${facility.id}/edit`}
            className={styles.detailButton}
            aria-label={`${facility.name}の詳細情報を編集`}
          >
            詳細編集
          </Link>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => onDelete(facility.id)}
            aria-label={`${facility.name}を削除`}
          >
            削除
          </button>
        </div>
      </td>
    </tr>
  );
};

/**
 * 施設一覧を表示するテーブルコンポーネント
 * 施設名、住所の編集機能を提供します
 */
export const FacilityManagementTable: React.FC<FacilityManagementTableProps> = ({
  facilities,
  onSave,
  onDelete,
}) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.facilityNameCol} scope="col">
              施設名
            </th>
            <th className={styles.addressCol} scope="col">
              住所
            </th>
            <th className={styles.actionCol} scope="col">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <FacilityRow
              key={`${facility.id}-${facility.name}-${facility.address}`}
              facility={facility}
              onSave={onSave}
              onDelete={onDelete}
            />
          ))}
          {facilities.length === 0 && (
            <tr>
              <td colSpan={3} className={styles.emptyRow}>
                施設データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
