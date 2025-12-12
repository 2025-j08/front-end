import styles from './submitbutton.module.scss';

/**
 * SubmitButton コンポーネント
 * フォーム送信用のボタンを提供します。
 */
interface SubmitButtonProps {
  /** ボタンに表示するテキスト（デフォルト: '送信'） */
  label?: string;
}

const SubmitButton = ({ label = '送信' }: SubmitButtonProps) => {
  return (
    <div className={styles.buttonContainer}>
      <button type="submit" className={styles.submitButton}>
        {label}
      </button>
    </div>
  );
};

export { SubmitButton };
