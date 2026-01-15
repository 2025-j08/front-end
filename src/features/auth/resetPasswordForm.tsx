'use client';

/**
 * ResetPasswordForm コンポーネント
 * パスワード再設定フォームです。
 * 新しいパスワードを設定します。
 */

import { LoadingOverlay, SuccessOverlay } from '@/components/form/overlay';
import { FormField, FormButton } from '@/components/form';
import { useResetPasswordForm } from '@/features/auth/hooks/useResetPasswordForm';
import { PASSWORD_RESET_MESSAGES } from '@/const/messages';

import styles from './resetPasswordForm.module.scss';

export const ResetPasswordForm = () => {
  const {
    formData,
    isLoading,
    isSuccess,
    isCheckingSession,
    isValidSession,
    errorMessage,
    fieldErrors,
    passwordMinLength,
    passwordRequirementsText,
    handleChange,
    handleSubmit,
  } = useResetPasswordForm();

  // セッション検証中はローディング表示
  if (isCheckingSession) {
    return (
      <div className={styles.container}>
        <LoadingOverlay isVisible={true} text="認証情報を確認中..." />
      </div>
    );
  }

  // セッションが無効な場合は何も表示しない（リダイレクト中）
  if (!isValidSession) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* ローディング中のオーバーレイ表示 */}
      <LoadingOverlay isVisible={isLoading} text="再設定中..." />

      {/* 成功時のオーバーレイ表示 */}
      <SuccessOverlay isVisible={isSuccess} text={PASSWORD_RESET_MESSAGES.RESET_SUCCESS} />

      <h1 className={styles.title}>新しいパスワードを設定</h1>

      <p className={styles.description}>新しいパスワードを入力してください。</p>

      {errorMessage && (
        <div className={styles.errorMessage} role="alert" aria-live="polite">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formArea}>
        <FormField
          label="新しいパスワード"
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
          label="新しいパスワード（確認）"
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

        <FormButton label="パスワードを再設定" isLoading={isLoading} loadingLabel="再設定中..." />
      </form>
    </div>
  );
};
