'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';

import { usePostalCode } from '@/hooks/usePostalCode';
import type { KinkiPrefecture } from '@/types/facility';
import { KINKI_PREFECTURES } from '@/const/searchConditions';
import { VALIDATION_PATTERNS } from '@/const/validation';
import type { FacilityAdminListItem } from '@/types/facility';

import { FACILITY_ADMIN_ROUTES, FACILITY_FORM_VALIDATION } from '../constants';
import type { FacilityTableValidationErrors, FacilityUpdateData } from '../types';
import styles from '../styles/FacilityManagementTable.module.scss';

// 型を再エクスポート（既存のimportとの互換性のため）
export type { FacilityUpdateData } from '../types';

/**
 * FacilityManagementTableコンポーネントのProps
 */
interface FacilityManagementTableProps {
  /** 表示する施設のリスト */
  facilities: FacilityAdminListItem[];
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
  facility: FacilityAdminListItem;
  onSave: (id: number, data: FacilityUpdateData) => Promise<void>;
  onDelete: (id: number) => void;
}) => {
  const [name, setName] = useState(facility.name);
  const [postalCode, setPostalCode] = useState(facility.postalCode);
  const [prefecture, setPrefecture] = useState(facility.prefecture);
  const [city, setCity] = useState(facility.city);
  const [addressDetail, setAddressDetail] = useState(facility.addressDetail);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FacilityTableValidationErrors>({});

  const { fetchAddress, setError: setPostalError } = usePostalCode();

  /**
   * 郵便番号から住所を検索する
   */
  const handlePostalLookup = async () => {
    const cleanPostalCode = postalCode.replace(/[^\d]/g, '');
    if (cleanPostalCode.length !== 7) return;

    const address = await fetchAddress(cleanPostalCode);
    if (address) {
      // 関西6府県に含まれているかチェック
      const isKinki = (KINKI_PREFECTURES as readonly string[]).includes(address.prefecture);

      if (!isKinki) {
        // テーブル内の場合は、郵便番号のエラーとして表示する
        setErrors((prev) => ({
          ...prev,
          postalCode: '関西6府県以外の住所は登録できません。',
        }));
        return;
      }

      setPrefecture(address.prefecture as KinkiPrefecture);
      setCity(address.city);
      // 町域が「以下に掲載がない場合」などは空にする
      setAddressDetail(address.town === '以下に掲載がない場合' ? '' : address.town);
    }
  };

  // 変更があるかどうか判定
  const hasChanges =
    name !== facility.name ||
    postalCode !== facility.postalCode ||
    prefecture !== facility.prefecture ||
    city !== facility.city ||
    addressDetail !== facility.addressDetail;

  // バリデーション
  const validate = (): boolean => {
    const newErrors: FacilityTableValidationErrors = {};

    if (!name.trim()) {
      newErrors.name = FACILITY_FORM_VALIDATION.NAME_REQUIRED;
    }
    if (!postalCode.trim()) {
      newErrors.postalCode = FACILITY_FORM_VALIDATION.POSTAL_CODE_REQUIRED;
    } else if (!VALIDATION_PATTERNS.POSTAL_CODE.test(postalCode.trim())) {
      newErrors.postalCode = FACILITY_FORM_VALIDATION.POSTAL_CODE_INVALID;
    }
    if (!city.trim()) {
      newErrors.city = FACILITY_FORM_VALIDATION.CITY_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(facility.id, {
        name: name.trim(),
        postalCode: postalCode.trim(),
        prefecture,
        city: city.trim(),
        addressDetail: addressDetail.trim(),
      });
      setErrors({});
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr>
      <td className={styles.facilityNameCol}>
        <input
          type="text"
          className={`${styles.nameInput} ${errors.name ? styles.inputError : ''}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label={`${facility.name}の施設名`}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
      </td>
      <td className={styles.postalCodeCol}>
        <div className={styles.postalCodeInputWrapper}>
          <input
            type="text"
            className={`${styles.postalCodeInput} ${errors.postalCode ? styles.inputError : ''}`}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="000-0000"
            aria-label={`${facility.name}の郵便番号`}
            aria-invalid={!!errors.postalCode}
          />
          <button
            type="button"
            className={styles.searchButton}
            onClick={handlePostalLookup}
            aria-label="住所を検索"
            disabled={postalCode.replace(/[^\d]/g, '').length !== 7}
            title="住所を検索"
          >
            <SearchIcon fontSize="small" />
          </button>
        </div>
        {errors.postalCode && <span className={styles.errorMessage}>{errors.postalCode}</span>}
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
          className={`${styles.cityInput} ${errors.city ? styles.inputError : ''}`}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="市区町村"
          aria-label={`${facility.name}の市区町村`}
          aria-invalid={!!errors.city}
        />
        {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
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
            href={FACILITY_ADMIN_ROUTES.EDIT(facility.id)}
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
