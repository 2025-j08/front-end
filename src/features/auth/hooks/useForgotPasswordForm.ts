'use client';

import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import type { ForgotPasswordRequest } from '@/types/api';
import { validateEmail } from '@/lib/validation';
import { API_ENDPOINTS } from '@/const/api';
import { PASSWORD_RESET_MESSAGES } from '@/const/messages';
import { logError } from '@/lib/logger';

/**
 * パスワードリセット申請フォームのデータ型
 */
interface ForgotPasswordFormData {
  email: string;
}

/**
 * useForgotPasswordForm の戻り値型
 */
interface UseForgotPasswordFormReturn {
  /** フォーム入力値の現在の状態 */
  formData: ForgotPasswordFormData;
  /** 送信中かどうか */
  isLoading: boolean;
  /** 送信成功かどうか */
  isSuccess: boolean;
  /** エラーメッセージ */
  errorMessage: string | null;
  /** メールフィールドのエラー */
  emailError: string | undefined;
  /** 入力フィールドの値が変更されたときのハンドラー */
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** フォーム送信時のハンドラー */
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * フォームの初期値
 */
const INITIAL_FORM_DATA: ForgotPasswordFormData = {
  email: '',
};

/**
 * useForgotPasswordForm
 * パスワードリセット申請フォームの状態管理と送信処理を提供するカスタムフック
 */
export const useForgotPasswordForm = (): UseForgotPasswordFormReturn => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData({ email: value });

    // リアルタイムバリデーション
    if (value) {
      const validation = validateEmail(value);
      setEmailError(validation.isValid ? undefined : validation.error);
    } else {
      setEmailError(undefined);
    }

    // 入力時にエラーをクリア
    setErrorMessage(null);
  }, []);

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // バリデーション
      const validation = validateEmail(formData.email);
      if (!validation.isValid) {
        setEmailError(validation.error);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const payload: ForgotPasswordRequest = {
          email: formData.email.trim(),
        };

        const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        // APIは常に成功を返すが、念のためチェック
        if (!response.ok) {
          throw new Error('リクエストに失敗しました');
        }

        // 成功
        setIsSuccess(true);
      } catch (error) {
        logError('パスワードリセット申請エラー', {
          component: 'useForgotPasswordForm',
          action: 'handleSubmit',
          error: error instanceof Error ? error : String(error),
        });
        // エラーでも成功扱いにする（セキュリティ対策）
        setIsSuccess(true);
      } finally {
        setIsLoading(false);
      }
    },
    [formData.email],
  );

  return {
    formData,
    isLoading,
    isSuccess,
    errorMessage,
    emailError,
    handleChange,
    handleSubmit,
  };
};
