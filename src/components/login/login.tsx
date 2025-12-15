'use client';
import { useState } from 'react';

import styles from './login.module.scss';

export const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('ID:', id, 'パスワード:', password);
    // ここに実際のログイン処理を記述
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>ID</label>
          <input
            type="text"
            placeholder="xxxxxxxx....."
            value={id}
            onChange={(e) => setId(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>パスワード</label>
          <input
            type="password"
            placeholder="xxxxxxxx....."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="button" onClick={handleLogin} className={styles.button}>
          ログイン
        </button>
      </div>
    </div>
  );
};
