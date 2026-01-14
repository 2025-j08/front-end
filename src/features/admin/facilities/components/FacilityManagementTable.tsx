'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import type { FacilityManagementItem } from '@/lib/supabase/queries/facilities';
import type { KinkiPrefecture } from '@/types/facility';

import styles from '../styles/FacilityManagementTable.module.scss';

const KINKI_PREFECTURES: KinkiPrefecture[] = [
  '大阪府',
  '京都府',
  '滋賀県',
  '奈良県',
  '兵庫県',
  '和歌山県',
];

/** 更新データの型 */
export interface FacilityUpdateData {
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressDetail: string;
}

/**
 * FacilityManagementTableコンポーネントのProps
 */
interface FacilityManagementTableProps {
  /** 表示する施設のリスト */
  facilities: FacilityManagementItem[];
  /** 保存ボタン押下時のハンドラ */
  onSave: (id: number, data: FacilityUpdateData) => Promise<void>;
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
  facility: FacilityManagementItem;
  onSave: (id: number, data: FacilityUpdateData) => Promise<void>;
  onDelete: (id: number) => void;
}) => {
  const [name, setName] = useState(facility.name);
  const [postalCode, setPostalCode] = useState(facility.postalCode);
  const [prefecture, setPrefecture] = useState(facility.prefecture);
  const [city, setCity] = useState(facility.city);
  const [addressDetail, setAddressDetail] = useState(facility.addressDetail);
  const [isSaving, setIsSaving] = useState(false);

  // 変更があるかどうか判定
  const hasChanges =
    name !== facility.name ||
    postalCode !== facility.postalCode ||
    prefecture !== facility.prefecture ||
    city !== facility.city ||
    addressDetail !== facility.addressDetail;

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(facility.id, {
        name,
        postalCode,
        prefecture,
        city,
        addressDetail,
      });
    } finally {
      setIsSaving(false);
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
      <td className={styles.postalCodeCol}>
        <input
          type="text"
          className={styles.postalCodeInput}
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="000-0000"
          aria-label={`${facility.name}の郵便番号`}
        />
      </td>
      <td className={styles.prefectureCol}>
        <select
          className={styles.prefectureSelect}
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          aria-label={`${facility.name}の都道府県`}
        >
          {KINKI_PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.cityCol}>
        <input
          type="text"
          className={styles.cityInput}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="市区町村"
          aria-label={`${facility.name}の市区町村`}
        />
      </td>
      <td className={styles.addressDetailCol}>
        <input
          type="text"
          className={styles.addressDetailInput}
          value={addressDetail}
          onChange={(e) => setAddressDetail(e.target.value)}
          placeholder="番地など"
          aria-label={`${facility.name}の番地`}
        />
      </td>
      <td className={styles.actionCol}>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            aria-label={`${facility.name}の変更を保存`}
          >
            {isSaving ? '保存中...' : '保存'}
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
 * 施設名、郵便番号、住所（都道府県・市区町村・番地）の編集機能を提供します
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
            <th className={styles.postalCodeCol} scope="col">
              郵便番号
            </th>
            <th className={styles.prefectureCol} scope="col">
              都道府県
            </th>
            <th className={styles.cityCol} scope="col">
              市区町村
            </th>
            <th className={styles.addressDetailCol} scope="col">
              番地など
            </th>
            <th className={styles.actionCol} scope="col">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <FacilityRow
              key={facility.id}
              facility={facility}
              onSave={onSave}
              onDelete={onDelete}
            />
          ))}
          {facilities.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.emptyRow}>
                施設データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
