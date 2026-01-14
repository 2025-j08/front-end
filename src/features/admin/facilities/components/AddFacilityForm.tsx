'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { FormField, LoadingOverlay, SuccessOverlay } from '@/components/form';
import { FACILITY_MESSAGES } from '@/const/messages';
import { KINKI_PREFECTURES } from '@/const/searchConditions';
import { UI_TIMEOUTS } from '@/const/ui';
import type { KinkiPrefecture } from '@/types/facility';

import styles from '../styles/AddFacilityForm.module.scss';

interface FormData {
  name: string;
  corporation: string;
  postalCode1: string;
  postalCode2: string;
  prefecture: KinkiPrefecture;
  city: string;
  addressDetail: string;
}

interface FormErrors {
  name?: string;
  corporation?: string;
  postalCode1?: string;
  postalCode2?: string;
  prefecture?: string;
  city?: string;
  addressDetail?: string;
}

/**
 * 施設追加フォームコンポーネント
 */
export const AddFacilityForm: React.FC = () => {
  const router = useRouter();
  const postalCode2Ref = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    corporation: '',
    postalCode1: '',
    postalCode2: '',
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
    if (!formData.postalCode1.trim()) {
      newErrors.postalCode1 = '郵便番号（前半）を入力してください';
    } else if (!/^\d{3}$/.test(formData.postalCode1.trim())) {
      newErrors.postalCode1 = '3桁の数字を入力してください';
    }
    if (!formData.postalCode2.trim()) {
      newErrors.postalCode2 = '郵便番号（後半）を入力してください';
    } else if (!/^\d{4}$/.test(formData.postalCode2.trim())) {
      newErrors.postalCode2 = '4桁の数字を入力してください';
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

  const handlePostalCode1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setFormData((prev) => ({ ...prev, postalCode1: value }));
    if (errors.postalCode1) {
      setErrors((prev) => ({ ...prev, postalCode1: undefined }));
    }
    // 3桁入力したら次のフィールドにフォーカス
    if (value.length === 3) {
      postalCode2Ref.current?.focus();
    }
  };

  const handlePostalCode2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, postalCode2: value }));
    if (errors.postalCode2) {
      setErrors((prev) => ({ ...prev, postalCode2: undefined }));
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
          postal_code: `${formData.postalCode1.trim()}-${formData.postalCode2.trim()}`,
          prefecture: formData.prefecture,
          city: formData.city.trim(),
          address_detail: formData.addressDetail.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || FACILITY_MESSAGES.ADD_FAILED);
      }

      // 成功表示
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/admin/facilities');
      }, UI_TIMEOUTS.SUCCESS_REDIRECT);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : FACILITY_MESSAGES.ADD_FAILED);
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

        <div className={styles.postalCodeSection}>
          <label className={styles.postalCodeLabel}>
            郵便番号<span className={styles.required}>*</span>
          </label>
          <div className={styles.postalCodeInputs}>
            <input
              type="text"
              id="postalCode1"
              name="postalCode1"
              className={`${styles.postalCodeInput} ${styles.postalCode1} ${errors.postalCode1 ? styles.inputError : ''}`}
              placeholder="123"
              value={formData.postalCode1}
              onChange={handlePostalCode1Change}
              maxLength={3}
              inputMode="numeric"
            />
            <span className={styles.postalCodeHyphen}>-</span>
            <input
              type="text"
              id="postalCode2"
              name="postalCode2"
              ref={postalCode2Ref}
              className={`${styles.postalCodeInput} ${styles.postalCode2} ${errors.postalCode2 ? styles.inputError : ''}`}
              placeholder="4567"
              value={formData.postalCode2}
              onChange={handlePostalCode2Change}
              maxLength={4}
              inputMode="numeric"
            />
          </div>
          {(errors.postalCode1 || errors.postalCode2) && (
            <p className={styles.postalCodeError}>{errors.postalCode1 || errors.postalCode2}</p>
          )}
        </div>

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
