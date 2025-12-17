import styles from './SearchInput.module.scss';

export const SearchInput = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="キーワードを入力..."
          className={styles.input}
          aria-label="施設キーワード検索"
        />
        <button type="button" aria-label="検索を実行" className={styles.searchButton}>
          検索
        </button>
      </div>
    </div>
  );
};
