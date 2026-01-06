import { useState } from 'react';

/**
 * フォーム送信データの型定義
 */
interface FormData {
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
  /** 電話番号 */
  phone: string;
  /** 件名 */
  subject: string;
  /** お問い合わせ内容 */
  message: string;
}

/**
 * useContactForm
 * お問い合わせフォームの状態管理とハンドラーを提供するカスタムフック
 *
 * @returns {Object} フォームの状態とハンドラー
 * @returns {FormData} formData - フォーム入力値の現在の状態
 * @returns {boolean} isLoading - 送信中かどうか
 * @returns {boolean} isSuccess - 送信成功かどうか
 * @returns {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} handleChange - 入力フィールドの値が変更されたときのハンドラー
 * @returns {(event: React.FormEvent<HTMLFormElement>) => Promise<void>} handleSubmit - フォーム送信時のハンドラー
 */
export const useContactForm = () => {
  /**
   * フォーム入力値の状態管理
   * 初期値：すべて空文字列
   */
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  /** 送信中状態 */
  const [isLoading, setIsLoading] = useState(false);

  /** 送信成功状態 */
  const [isSuccess, setIsSuccess] = useState(false);

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

    // console.log('Form submitted:', formData);
    setIsLoading(false);
    setIsSuccess(true);

    // 3秒後に成功メッセージをリセット
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return {
    formData,
    isLoading,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};
