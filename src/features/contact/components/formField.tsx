import React from 'react';
import '../styles/formField.scss';

/**
 * FormField コンポーネント
 * テキスト入力とメールアドレス入力用のフォームフィールドを提供します。
 */
interface FormFieldProps {
  /** フィールドのラベル名 */
  label: string;
  /** input 要素の type 属性（デフォルト: 'text'） */
  type?: string;
  /** 一意の識別子 */
  id: string;
  /** フォーム送信時のキー名 */
  name: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 必須フィールドかどうか */
  required?: boolean;
}
const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  required,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} name={name} placeholder={placeholder} required={required} />
    </div>
  );
};

export default FormField;
