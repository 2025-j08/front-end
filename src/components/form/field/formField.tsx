/**
 * FormField 共通コンポーネント
 * 認証フォーム共通の入力フィールド
 */
import type { ChangeEvent } from 'react';

import { PasswordField } from './PasswordField';
import styles from './formField.module.scss';

/**
 * FormFieldコンポーネントのProps
 */
export interface FormFieldProps {
  /** フィールドのラベル */
  label: string;
  /** inputのtype属性 */
  type?: string;
  /** フィールドのID */
  id: string;
  /** フィールドのname属性 */
  name: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 必須フィールドかどうか */
  required?: boolean;
  /** フィールドの値 */
  value?: string;
  /** autocomplete属性 */
  autoComplete?: string;
  /** textareaの行数 */
  rows?: number;
  /** textareaとして表示するか */
  isTextarea?: boolean;
  /** 最小文字数 */
  minLength?: number;
  /** 最大文字数 */
  maxLength?: number;
  /** エラーメッセージ */
  error?: string;
  /** 値変更時のハンドラ */
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormField = ({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  required,
  value,
  autoComplete,
  rows = 5,
  isTextarea = false,
  minLength,
  maxLength,
  error,
  onChange,
}: FormFieldProps) => {
  const isPasswordField = type === 'password';

  const renderInput = () => {
    if (isTextarea) {
      return (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          rows={rows}
          minLength={minLength}
          maxLength={maxLength}
          className={error ? styles.inputError : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={onChange}
        />
      );
    }

    if (isPasswordField) {
      return (
        <PasswordField
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          error={error}
          onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
        />
      );
    }

    return (
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        className={error ? styles.inputError : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={onChange}
      />
    );
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      {renderInput()}
      {error && (
        <p id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export { FormField };
