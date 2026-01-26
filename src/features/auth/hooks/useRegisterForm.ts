'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import type { RegisterRequest, RegisterResponse } from '@/types/api';
import {
  validatePassword,
  validateRequired,
  validatePasswordMatch,
  PASSWORD_REQUIREMENTS,
  getPasswordRequirementsText,
} from '@/lib/validation';
import { VALIDATION_MESSAGES, API_MESSAGES } from '@/const/messages';
import { API_ENDPOINTS } from '@/const/api';
import { logError } from '@/lib/logger';

/**
 * 初期登録フォームのデータ型
 */
interface RegisterFormData {
  /** 氏名 */
  name: string;
  /** パスワード */
  password: string;
  /** パスワード確認 */
  confirmPassword: string;
}

/**
 * フィールドエラーの型
 */
interface FieldErrors {
  name?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * useRegisterForm の戻り値型
 */
interface UseRegisterFormReturn {
  /** フォーム入力値の現在の状態 */
  formData: RegisterFormData;
  /** 送信中かどうか */
  isLoading: boolean;
  /** 登録成功かどうか */
  isSuccess: boolean;
  /** 成功時の施設名 */
  successFacilityName: string | null;
  /** 全体エラーメッセージ */
  errorMessage: string | null;
  /** 各フィールドのエラーメッセージ */
  fieldErrors: FieldErrors;
  /** パスワードの最小文字数 */
  passwordMinLength: number;
  /** パスワード要件の説明テキスト */
  passwordRequirementsText: string;
  /** 入力フィールドの値が変更されたときのハンドラー */
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** フォーム送信時のハンドラー */
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  /** フォームをリセットする */
  resetForm: () => void;
}

/**
 * 初期登録フォームの初期値
 */
const INITIAL_FORM_DATA: RegisterFormData = {
  name: '',
  password: '',
  confirmPassword: '',
};

/**
 * useRegisterForm
 * 初期登録フォームの状態管理と送信処理を提供するカスタムフック
 *
 * @returns フォームの状態とハンドラー
 */
export const useRegisterForm = (): UseRegisterFormReturn => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successFacilityName, setSuccessFacilityName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // 最新のformDataを参照するためのref（useCallback内で古い値を参照しないように）
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // パスワードフィールドの場合、リアルタイムバリデーション
    if (name === 'password') {
      const validation = validatePassword(value);
      // パスワード確認との一致もチェック（refから最新値を取得）
      const confirmPasswordValue = formDataRef.current.confirmPassword;
      const matchValidation = validatePasswordMatch(value, confirmPasswordValue);
      const confirmError =
        confirmPasswordValue && !matchValidation.isValid ? matchValidation.error : undefined;

      setFieldErrors((prev) => ({
        ...prev,
        password: validation.isValid ? undefined : validation.errors[0],
        confirmPassword: confirmError,
      }));
    }

    // パスワード確認フィールドの場合、一致チェック
    if (name === 'confirmPassword') {
      // refから最新のパスワード値を取得
      const matchValidation = validatePasswordMatch(formDataRef.current.password, value);
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: matchValidation.isValid ? undefined : matchValidation.error,
      }));
    }

    // 入力時に全体エラーをクリア
    setErrorMessage(null);
  }, []);

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // エラーを蓄積するオブジェクト
      const newFieldErrors: FieldErrors = {};
      let hasError = false;

      // 氏名の必須チェック
      const nameValidation = validateRequired(formData.name, '氏名');
      if (!nameValidation.isValid) {
        newFieldErrors.name = nameValidation.error;
        hasError = true;
      }

      // パスワードのバリデーション
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newFieldErrors.password = passwordValidation.errors.join('、');
        hasError = true;
      }

      // パスワード確認の一致チェック
      const passwordMatchValidation = validatePasswordMatch(
        formData.password,
        formData.confirmPassword,
      );
      if (!passwordMatchValidation.isValid) {
        newFieldErrors.confirmPassword = passwordMatchValidation.error;
        hasError = true;
      }

      // エラーがある場合は送信を中断
      if (hasError) {
        setFieldErrors((prev) => ({ ...prev, ...newFieldErrors }));
        setErrorMessage(VALIDATION_MESSAGES.INPUT_CHECK_REQUIRED);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        // リクエストペイロード作成
        const payload: RegisterRequest = {
          name: formData.name.trim(),
          password: formData.password,
        };

        // API呼び出し
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        // レスポンス解析
        const responseBody: RegisterResponse | null = await response.json().catch(() => null);

        // エラーハンドリング
        if (!response.ok || !responseBody?.success) {
          const apiError = responseBody?.error ?? '登録に失敗しました。もう一度お試しください。';
          throw new Error(apiError);
        }

        // ここで responseBody は RegisterResponseSuccess 型に絞り込まれる
        const responseData = responseBody;

        // 成功時の処理
        setIsSuccess(true);
        setSuccessFacilityName(responseData.facilityName ?? null);

        // 成功オーバーレイ表示後、指定されたURLまたはホーム画面に遷移
        const redirectUrl = responseData.redirectUrl ?? '/';
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1500);
      } catch (error) {
        logError('登録エラー', {
          component: 'useRegisterForm',
          action: 'handleSubmit',
          error: error instanceof Error ? error : String(error),
        });
        setErrorMessage(error instanceof Error ? error.message : API_MESSAGES.REGISTRATION_FAILED);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, router],
  );

  /**
   * フォームリセット関数
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFieldErrors({});
    setErrorMessage(null);
    setIsSuccess(false);
    setSuccessFacilityName(null);
  }, []);

  return {
    formData,
    isLoading,
    isSuccess,
    successFacilityName,
    errorMessage,
    fieldErrors,
    passwordMinLength: PASSWORD_REQUIREMENTS.MIN_LENGTH,
    passwordRequirementsText: getPasswordRequirementsText(),
    handleChange,
    handleSubmit,
    resetForm,
  };
};
