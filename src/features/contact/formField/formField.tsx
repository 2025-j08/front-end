import React from 'react';

import { BaseFieldProps } from '../types/formTypes';
import '../styles/formField.scss';

/**
 * FormField コンポーネント
 * テキスト入力とメールアドレス入力用のフォームフィールドを提供します。
 */
interface FormFieldProps extends BaseFieldProps {
  /** input 要素の type 属性（デフォルト: 'text'） */
  type?: string;
  /** バリデーション用の正規表現パターン */
  pattern?: string;
  /** 値変更時のハンドラ */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const FormField: React.FC<FormFieldProps> = ({
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
}) => {
  return (
    <div className="form-group">
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
      />
    </div>
  );
};

export default FormField;
