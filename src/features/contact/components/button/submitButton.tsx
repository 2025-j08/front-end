import React from 'react';
import './submitButton.scss';

/**
 * SubmitButton コンポーネント
 * フォーム送信用のボタンを提供します。
 */
interface SubmitButtonProps {
  /** ボタンに表示するテキスト（デフォルト: '送信'） */
  label?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label = '送信' }) => {
  return (
    <div className="button-container">
      <button type="submit" className="submit-button">
        {label}
      </button>
    </div>
  );
};

export default SubmitButton;
