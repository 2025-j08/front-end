'use client';

/**
 * ForgotPasswordForm コンポーネント
 * パスワードリセット申請フォームです。
 * メールアドレスを入力してリセットメールを送信します。
 */
import Link from 'next/link';

import { LoadingOverlay, SuccessOverlay } from '@/components/form/overlay';
import { FormField, FormButton } from '@/components/form';
import { useForgotPasswordForm } from '@/features/auth/hooks/useForgotPasswordForm';
import { PASSWORD_RESET_MESSAGES } from '@/const/messages';

import styles from './forgotPasswordForm.module.scss';

export const ForgotPasswordForm = () => {
  const { formData, isLoading, isSuccess, errorMessage, emailError, handleChange, handleSubmit } =
    useForgotPasswordForm();

  return (
    <div className={styles.container}>
      {/* パンくずリスト */}
      <div className={styles.breadcrumb}>
        <Link href="/">ホーム</Link> &gt; <Link href="/features/auth">ログイン</Link> &gt;{' '}
        <span>パスワード再設定</span>
      </div>

      {/* ローディング中のオーバーレイ表示 */}
      <LoadingOverlay isVisible={isLoading} text="送信中..." />

      {/* 成功時のオーバーレイ表示 */}
      <SuccessOverlay isVisible={isSuccess} text={PASSWORD_RESET_MESSAGES.EMAIL_SENT} />

      <h1 className={styles.title}>パスワード再設定</h1>

      <p className={styles.description}>
        ご登録のメールアドレスを入力してください。
        <br />
        パスワード再設定用のリンクをメールでお送りします。
      </p>

      {errorMessage && (
        <div className={styles.errorMessage} role="alert" aria-live="polite">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formArea}>
        <FormField
          label="メールアドレス"
          type="email"
          id="email"
          name="email"
          placeholder="example@example.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={emailError}
        />

        <FormButton label="送信" isLoading={isLoading} loadingLabel="送信中..." />
      </form>

      <div className={styles.backLink}>
        <Link href="/features/auth">ログイン画面に戻る</Link>
      </div>
    </div>
  );
};
