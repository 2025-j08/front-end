'use client';

import { useCallback } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { API_MESSAGES } from '@/const/messages';
import { API_ENDPOINTS } from '@/const/api';
import { logError } from '@/lib/clientLogger';
import { useFormState } from '@/lib/hooks/useFormState';

/**
 * ログインフォームのデータ型
 */
interface LoginFormData extends Record<string, string> {
  /** ユーザーID */
  userid: string;
  /** パスワード */
  password: string;
}

/**
 * useLoginForm の戻り値型
 */
interface UseLoginFormReturn {
  /** フォーム入力値の現在の状態 */
  formData: LoginFormData;
  /** 送信中かどうか */
  isLoading: boolean;
  /** 全体エラーメッセージ */
  errorMessage: string | null;
  /** 入力フィールドの値が変更されたときのハンドラー */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** フォーム送信時のハンドラー */
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  /** フォームをリセットする */
  resetForm: () => void;
}

/**
 * ログインフォームの初期値
 */
const INITIAL_FORM_DATA: LoginFormData = {
  userid: '',
  password: '',
};

/**
 * useLoginForm
 * ログインフォームの状態管理と送信処理を提供するカスタムフック
 *
 * @returns フォームの状態とハンドラー
 */
export const useLoginForm = (): UseLoginFormReturn => {
  const router = useRouter();

  /**
   * ログイン送信処理
   */
  const handleLoginSubmit = useCallback(
    async (data: LoginFormData) => {
      const payload = {
        email: data.userid.trim(),
        password: data.password,
      };

      type SignInResponse = { success?: boolean; error?: string; role?: string | null };

      const response = await fetch(API_ENDPOINTS.AUTH.SIGNIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body: SignInResponse | null = await response.json().catch(() => null);

      if (!response.ok || body?.success !== true) {
        const message = body?.error ?? API_MESSAGES.LOGIN_FAILED;
        logError('ログインエラー', {
          component: 'useLoginForm',
          action: 'handleSubmit',
          error: message,
        });
        throw new Error(message);
      }

      // ロールに応じた遷移（管理者はユーザー発行へ）
      if (body?.role === 'admin') {
        router.push('/admin/user-issuance');
      } else {
        router.push('/');
      }
    },
    [router],
  );

  // ベースフォームhookを使用
  const baseForm = useFormState({
    initialData: INITIAL_FORM_DATA,
    onSubmit: handleLoginSubmit,
  });

  return {
    formData: baseForm.formData,
    isLoading: baseForm.isLoading,
    errorMessage: baseForm.error,
    handleChange: baseForm.handleChange,
    handleSubmit: baseForm.handleSubmit,
    resetForm: baseForm.resetForm,
  };
};
