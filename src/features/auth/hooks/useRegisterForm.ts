'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import {
  validatePassword,
  validateFurigana,
  PASSWORD_REQUIREMENTS,
  getPasswordRequirementsText,
} from '@/lib/validation';

/**
 * 初期登録フォームのデータ型
 */
interface RegisterFormData {
  /** 氏名 */
  fullName: string;
  /** フリガナ */
  furigana: string;
  /** パスワード */
  password: string;
  /** パスワード確認 */
  confirmPassword: string;
}

/**
 * フィールドエラーの型
 */
interface FieldErrors {
  furigana?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * useRegisterForm
 * 初期登録フォームの状態管理と送信処理を提供するカスタムフック
 *
 * @returns {Object} フォームの状態とハンドラー
 * @returns {RegisterFormData} formData - フォーム入力値の現在の状態
 * @returns {boolean} isLoading - 送信中かどうか
 * @returns {boolean} isSuccess - 登録成功かどうか
 * @returns {string | null} errorMessage - 全体エラーメッセージ
 * @returns {FieldErrors} fieldErrors - 各フィールドのエラーメッセージ
 * @returns {number} passwordMinLength - パスワードの最小文字数
 * @returns {string} passwordRequirementsText - パスワード要件の説明テキスト
 * @returns {(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} handleChange - 入力フィールドの値が変更されたときのハンドラー
 * @returns {(e: FormEvent<HTMLFormElement>) => Promise<void>} handleSubmit - フォーム送信時のハンドラー
 */
export const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    furigana: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // フリガナフィールドの場合、カタカナバリデーション
    if (name === 'furigana') {
      const validation = validateFurigana(value);
      setFieldErrors((prev) => ({
        ...prev,
        furigana: validation.error,
      }));
    }

    // パスワードフィールドの場合、リアルタイムバリデーション
    if (name === 'password') {
      const validation = validatePassword(value);
      setFieldErrors((prev) => {
        // パスワード確認との一致もチェック
        const confirmError =
          formData.confirmPassword && value !== formData.confirmPassword
            ? 'パスワードが一致しません'
            : undefined;
        return {
          ...prev,
          password: validation.isValid ? undefined : validation.errors[0],
          confirmPassword: confirmError,
        };
      });
    }

    // パスワード確認フィールドの場合、一致チェック
    if (name === 'confirmPassword') {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.password ? 'パスワードが一致しません' : undefined,
      }));
    }

    // 入力時に全体エラーをクリア
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // フリガナのバリデーション
    const furiganaValidation = validateFurigana(formData.furigana);
    if (!furiganaValidation.isValid) {
      setFieldErrors((prev) => ({ ...prev, furigana: furiganaValidation.error }));
      setErrorMessage('入力内容を確認してください');
      return;
    }

    // 送信前にパスワードのバリデーションを実行
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setFieldErrors({ password: passwordValidation.errors.join('、') });
      setErrorMessage('入力内容を確認してください');
      return;
    }

    // パスワード確認の一致チェック
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'パスワードが一致しません' });
      setErrorMessage('パスワードが一致しません');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: 実際の登録API呼び出しを実装
      // セキュリティのため、パスワードはログに出力しない
      console.log('登録データ:', {
        fullName: formData.fullName,
        furigana: formData.furigana,
        // password は意図的にログから除外
      });

      // ダミーの遅延（API呼び出しをシミュレート）
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
      setIsSuccess(true);
    } catch (error) {
      console.error('登録エラー:', error);
      setErrorMessage('登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isSuccess,
    errorMessage,
    fieldErrors,
    passwordMinLength: PASSWORD_REQUIREMENTS.MIN_LENGTH,
    passwordRequirementsText: getPasswordRequirementsText(),
    handleChange,
    handleSubmit,
  };
};
