import React from 'react';

import { BaseFieldProps, AccessibilityProps } from '../types/formTypes';
import './textAreaField.scss';

/**
 * TextAreaField コンポーネント
 * 複数行入力が必要な場合（お問い合わせ内容など）に使用します。
 */
interface TextAreaFieldProps extends BaseFieldProps, AccessibilityProps {
  /** テキストエリアの行数（デフォルト: 5） */
  rows?: number;
  /** 入力の最小文字数 */
  minLength?: number;
  /** 値変更時のハンドラ */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField = ({
  label,
  id,
  name,
  rows = 5,
  placeholder,
  required,
  maxLength,
  minLength,
  ariaDescribedBy,
  ariaInvalid,
  value,
  onChange,
}: TextAreaFieldProps) => {
  return (
    <div className="form-group textarea-group">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        aria-required={required}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export { TextAreaField };
