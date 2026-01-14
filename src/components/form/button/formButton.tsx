/**
 * FormButton 共通コンポーネント
 * 認証フォーム共通の送信ボタン
 */
import styles from './formButton.module.scss';

/**
 * FormButtonコンポーネントのProps
 */
export interface FormButtonProps {
  /** ボタンのラベルテキスト */
  label?: string;
  /** ローディング中のラベルテキスト */
  loadingLabel?: string;
  /** ローディング状態 */
  isLoading?: boolean;
  /** 無効化状態 */
  disabled?: boolean;
  /** ボタンのタイプ */
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
