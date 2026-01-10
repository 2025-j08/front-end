import { useState, useEffect } from 'react';

import type { InviteUserResponse } from '@/types/api';
import { validateEmail } from '@/lib/validation';
import { API_ENDPOINTS } from '@/const/api';
import { logError } from '@/lib/clientLogger';

const SUCCESS_MESSAGE_DURATION = 3000;

interface UserIssuanceFormData {
  email: string;
  facilityId: string;
}

// エラー情報の型定義
export interface FormErrors {
  email?: string;
  facilityId?: string;
}

interface UseUserIssuanceFormOptions {
  /** フォーム送信成功時に呼び出されるコールバック関数 */
  onSuccess?: () => void;
}

/**
 * 管理画面のユーザー発行フォームの状態管理および送信処理を行うカスタムフックです。
 *
 * メールアドレスと施設IDの入力値をローカルステートで保持し、
 * 入力変更ハンドラー・フォーム送信ハンドラー・送信中/成功状態フラグを提供します。
 * `/api/admin/invite` への招待APIを呼び出し、成功時にフォームをリセットします。
 *
 * @param {UseUserIssuanceFormOptions} [options] - フックのオプション
 * @param {() => void} [options.onSuccess] - フォーム送信成功時に呼び出されるコールバック関数
 * @returns {object} ユーザー発行フォームの状態および操作用ハンドラーをまとめたオブジェクト
 * @returns {UserIssuanceFormData} return.formData フォームの入力値（メールアドレス・施設ID）
 * @returns {FormErrors} return.errors 各フィールドのバリデーションエラーメッセージを含むオブジェクト
 * @returns {string | null} return.submitError フォーム送信時に発生したエラーメッセージ
 * @returns {boolean} return.isLoading フォーム送信処理中かどうかを示すフラグ
 * @returns {boolean} return.isSuccess フォーム送信が正常終了したかどうかを示すフラグ
 * @returns {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void} return.handleChange
 * 入力値変更時に呼び出すハンドラー。name 属性を元に対応するフィールドの値を更新します。
 * @returns {(name: keyof UserIssuanceFormData, value: string) => void} return.updateFormData
 * 任意のフィールドの値をプログラムから更新するハンドラー。
 * @returns {(event: React.FormEvent<HTMLFormElement>) => Promise<void>} return.handleSubmit
 * フォーム送信時に呼び出す非同期ハンドラー。送信中フラグと成功フラグの制御を行います。
 */

export const useUserIssuanceForm = (options?: UseUserIssuanceFormOptions) => {
  const [formData, setFormData] = useState<UserIssuanceFormData>({
    email: '',
    facilityId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  // 送信エラーメッセージ管理用ステート
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 成功メッセージの表示
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, SUCCESS_MESSAGE_DURATION);
    }

    // クリーンアップ関数：コンポーネントのアンマウント時やisSuccessが変化した時にタイマーを解除
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess]);

  /**
   * 指定されたフィールドのエラーをクリアする共通関数
   */
  const clearError = (fieldName: keyof FormErrors) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  /**
   * 入力変更時のハンドラー
   * FormField(input/textarea) と select の両方に対応
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 入力時にエラーをクリア
    clearError(name as keyof FormErrors);
  };

  /**
   * プログラムから直接値を更新するためのハンドラー
   * 型安全性を保ちつつ、任意のフィールドを更新可能
   */
  const updateFormData = (name: keyof UserIssuanceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // プログラム更新時もエラーをクリア
    clearError(name as keyof FormErrors);
  };

  // バリデーション関数
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const emailValue = formData.email.trim();
    const facilityIdValue = formData.facilityId.trim();
    let isValid = true;

    const emailValidation = validateEmail(emailValue);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
      isValid = false;
    }

    // 施設IDのバリデーション
    if (!facilityIdValue) {
      newErrors.facilityId = '施設を選択してください。';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 送信前にバリデーション実行
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload = {
        email: formData.email.trim(),
        facilityId: Number(formData.facilityId),
      };

      const response = await fetch(API_ENDPOINTS.ADMIN.INVITE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseBody: InviteUserResponse | null = await response.json().catch(() => null);

      // APIからのレスポンスを確認（HTTPステータスコードとレスポンスボディの成功フラグで判定）
      if (!response.ok || !responseBody?.success) {
        const apiError =
          responseBody?.error ?? '招待に失敗しました。しばらくしてから再度お試しください。';
        throw new Error(apiError);
      }

      setIsSuccess(true);
      // 成功時にフォームをリセット
      setFormData({ email: '', facilityId: '' });
      setErrors({});
      // 成功時のコールバックを実行
      options?.onSuccess?.();
    } catch (error: unknown) {
      // エラー発生時の処理
      // unknown型を使用して型安全性を確保
      logError('Submission failed', {
        component: 'useUserIssuanceForm',
        action: 'handleSubmit',
        error: error instanceof Error ? error : String(error),
      });

      // エラーメッセージの型安全な取得
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'システムエラーが発生しました。しばらくしてから再度お試しください。';
      setSubmitError(errorMessage);
    } finally {
      // ローディング解除をfinallyで行う
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    submitError,
    isLoading,
    isSuccess,
    handleChange,
    updateFormData,
    handleSubmit,
  };
};
