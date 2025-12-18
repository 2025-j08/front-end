/**
 * FormButton 共通コンポーネント
 * auth/contact共通の送信ボタン
 */
import styles from './formButton.module.scss';

interface FormButtonProps {
  label?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
}

const FormButton = ({
  label = '送信',
  loadingLabel = '処理中...',
  isLoading = false,
  disabled = false,
  type = 'submit',
}: FormButtonProps) => {
  return (
    <div className={styles.buttonContainer}>
      <button
        type={type}
        className={styles.formButton}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
      >
        <span className={styles.buttonContent}>
          {isLoading && <span className={styles.spinner} />}
          {isLoading ? loadingLabel : label}
        </span>
      </button>
    </div>
  );
};

export { FormButton };
