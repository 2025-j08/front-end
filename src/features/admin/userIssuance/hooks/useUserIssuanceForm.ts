import { useState } from 'react';

// マジックナンバーを定数として定義
const SUBMIT_SIMULATION_DELAY = 2000;
const SUCCESS_MESSAGE_DURATION = 3000;

interface UserIssuanceFormData {
  email: string;
  facilityId: string;
}

/**
 * 管理画面のユーザー発行フォームの状態管理および送信処理を行うカスタムフックです。
 *
 * メールアドレスと施設IDの入力値をローカルステートで保持し、
 * 入力変更ハンドラー・フォーム送信ハンドラー・送信中/成功状態フラグを提供します。
 * 実際のAPI連携は行わず、現在はタイマーによる送信処理のシミュレーションを行います。
 *
 * @returns {object} ユーザー発行フォームの状態および操作用ハンドラーをまとめたオブジェクト
 * @returns {UserIssuanceFormData} return.formData フォームの入力値（メールアドレス・施設ID）
 * @returns {boolean} return.isLoading フォーム送信処理中かどうかを示すフラグ
 * @returns {boolean} return.isSuccess フォーム送信が正常終了したかどうかを示すフラグ
 * @returns {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void} return.handleChange
 * 入力値変更時に呼び出すハンドラー。name 属性を元に対応するフィールドの値を更新します。
 * @returns {(event: React.FormEvent<HTMLFormElement>) => Promise<void>} return.handleSubmit
 * フォーム送信時に呼び出す非同期ハンドラー。送信中フラグと成功フラグの制御を行います。
 */

export const useUserIssuanceForm = () => {
  const [formData, setFormData] = useState<UserIssuanceFormData>({
    email: '',
    facilityId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * 入力変更時のハンドラー
   * FormField(input/textarea) と select の両方に対応
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * プログラムから直接値を更新するためのハンドラー
   * 型安全性を保ちつつ、任意のフィールドを更新可能
   */
  const updateFormData = (name: keyof UserIssuanceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // API送信のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_SIMULATION_DELAY));

    setIsLoading(false);
    setIsSuccess(true);

    setTimeout(() => setIsSuccess(false), SUCCESS_MESSAGE_DURATION);
  };

  return {
    formData,
    isLoading,
    isSuccess,
    handleChange,
    updateFormData,
    handleSubmit,
  };
};
