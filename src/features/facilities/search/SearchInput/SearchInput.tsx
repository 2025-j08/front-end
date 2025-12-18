'use client';

import { useState } from 'react';

import styles from './SearchInput.module.scss';

/**
 * SearchInput コンポーネント
 *
 * 施設をキーワードで検索するための入力フィールドと検索ボタンを提供します。
 * ユーザーは施設名や住所の一部などを入力し、該当する施設を検索することができます。
 *
 * @returns {JSX.Element} 検索キーワード入力フォームを含むJSX要素
 */
export const SearchInput = () => {
  // 入力キーワードの状態管理
  const [keyword, setKeyword] = useState('');

  /**
   * 入力変更時のハンドラー
   * @param {React.ChangeEvent<HTMLInputElement>} e - 入力イベント
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    // 本番環境でのみ実行
    // console.log(`検索実行: ${keyword}`);
  };

  /**
   * Enterキー押下時にも検索を実行できるようにする
   * @param {React.KeyboardEvent<HTMLInputElement>} e - キーボードイベント
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="キーワードを入力..."
          className={styles.input}
          aria-label="施設キーワード検索"
          value={keyword}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          aria-label="検索を実行"
          className={styles.searchButton}
          onClick={handleSearch}
        >
          検索
        </button>
      </div>
    </div>
  );
};
