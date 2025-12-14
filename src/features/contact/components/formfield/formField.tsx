import type { ChangeEvent } from 'react';

import { BaseFieldProps, AccessibilityProps } from '../types/formTypes';
import styles from './formField.module.scss';

/**
 * FormField コンポーネント
 * テキスト入力とメールアドレス入力用のフォームフィールドを提供します。
 */
interface FormFieldProps extends BaseFieldProps, AccessibilityProps {
  /** input 要素の type 属性（デフォルト: 'text'） */
  type?: string;
  /** バリデーション用の正規表現パターン */
  pattern?: string;
  /** 値変更時のハンドラ */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
const FormField = ({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  required,
  maxLength,
  pattern,
  value,
  onChange,
  ariaDescribedBy,
  ariaInvalid,
}: FormFieldProps) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        value={value}
        onChange={onChange}
        aria-required={required}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      />
    </div>
  );
};

export { FormField };
