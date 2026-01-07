'use client';

/**
 * RegisterForm コンポーネント
 * ユーザー初期登録フォームのメインコンポーネントです。
 * 氏名、フリガナ、パスワードの入力を受け付けます。
 */

import { LoadingOverlay, SuccessOverlay } from '@/components/form/overlay';
import { FormField, FormButton } from '@/components/form';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';

import styles from './registerForm.module.scss';

export const RegisterForm = () => {
  const { formData, isLoading, isSuccess, errorMessage, handleChange, handleSubmit } =
    useRegisterForm();

  return (
    <div className={styles.container}>
      {/* ローディング中のオーバーレイ表示 */}
      <LoadingOverlay isVisible={isLoading} text="登録中..." />

      {/* 成功時のオーバーレイ表示 */}
      <SuccessOverlay isVisible={isSuccess} />

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
          />

          <FormField
            label="フリガナ"
            type="text"
            id="furigana"
            name="furigana"
            placeholder="ヤマダ タロウ"
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
            placeholder="パスワードを入力"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          {/* 登録ボタン */}
          <FormButton label="登録" isLoading={isLoading} loadingLabel="登録中..." />
        </form>
      </div>
    </div>
  );
};
