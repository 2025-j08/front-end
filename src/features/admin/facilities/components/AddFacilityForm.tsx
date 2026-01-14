'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { KinkiPrefecture } from '@/types/facility';

import styles from '../styles/AddFacilityForm.module.scss';

const KINKI_PREFECTURES: KinkiPrefecture[] = [
  '大阪府',
  '京都府',
  '滋賀県',
  '奈良県',
  '兵庫県',
  '和歌山県',
];

interface FormData {
  name: string;
  corporation: string;
  postalCode: string;
  prefecture: KinkiPrefecture;
  city: string;
  addressDetail: string;
}

interface FormErrors {
  name?: string;
  corporation?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  addressDetail?: string;
}

/**
 * 施設追加フォームコンポーネント
 */
export const AddFacilityForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    corporation: '',
    postalCode: '',
    prefecture: '大阪府',
    city: '',
    addressDetail: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '施設名を入力してください';
    }
    if (!formData.corporation.trim()) {
      newErrors.corporation = '運営法人名を入力してください';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = '郵便番号を入力してください';
    } else if (!/^\d{3}-?\d{4}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = '郵便番号の形式が正しくありません（例: 123-4567）';
    }
    if (!formData.city.trim()) {
      newErrors.city = '市区町村を入力してください';
    }
    if (!formData.addressDetail.trim()) {
      newErrors.addressDetail = '番地などを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 入力時にエラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          corporation: formData.corporation.trim(),
          postal_code: formData.postalCode.trim(),
          prefecture: formData.prefecture,
          city: formData.city.trim(),
          address_detail: formData.addressDetail.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '施設の追加に失敗しました');
      }

      // 成功したら施設管理画面に戻る
      router.push('/admin/facilities');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '施設の追加に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/facilities');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          施設名 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="施設名を入力"
        />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="corporation" className={styles.label}>
          運営法人名 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="corporation"
          className={`${styles.input} ${errors.corporation ? styles.inputError : ''}`}
          value={formData.corporation}
          onChange={(e) => handleChange('corporation', e.target.value)}
          placeholder="運営法人名を入力"
        />
        {errors.corporation && <p className={styles.errorText}>{errors.corporation}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="postalCode" className={styles.label}>
          郵便番号 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="postalCode"
          className={`${styles.input} ${styles.postalCodeInput} ${errors.postalCode ? styles.inputError : ''}`}
          value={formData.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          placeholder="123-4567"
        />
        {errors.postalCode && <p className={styles.errorText}>{errors.postalCode}</p>}
      </div>

      <div className={styles.addressGroup}>
        <p className={styles.addressLabel}>
          住所 <span className={styles.required}>*</span>
        </p>

        <div className={styles.addressRow}>
          <div className={styles.formGroupInline}>
            <label htmlFor="prefecture" className={styles.subLabel}>
              都道府県
            </label>
            <select
              id="prefecture"
              className={styles.select}
              value={formData.prefecture}
              onChange={(e) => handleChange('prefecture', e.target.value)}
            >
              {KINKI_PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroupInline}>
            <label htmlFor="city" className={styles.subLabel}>
              市区町村
            </label>
            <input
              type="text"
              id="city"
              className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="大阪市北区"
            />
            {errors.city && <p className={styles.errorText}>{errors.city}</p>}
          </div>

          <div className={styles.formGroupInline}>
            <label htmlFor="addressDetail" className={styles.subLabel}>
              番地など
            </label>
            <input
              type="text"
              id="addressDetail"
              className={`${styles.input} ${errors.addressDetail ? styles.inputError : ''}`}
              value={formData.addressDetail}
              onChange={(e) => handleChange('addressDetail', e.target.value)}
              placeholder="天神橋1-2-3"
            />
            {errors.addressDetail && <p className={styles.errorText}>{errors.addressDetail}</p>}
          </div>
        </div>
      </div>

      {submitError && <p className={styles.submitError}>{submitError}</p>}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </button>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? '追加中...' : '追加する'}
        </button>
      </div>
    </form>
  );
};
