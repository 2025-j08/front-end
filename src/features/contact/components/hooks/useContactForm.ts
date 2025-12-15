import { useState } from 'react';

/**
 * フォーム送信データの型定義
 */
interface FormData {
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
  /** お問い合わせ内容 */
  message: string;
}

/**
 * useContactForm
 * お問い合わせフォームの状態管理とハンドラーを提供するカスタムフック
 *
 * @returns {Object} フォームの状態とハンドラー
 * @returns {FormData} formData - フォーム入力値の現在の状態
 * @returns {Function} handleChange - 入力フィールドの値が変更されたときのハンドラー
 * @returns {Function} handleSubmit - フォーム送信時のハンドラー
 */
export const useContactForm = () => {
  /**
   * フォーム入力値の状態管理
   * 初期値：name, email, message すべて空文字列
   */
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  /**
   * 入力フィールドの値が変更されたときの処理
   * フォーム要素のnameとvalueを取得して、対応する状態を更新
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - 変更イベント
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
   * デフォルトの送信動作を防止し、フォームデータをコンソールに出力
   * 実際のAPI送信ロジックはここに実装予定
   *
   * @param {React.FormEvent<HTMLFormElement>} event - フォーム送信イベント
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Add form submission logic here (e.g., send data to API)
    console.log('Form submitted:', formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
