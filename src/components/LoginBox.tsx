import React from 'react';

import styles from './LoginBox.module.css';

export default function LoginBox() {
  return (
    <div className={styles.container}>
      <form className="w-full">
        <div className={styles.grid}>
          <label htmlFor="login-id" className={styles.label}>
            ID
          </label>
          <input
            id="login-id"
            name="id"
            type="text"
            placeholder="XXXXXXXX..."
            className={styles.input}
          />

          <label htmlFor="login-password" className={styles.label}>
            パスワード
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="XXXXXXXX..."
            className={styles.input}
          />
        </div>

        <div className={styles.buttonWrap}>
          <button type="submit" className={styles.button}>
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
