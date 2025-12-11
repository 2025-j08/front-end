import React from 'react';
import '../styles/textAreaField.scss';

/**
 * TextAreaField コンポーネント
 * 複数行入力が必要な場合（お問い合わせ内容など）に使用します。
 */
interface TextAreaFieldProps {
  /** フィールドのラベル名 */
  label: string;
  /** 一意の識別子 */
  id: string;
  /** フォーム送信時のキー名 */
  name: string;
  /** テキストエリアの行数（デフォルト: 5） */
  rows?: number;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 必須フィールドかどうか */
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  name,
  rows = 5,
  placeholder,
  required,
}) => {
  return (
    <div className="form-group textarea-group">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={name} rows={rows} placeholder={placeholder} required={required} />
    </div>
  );
};

export default TextAreaField;
