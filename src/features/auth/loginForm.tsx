'use client';

/**
 * LoginForm コンポーネント
 * ログインフォームのメインページです。
 * FormField、SubmitButton を組み合わせて
 * ユーザーからのログイン入力を受け付けます。
 */
import Link from 'next/link';

import { LoadingOverlay } from '@/components/form/overlay';
import { SubmitButton } from '@/features/auth/components/button/submitButton';
import { FormField } from '@/features/auth/components/formfield/formField';
import { useLoginForm } from '@/features/auth/components/hooks/useLoginForm';

import styles from './loginForm.module.scss';

export const LoginForm = () => {
  const { formData, isLoading, handleChange, handleSubmit } = useLoginForm();

  return (
    <div className={styles.container}>
      {/* パンくずリスト */}
      <div className={styles.breadcrumb}>
        <Link href="/">ホーム</Link> &gt; <span>ログイン</span>
      </div>

      {/* ローディング中のオーバーレイ表示 */}
      <LoadingOverlay isVisible={isLoading} text="ログイン中..." />

      <h1 className={styles.title}>ログイン</h1>

      <form onSubmit={handleSubmit}>
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

        <SubmitButton label="ログイン" disabled={isLoading} />
      </form>
    </div>
  );
};
