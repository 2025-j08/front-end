'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

import { buildFacilitiesListUrl } from '@/lib/search-params';

import styles from './SearchInput.module.scss';

/**
 * SearchInput コンポーネント
 *
 * 施設をキーワードで検索するための入力パネルを提供します。
 * 条件検索パネルと同様のデザイン（水色枠・バッジ）で構成されています。
 *
 * @returns {JSX.Element} 検索キーワード入力パネルを含むJSX要素
 */
export const SearchInput = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return;
    }
    router.push(buildFacilitiesListUrl({ keyword: trimmedKeyword }));
  };

  return (
    <div className={styles.container}>
      {/* 左上のバッジ */}
      <div className={styles.keywordBadge}>キーワードで探す</div>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="キーワード検索…"
            className={styles.input}
            aria-label="施設キーワード検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className={styles.submitButton} aria-label="キーワードで検索">
            <span>検索</span>
            <SearchIcon className={styles.icon} />
          </button>
        </div>
      </form>
    </div>
  );
};
