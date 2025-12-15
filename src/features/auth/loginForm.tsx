'use client';

import { useState } from 'react';

/**
 * LoginForm コンポーネント
 * ログインフォームのメインページです。
 * 共通コンポーネントを使用したリファクタリング版
 */
import { FormField, FormButton, LoadingOverlay } from '@/components/form';

import styles from './loginForm.module.scss';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // デモ用：2秒後にローディング終了
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Login form submitted');
    setIsLoading(false);
  };

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

export default LoginForm;
