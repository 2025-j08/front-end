'use client';

/**
 * PasswordField コンポーネント
 * パスワード表示切り替え機能付き入力フィールド
 * MUI icons を局所化するため FormField から分離
 */
import { useState, type ChangeEvent } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import styles from './formField.module.scss';

interface PasswordFieldProps {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PasswordField = ({
  id,
  name,
  placeholder,
  required,
  value,
  autoComplete,
  minLength,
  maxLength,
  error,
  onChange,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.passwordWrapper}>
      <input
        type={showPassword ? 'text' : 'password'}
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
      <button
        type="button"
        className={styles.toggleButton}
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'パスワードを非表示にする' : 'パスワードを表示する'}
        aria-pressed={showPassword}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </button>
    </div>
  );
};
