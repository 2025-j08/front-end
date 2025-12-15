/**
 * FormField 共通コンポーネント
 * auth/contact共通の入力フィールド
 */
import type { ChangeEvent } from 'react';

import styles from './formField.module.scss';

interface FormFieldProps {
  label: string;
  type?: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  autoComplete?: string;
  rows?: number;
  isTextarea?: boolean;
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
  onChange,
}: FormFieldProps) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          rows={rows}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export { FormField };
