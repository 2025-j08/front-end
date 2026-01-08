'use client';

import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import { API_MESSAGES } from '@/const/messages';

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
        // TODO: 実際のログインAPI呼び出しを実装
        // セキュリティのため、パスワードはログに出力しない
        console.log('ログイン試行:', {
          userid: formData.userid,
          // password は意図的にログから除外
        });

        // ダミーの遅延（API呼び出しをシミュレート）
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 成功時の処理（実際にはリダイレクト等を行う）
        console.log('ログイン成功');
      } catch (error) {
        console.error('ログインエラー:', error);
        setErrorMessage(API_MESSAGES.LOGIN_FAILED);
      } finally {
        setIsLoading(false);
      }
    },
    [formData.userid],
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
