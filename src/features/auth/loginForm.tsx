'use client';

/**
 * LoginForm コンポーネント
 * ログインフォームのメインページです。
 */
import { LoginField } from './components/formfield/loginField';
import { LoginButton } from './components/button/loginButton';
import styles from './loginForm.module.scss';

const LoginForm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Login form submitted');
  };

  return (
    <div className={styles['login-form-container']}>
      <h2 className={styles['form-title']}>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <LoginField
          label="ID"
          type="email"
          id="userid"
          name="userid"
          placeholder="example@email.com"
          required
        />

        <LoginField
          label="パスワード"
          type="password"
          id="password"
          name="password"
          placeholder="8文字以上の半角英数字"
          required
        />

        <LoginButton label="ログイン" />
      </form>
    </div>
  );
};

export default LoginForm;
