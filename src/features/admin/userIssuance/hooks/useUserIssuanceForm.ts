import { useState, useEffect } from 'react';

// マジックナンバーを定数として定義
const SUBMIT_SIMULATION_DELAY = 2000;
const SUCCESS_MESSAGE_DURATION = 3000;

// メールアドレスの正規表現パターン（HTML5標準より厳密なチェック）
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

interface UserIssuanceFormData {
  email: string;
  facilityId: string;
}

// エラー情報の型定義
export interface FormErrors {
  email?: string;
  facilityId?: string;
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
 * @returns {FormErrors} return.errors 各フィールドのバリデーションエラーメッセージを含むオブジェクト
 * @returns {string | null} return.submitError フォーム送信時に発生したエラーメッセージ
 * @returns {boolean} return.isLoading フォーム送信処理中かどうかを示すフラグ
 * @returns {boolean} return.isSuccess フォーム送信が正常終了したかどうかを示すフラグ
 * @returns {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void} return.handleChange
 * 入力値変更時に呼び出すハンドラー。name 属性を元に対応するフィールドの値を更新します。
 * @returns {(name: keyof UserIssuanceFormData, value: string) => void} return.updateFormData
 * 任意のフィールドの値をプログラムから更新するハンドラー。
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

  const [errors, setErrors] = useState<FormErrors>({});

  // 送信エラーメッセージ管理用ステート
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 成功メッセージの表示
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, SUCCESS_MESSAGE_DURATION);
    }

    // クリーンアップ関数：コンポーネントのアンマウント時やisSuccessが変化した時にタイマーを解除
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess]);

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

    // 入力時にエラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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

    // プログラム更新時もエラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // バリデーション関数
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください。';
      isValid = false;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = '有効なメールアドレスの形式で入力してください。';
      isValid = false;
    }

    // 施設IDのバリデーション
    if (!formData.facilityId) {
      newErrors.facilityId = '施設を選択してください。';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 送信前にバリデーション実行
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      // API送信のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_SIMULATION_DELAY));

      setIsSuccess(true);
    } catch (error) {
      // エラー発生時の処理
      console.error('Submission failed:', error);
      setSubmitError('システムエラーが発生しました。しばらくしてから再度お試しください。');
    } finally {
      // ローディング解除をfinallyで行う
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    submitError,
    isLoading,
    isSuccess,
    handleChange,
    updateFormData,
    handleSubmit,
  };
};
