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
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 入力時にエラーをクリア
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    } catch (error) {
      console.error('登録エラー:', error);
      setErrorMessage('登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isSuccess,
    errorMessage,
    handleChange,
    handleSubmit,
  };
};
