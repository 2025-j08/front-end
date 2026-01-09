'use client';

/**
 * RegisterForm コンポーネント
 * ユーザー初期登録フォームのメインコンポーネントです。
 * 氏名、パスワードの入力を受け付けます。
 */

import { LoadingOverlay, SuccessOverlay } from '@/components/form/overlay';
import { FormField, FormButton } from '@/components/form';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';

import styles from './registerForm.module.scss';

export const RegisterForm = () => {
  const {
    formData,
    isLoading,
    isSuccess,
    errorMessage,
    fieldErrors,
    passwordMinLength,
    passwordRequirementsText,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div className={styles.container}>
      {/* ローディング中のオーバーレイ表示 */}
      <LoadingOverlay isVisible={isLoading} text="登録中..." />

      {/* 成功時のオーバーレイ表示 */}
      <SuccessOverlay isVisible={isSuccess} text="登録が完了しました" />

      {/* ヘッダー部分 */}
      <div className={styles.header}>
        <h1 className={styles.title}>ユーザー初期登録画面</h1>
      </div>

      {/* エラーメッセージ表示 */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert" aria-live="polite">
          {errorMessage}
        </div>
      )}

      {/* フォーム本体 */}
      <div className={styles.formBody}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="氏名"
            type="text"
            id="fullName"
            name="fullName"
            placeholder="山田 太郎"
            autoComplete="name"
            required
            value={formData.fullName}
            onChange={handleChange}
            error={fieldErrors.fullName}
          />

          <FormField
            label="パスワード"
            type="password"
            id="password"
            name="password"
            placeholder="パスワードを入力"
            autoComplete="new-password"
            required
            minLength={passwordMinLength}
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
          />
          <p className={styles.passwordHint}>※ {passwordRequirementsText}</p>

          <FormField
            label="パスワード（確認）"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="パスワードを再入力"
            autoComplete="new-password"
            required
            minLength={passwordMinLength}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
          />

          {/* 登録ボタン */}
          <FormButton label="登録" isLoading={isLoading} loadingLabel="登録中..." />
        </form>
      </div>
    </div>
  );
};
