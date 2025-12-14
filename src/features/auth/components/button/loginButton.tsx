import styles from './loginButton.module.scss';

/**
 * LoginButton コンポーネント
 * ログインフォーム用の送信ボタン
 */
interface LoginButtonProps {
  label?: string;
}

const LoginButton = ({ label = 'ログイン' }: LoginButtonProps) => {
  return (
    <div className={styles.buttonContainer}>
      <button type="submit" className={styles.loginButton}>
        {label}
      </button>
    </div>
  );
};

export { LoginButton };
