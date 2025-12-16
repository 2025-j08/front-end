import React from 'react';

import styles from './SearchInput.module.scss';

export const SearchInput = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input type="text" placeholder="キーワードを入力..." className={styles.input} />
        <button className={styles.searchButton}>検索</button>
      </div>
    </div>
  );
};
