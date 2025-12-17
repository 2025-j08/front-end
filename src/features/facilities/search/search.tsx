'use client';

import dynamic from 'next/dynamic';

import { SearchInput } from './SearchInput/SearchInput';
import { ConditionSearch } from './ConditionSearch/ConditionSearch';
import styles from './search.module.scss';

const MapSearch = dynamic(() => import('./MapSearch/MapSearch').then((mod) => mod.MapSearch), {
  ssr: false,
  loading: () => <div style={{ height: '400px', background: '#f0f0f0' }}>地図を読み込み中...</div>,
});

export const Search = () => {
  return (
    <div className={styles.pageContainer}>
      {/* 1. キーワード入力エリア */}
      <section className={styles.searchSection}>
        <SearchInput />
      </section>

      {/* 2 & 3. 検索パネルエリア（2カラム） */}
      <section className={styles.panelSection}>
        <div className={styles.panelGrid}>
          <div className={styles.panelItem}>
            <ConditionSearch />
          </div>
          <div className={styles.panelItem}>
            <MapSearch />
          </div>
        </div>
      </section>
    </div>
  );
};
