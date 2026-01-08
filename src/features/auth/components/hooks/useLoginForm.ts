import { useState } from 'react';

/**
 * ログインフォーム用データの型定義
 */
export interface LoginFormData {
  /** ユーザーID */
  userid: string;
  /** パスワード */
  password: string;
}

/**
 * useLoginForm
 * ログインフォームの状態管理とハンドラーを提供するカスタムフック
 *
 * @returns {Object} フォームの状態とハンドラー
 * @returns {LoginFormData} formData - フォーム入力値の現在の状態
 * @returns {boolean} isLoading - 送信中かどうか
 * @returns {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} handleChange - 入力フィールドの値が変更されたときのハンドラー
 * @returns {(event: React.FormEvent<HTMLFormElement>) => Promise<void>} handleSubmit - フォーム送信時のハンドラー
 */
export const useLoginForm = () => {
  /**
   * フォーム入力値の状態管理
   */
  const [formData, setFormData] = useState<LoginFormData>({
    userid: '',
    password: '',
  });

  /** 送信中状態 */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 入力フィールドの値が変更されたときの処理
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * フォーム送信時の処理
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // デモ用：2秒後にローディング終了
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // console.log('Login form submitted:', formData);
    setIsLoading(false);
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
