'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return;
    }
    const searchParams = new URLSearchParams();
    searchParams.set('keyword', trimmedKeyword);
    router.push(`/facilities?${searchParams.toString()}`);
  };

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
