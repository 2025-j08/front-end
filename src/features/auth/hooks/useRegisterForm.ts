'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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
}

/**
 * useRegisterForm カスタムフック
 * 初期登録フォームの状態管理と送信処理を提供します。
 */
export const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    furigana: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: 実際の登録API呼び出しを実装
      console.log('登録データ:', formData);

      // ダミーの遅延（API呼び出しをシミュレート）
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
      alert('登録が完了しました');
    } catch (error) {
      console.error('登録エラー:', error);
      alert('登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
