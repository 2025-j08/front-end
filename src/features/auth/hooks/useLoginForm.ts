'use client';

import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { API_MESSAGES } from '@/const/messages';
import { logError } from '@/lib/clientLogger';

/**
 * ログインフォームのデータ型
 */
interface LoginFormData {
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
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 入力時にエラーをクリア
    setErrorMessage(null);
  }, []);

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsLoading(true);
      setErrorMessage(null);

      try {
        // 実API呼び出し
        const payload = {
          email: formData.userid.trim(),
          password: formData.password,
        };

        type SignInResponse = { success?: boolean; error?: string; role?: string | null };

        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const body: SignInResponse | null = await response.json().catch(() => null);

        if (!response.ok || body?.success !== true) {
          const message = body?.error ?? API_MESSAGES.LOGIN_FAILED;
          throw new Error(message);
        }

        // ロールに応じた遷移（管理者はユーザー発行へ）
        if (body?.role === 'admin') {
          router.push('/admin/user-issuance');
        } else {
          router.push('/');
        }
      } catch (error) {
        logError('ログインエラー', {
          component: 'useLoginForm',
          action: 'handleSubmit',
          error: error instanceof Error ? error : String(error),
        });
        const message = error instanceof Error ? error.message : API_MESSAGES.LOGIN_FAILED;
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    },
    [formData.userid, formData.password, router],
  );

  /**
   * フォームリセット関数
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrorMessage(null);
  }, []);

  return {
    formData,
    isLoading,
    errorMessage,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
