'use client';

/**
 * RegisterForm コンポーネント
 * ユーザー初期登録フォームのメインコンポーネントです。
 * 氏名、フリガナ、パスワードの入力を受け付けます。
 */

import { LoadingOverlay } from '@/components/form/overlay';
import { FormField } from '@/features/auth/components/formfield/formField';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';

import styles from './registerForm.module.scss';

export const RegisterForm = () => {
  const { formData, isLoading, handleChange, handleSubmit } = useRegisterForm();

  return (
    <div className={styles.container}>
      {/* ローディング中のオーバーレイ表示 */}
      <LoadingOverlay isVisible={isLoading} text="登録中..." />

      {/* ヘッダー部分 */}
      <div className={styles.header}>
        <h1 className={styles.title}>ユーザー初期登録画面</h1>
      </div>

      {/* フォーム本体 */}
      <div className={styles.formBody}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="氏名"
            type="text"
            id="fullName"
            name="fullName"
            placeholder="xxxxxxxx...."
            autoComplete="name"
            required
            value={formData.fullName}
            onChange={handleChange}
          />

          <FormField
            label="フリガナ"
            type="text"
            id="furigana"
            name="furigana"
            placeholder="xxxxxxxx...."
            autoComplete="off"
            required
            value={formData.furigana}
            onChange={handleChange}
          />

          <FormField
            label="パスワード"
            type="password"
            id="password"
            name="password"
            placeholder="xxxxxxxx....."
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          {/* 登録ボタン */}
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.registerButton} disabled={isLoading}>
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
