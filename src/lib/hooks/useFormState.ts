'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

/**
 * フォーム状態管理の基本オプション型
 */
export interface UseFormStateOptions<T> {
  /** フォームの初期値 */
  initialData: T;
  /** フォーム送信時の処理 */
  onSubmit: (data: T) => Promise<void>;
  /** フィールド変更時のバリデーション（オプション） */
  onFieldChange?: (name: keyof T, value: string, currentData: T) => void;
}

/**
 * フォーム状態管理の戻り値型
 */
export interface UseFormStateReturn<T> {
  /** フォーム入力値の現在の状態 */
  formData: T;
  /** 送信中かどうか */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 入力フィールドの値が変更されたときのハンドラー */
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  /** フォーム送信時のハンドラー */
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  /** フォームをリセットする */
  resetForm: () => void;
  /** エラーをクリアする */
  clearError: () => void;
  /** フォームデータを直接更新する */
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  /** ローディング状態を直接設定する */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  /** エラーを直接設定する */
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * useFormState
 * 汎用的なフォーム状態管理カスタムフック
 *
 * フォームの状態管理、入力処理、送信処理の共通ロジックを提供します。
 * 各フォームは、このhookをベースに独自のバリデーションやビジネスロジックを追加できます。
 *
 * @template T - フォームデータの型
 * @param options - フォーム設定オプション
 * @returns フォームの状態とハンドラー
 *
 * @example
 * ```typescript
 * const loginForm = useFormState({
 *   initialData: { email: '', password: '' },
 *   onSubmit: async (data) => {
 *     const response = await fetch('/api/login', {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     });
 *     if (!response.ok) throw new Error('Login failed');
 *   },
 * });
 * ```
 */
export function useFormState<T extends Record<string, any>>(
  options: UseFormStateOptions<T>,
): UseFormStateReturn<T> {
  const { initialData, onSubmit, onFieldChange } = options;

  const [formData, setFormData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 最新の formData を参照するための ref
  // useCallback内で古いクロージャを参照しないようにする
  const formDataRef = useRef<T>(formData);

  // formData が変更されるたびに ref を更新
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const newData = {
          ...prev,
          [name]: value,
        };

        // フィールド変更時のカスタムバリデーションを実行
        if (onFieldChange) {
          onFieldChange(name as keyof T, value, newData);
        }

        return newData;
      });

      // 入力時にエラーをクリア
      setError(null);
    },
    [onFieldChange],
  );

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsLoading(true);
      setError(null);

      try {
        // ref から最新の formData を取得して送信
        await onSubmit(formDataRef.current);
      } catch (err) {
        const message = err instanceof Error ? err.message : '送信に失敗しました';
        setError(message);
        throw err; // 呼び出し元でさらにエラーハンドリングが必要な場合のため
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit],
  );

  /**
   * フォームリセット関数
   */
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setError(null);
  }, [initialData]);

  /**
   * エラークリア関数
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    resetForm,
    clearError,
    setFormData,
    setIsLoading,
    setError,
  };
}
