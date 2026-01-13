'use client';

import React from 'react';
import Link from 'next/link';

import { Facility } from '@/types/facility';

import styles from '../styles/FacilityManagementTable.module.scss';

/**
 * FacilityManagementTableコンポーネントのProps
 */
interface FacilityManagementTableProps {
  /** 表示する施設のリスト */
  facilities: Facility[];
  /** 変更ボタン押下時のハンドラ */
  onEdit: (id: number) => void;
  /** 削除ボタン押下時のハンドラ */
  onDelete: (id: number) => void;
}

/**
 * 施設一覧を表示するテーブルコンポーネント
 * 施設名、住所の表示に加え、編集・詳細編集・削除のアクションを提供します
 */
export const FacilityManagementTable: React.FC<FacilityManagementTableProps> = ({
  facilities,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.facilityNameCol}>施設名</th>
            <th className={styles.addressCol}>住所</th>
            <th className={styles.actionCol} aria-label="変更操作"></th>
            <th className={styles.actionCol} aria-label="詳細編集操作"></th>
            <th className={styles.actionCol} aria-label="削除操作"></th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id}>
              <td className={styles.facilityNameCol}>{facility.name}</td>
              <td className={styles.addressCol}>{facility.address}</td>
              <td className={styles.actionCol}>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(facility.id)}
                  aria-label={`${facility.name}を変更`}
                >
                  変更
                </button>
              </td>
              <td className={styles.actionCol}>
                <Link
                  href={`/features/facilities/${facility.id}/edit`}
                  className={styles.detailButton}
                  aria-label={`${facility.name}の詳細情報を編集`}
                >
                  詳細編集
                </Link>
              </td>
              <td className={styles.actionCol}>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(facility.id)}
                  aria-label={`${facility.name}を削除`}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
          {facilities.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                施設データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
