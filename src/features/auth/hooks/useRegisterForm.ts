'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import {
  validatePassword,
  validateFurigana,
  validateRequired,
  validatePasswordMatch,
  PASSWORD_REQUIREMENTS,
  getPasswordRequirementsText,
} from '@/lib/validation';
import { VALIDATION_MESSAGES, API_MESSAGES } from '@/const/messages';

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
  fullName?: string;
  furigana?: string;
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
  fullName: '',
  furigana: '',
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
      const fullNameValidation = validateRequired(formData.fullName, '氏名');
      if (!fullNameValidation.isValid) {
        newFieldErrors.fullName = fullNameValidation.error;
        hasError = true;
      }

      // フリガナのバリデーション（必須＋カタカナ）
      const furiganaRequiredValidation = validateRequired(formData.furigana, 'フリガナ');
      if (!furiganaRequiredValidation.isValid) {
        newFieldErrors.furigana = furiganaRequiredValidation.error;
        hasError = true;
      } else {
        const furiganaFormatValidation = validateFurigana(formData.furigana);
        if (!furiganaFormatValidation.isValid) {
          newFieldErrors.furigana = furiganaFormatValidation.error;
          hasError = true;
        }
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

        // 成功オーバーレイ表示後、ホーム画面に遷移
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (error) {
        console.error('登録エラー:', error);
        setErrorMessage(API_MESSAGES.REGISTRATION_FAILED);
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
  }, []);

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
    resetForm,
  };
};
