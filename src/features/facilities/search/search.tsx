'use client';

import dynamic from 'next/dynamic';

import { SearchInput } from './SearchInput/SearchInput';
import { ConditionSearch } from './ConditionSearch/ConditionSearch';
import styles from './search.module.scss';

// MapSearchを動的インポートに変更し、SSRを無効化
// MapSearchは名前付きエクスポートされているため、.then(mod => mod.MapSearch) で取得
const MapSearch = dynamic(() => import('./MapSearch/MapSearch').then((mod) => mod.MapSearch), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '400px',
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="地図を読み込んでいます"
    >
      地図を読み込み中...
    </div>
  ),
});

/**
 * Search コンポーネント
 *
 * 施設検索機能のメインページとなるコンポーネントです。
 * 以下の3つの検索方法を統合して提供し、ユーザーが多角的に施設を探せるようにします。
 *
 * 1. キーワード検索 (SearchInput): フリーワードによる検索
 * 2. 条件絞り込み検索 (ConditionSearch): 都道府県や特徴（定員数、雇用形態など）によるフィルタリング
 * 3. 地図検索 (MapSearch): 地図上の位置情報に基づいた検索
 *
 * MapSearchコンポーネントに関しては、ブラウザ固有のAPI（Leaflet）を使用するため、
 * next/dynamic を使用してサーバーサイドレンダリング（SSR）を無効化し、
 * クライアントサイドでのみロードされるように制御しています。
 *
 * @returns {JSX.Element} 検索機能全体を含むJSX要素
 */
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
