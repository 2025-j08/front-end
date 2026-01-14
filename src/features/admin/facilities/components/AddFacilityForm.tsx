'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FormField, LoadingOverlay, SuccessOverlay } from '@/components/form';
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
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 入力時にエラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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

      // 成功表示
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/admin/facilities');
      }, 1500);
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
    <div className={styles.container}>
      <LoadingOverlay isVisible={isSubmitting} text="登録処理中..." />
      <SuccessOverlay isVisible={isSuccess} text="施設を追加しました" />

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="施設名"
          type="text"
          id="name"
          name="name"
          placeholder="施設名を入力"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <FormField
          label="運営法人名"
          type="text"
          id="corporation"
          name="corporation"
          placeholder="運営法人名を入力"
          required
          value={formData.corporation}
          onChange={handleChange}
          error={errors.corporation}
        />

        <FormField
          label="郵便番号"
          type="text"
          id="postalCode"
          name="postalCode"
          placeholder="123-4567"
          required
          value={formData.postalCode}
          onChange={handleChange}
          error={errors.postalCode}
        />

        {/* 住所セクション */}
        <div className={styles.addressSection}>
          <p className={styles.addressLabel}>住所</p>

          <div className={styles.selectWrapper}>
            <label htmlFor="prefecture">都道府県</label>
            <div className={styles.selectContainer}>
              <select
                id="prefecture"
                name="prefecture"
                className={styles.select}
                value={formData.prefecture}
                onChange={handleChange}
              >
                {KINKI_PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FormField
            label="市区町村"
            type="text"
            id="city"
            name="city"
            placeholder="大阪市北区"
            required
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
          />

          <FormField
            label="番地など"
            type="text"
            id="addressDetail"
            name="addressDetail"
            placeholder="天神橋1-2-3"
            required
            value={formData.addressDetail}
            onChange={handleChange}
            error={errors.addressDetail}
          />
        </div>

        {/* 送信エラーメッセージ */}
        {submitError && (
          <div role="alert" className={styles.submitErrorMessage}>
            {submitError}
          </div>
        )}

        {/* ボタン */}
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
    </div>
  );
};
