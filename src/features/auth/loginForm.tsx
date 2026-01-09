'use client';

/**
 * LoginForm コンポーネント
 * ログインフォームのメインページです。
 * FormField、SubmitButton を組み合わせて
 * ユーザーからのログイン入力を受け付けます。
 */
import Link from 'next/link';

import { LoadingOverlay } from '@/components/form/overlay';
import { FormField, FormButton } from '@/components/form';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

import styles from './loginForm.module.scss';

export const LoginForm = () => {
  const { formData, isLoading, errorMessage, handleChange, handleSubmit } = useLoginForm();

  return (
    <div className={styles.container}>
      {/* パンくずリスト */}
      <div className={styles.breadcrumb}>
        <Link href="/">ホーム</Link> &gt; <span>ログイン</span>
      </div>

      {/* ローディング中のオーバーレイ表示 */}
      <LoadingOverlay isVisible={isLoading} text="ログイン中..." />

      <h1 className={styles.title}>ログイン</h1>

      {errorMessage && (
        <div className={styles.errorMessage} role="alert" aria-live="polite">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formArea}>
        <FormField
          label="ID"
          type="text"
          id="userid"
          name="userid"
          placeholder="example_ID"
          autoComplete="username"
          required
          value={formData.userid}
          onChange={handleChange}
        />

        <FormField
          label="パスワード"
          type="password"
          id="password"
          name="password"
          placeholder="パスワード"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <FormButton label="ログイン" isLoading={isLoading} />
      </form>
    </div>
  );
};
