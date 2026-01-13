'use client';

import { useCallback } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { API_MESSAGES } from '@/const/messages';
import { logError } from '@/lib/clientLogger';
import { useFormState } from '@/lib/hooks/useFormState';
import { createClient } from '@/lib/supabase/client';

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
      const supabase = createClient();

      // クライアント側のSupabaseで直接ログイン
      // @supabase/ssrによりCookieも自動で設定され、onAuthStateChangeも発火する
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.userid.trim(),
        password: data.password,
      });

      if (error || !authData.user) {
        const message = error?.message ?? API_MESSAGES.LOGIN_FAILED;
        logError('ログインエラー', {
          component: 'useLoginForm',
          action: 'handleSubmit',
          error: message,
        });
        throw new Error(API_MESSAGES.LOGIN_FAILED);
      }

      // ログイン成功後はホーム画面へ遷移
      router.push('/');
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
