import type { ChangeEvent } from 'react';

import styles from './loginField.module.scss';

/**
 * LoginField コンポーネント
 * ログインフォーム用の入力フィールド
 */
interface LoginFieldProps {
  label: string;
  type?: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LoginField = ({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  required,
  value,
  onChange,
}: LoginFieldProps) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export { LoginField };
