import styles from './submitButton.module.scss';

/**
 * SubmitButton コンポーネント
 * フォーム送信用のボタンを提供します。
 */
interface SubmitButtonProps {
  /** ボタンに表示するテキスト（デフォルト: '送信'） */
  label?: string;
  /** 無効化状態 */
  disabled?: boolean;
}

const SubmitButton = ({ label = '送信', disabled = false }: SubmitButtonProps) => {
  return (
    <div className={styles.buttonContainer}>
      <button type="submit" className={styles.submitButton} disabled={disabled}>
        {label}
      </button>
    </div>
  );
};

export { SubmitButton };
