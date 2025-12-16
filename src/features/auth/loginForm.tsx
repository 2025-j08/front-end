'use client';

/**
 * LoginForm コンポーネント
 * ログインフォームのメインページです。
 * ロジックはuseLoginFormフックに分離
 */
import { FormField, FormButton, LoadingOverlay } from '@/components/form';

import styles from './loginForm.module.scss';
import { useLoginForm } from './hooks/useLoginForm';

export const LoginForm = () => {
  const { isLoading, handleSubmit } = useLoginForm();

  return (
    <div className={styles['login-form-container']}>
      <LoadingOverlay isVisible={isLoading} text="ログイン中..." />

      <h2 className={styles['form-title']}>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <FormField
          label="ID"
          type="text"
          id="userid"
          name="userid"
          placeholder="example_ID"
          autoComplete="username"
          required
        />

        <FormField
          label="パスワード"
          type="password"
          id="password"
          name="password"
          placeholder="パスワード"
          autoComplete="current-password"
          required
        />

        <FormButton label="ログイン" isLoading={isLoading} />
      </form>
    </div>
  );
};
