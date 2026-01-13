'use client';

import React from 'react';
import Link from 'next/link';

import { Facility } from '@/types/facility';

import styles from '../styles/FacilityManagementTable.module.scss';

interface FacilityManagementTableProps {
  facilities: Facility[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

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
            <th className={styles.actionCol}></th>
            <th className={styles.actionCol}></th>
            <th className={styles.actionCol}></th>
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
