'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { LoadingOverlay, SuccessOverlay, FormField } from '@/components/form';
import { Button } from '@/components/ui/Button/Button';
import { FACILITY_MESSAGES } from '@/const/messages';
import { KINKI_PREFECTURES } from '@/const/searchConditions';
import type { KinkiPrefecture } from '@/types/facility';
import { UI_TIMEOUTS } from '@/const/ui';
import { usePostalCode } from '@/hooks/usePostalCode';
import { validatePostalCode } from '@/lib/validation';

import { FACILITY_ADMIN_ROUTES, FACILITY_FORM_VALIDATION } from '../constants';
import type { AddFacilityFormData, AddFacilityFormErrors } from '../types';
import styles from '../styles/AddFacilityForm.module.scss';

/**
 * 施設追加フォームコンポーネント
 */
export const AddFacilityForm: React.FC = () => {
  const router = useRouter();
  const postalCode2Ref = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<AddFacilityFormData>({
    name: '',
    corporation: '',
    postalCode1: '',
    postalCode2: '',
    prefecture: '大阪府',
    city: '',
    addressDetail: '',
  });
  const [errors, setErrors] = useState<AddFacilityFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    fetchAddress,
    isLoading: isPostalLoading,
    error: postalError,
    clearError: clearPostalError,
  } = usePostalCode();

  const handlePostalLookup = async () => {
    clearPostalError(); // 検索前に以前のフックエラーをクリア
    setErrors((prev) => ({
      ...prev,
      postalCode1: undefined,
      postalCode2: undefined,
    }));

    const fullPostalCode = `${formData.postalCode1}${formData.postalCode2}`;
    const address = await fetchAddress(fullPostalCode);

    if (address) {
      // 関西6府県に含まれているかチェック
      const isKinki = (KINKI_PREFECTURES as readonly string[]).includes(address.prefecture);

      if (!isKinki) {
        setErrors((prev) => ({
          ...prev,
          postalCode2: '関西6府県以外の住所は登録できません。',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        prefecture: address.prefecture as KinkiPrefecture,
        city: address.city,
        // 町域が「以下に掲載がない場合」などは空にする
        addressDetail: address.town === '以下に掲載がない場合' ? '' : address.town,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: AddFacilityFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = FACILITY_FORM_VALIDATION.NAME_REQUIRED;
    }
    if (!formData.corporation.trim()) {
      newErrors.corporation = FACILITY_FORM_VALIDATION.CORPORATION_REQUIRED;
    }
    if (!formData.postalCode1.trim()) {
      newErrors.postalCode1 = FACILITY_FORM_VALIDATION.POSTAL_CODE_FIRST_REQUIRED;
    } else if (!/^\d{3}$/.test(formData.postalCode1.trim())) {
      newErrors.postalCode1 = FACILITY_FORM_VALIDATION.POSTAL_CODE_FIRST_INVALID;
    }
    if (!formData.postalCode2.trim()) {
      newErrors.postalCode2 = FACILITY_FORM_VALIDATION.POSTAL_CODE_SECOND_REQUIRED;
    } else if (!/^\d{4}$/.test(formData.postalCode2.trim())) {
      newErrors.postalCode2 = FACILITY_FORM_VALIDATION.POSTAL_CODE_SECOND_INVALID;
    }
    if (!formData.city.trim()) {
      newErrors.city = FACILITY_FORM_VALIDATION.CITY_REQUIRED;
    }
    if (!formData.addressDetail.trim()) {
      newErrors.addressDetail = FACILITY_FORM_VALIDATION.ADDRESS_DETAIL_REQUIRED;
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
    if (errors[name as keyof AddFacilityFormErrors]) {
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
        router.push(FACILITY_ADMIN_ROUTES.LIST);
      }, UI_TIMEOUTS.SUCCESS_REDIRECT);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : FACILITY_MESSAGES.ADD_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(FACILITY_ADMIN_ROUTES.LIST);
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
            <button
              type="button"
              className={styles.postalCodeButton}
              onClick={handlePostalLookup}
              aria-label="住所を検索"
              disabled={
                isPostalLoading ||
                !validatePostalCode(formData.postalCode1 + formData.postalCode2).isValid
              }
            >
              住所検索
            </button>
          </div>
          {isPostalLoading && (
            <p className={styles.postalCodeInfo} role="status" aria-live="polite">
              住所を検索中...
            </p>
          )}
          {/* 
            エラー表示優先順位:
            1. 郵便番号1のバリデーションエラー（必須、桁数）
            2. 郵便番号2のバリデーションエラー（必須、桁数）
            3. API/ロジックエラー（住所が見つからない、関西以外など）
            
            ユーザーが順を追ってエラーを解消できるように、上記優先順位（左から右）で最初に見つかったエラーを表示します。
          */}
          {(() => {
            const displayedPostalError = errors.postalCode1 || errors.postalCode2 || postalError;
            return (
              displayedPostalError && (
                <p className={styles.postalCodeError}>{displayedPostalError}</p>
              )
            );
          })()}
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
          <Button variant="secondary" size="lg" onClick={handleCancel} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingLabel="追加中..."
          >
            追加する
          </Button>
        </div>
      </form>
    </div>
  );
};
