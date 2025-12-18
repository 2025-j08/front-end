'use client';

import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { PREFECTURES, SEARCH_CONDITIONS } from '@/const/searchConditions';

import styles from './ConditionSearch.module.scss';

export const ConditionSearch = () => {
  // 都道府県の選択状態
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);

  // 絞り込み条件の選択状態
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  // 都道府県クリック時のハンドラー
  const handlePrefectureClick = (prefId: string) => {
    setSelectedPrefectures((prev) =>
      prev.includes(prefId) ? prev.filter((id) => id !== prefId) : [...prev, prefId],
    );
  };

  // 絞り込み条件クリック時のハンドラー
  const handleConditionClick = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.badge}>条件で探す</div>

      {/* 都道府県セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>エリアから探す</h3>
        <div className={styles.prefGrid}>
          {PREFECTURES.map((pref) => {
            const isSelected = selectedPrefectures.includes(pref.id);
            return (
              <button
                key={pref.id}
                type="button"
                className={`${styles.prefButton} ${styles[pref.id]} ${isSelected ? styles.selected : ''}`}
                onClick={() => handlePrefectureClick(pref.id)}
                aria-label={`${pref.name}で絞り込み${isSelected ? '（選択中）' : ''}`}
                aria-pressed={isSelected}
              >
                {pref.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 絞り込み条件セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>絞り込み条件</h3>
        <div className={styles.conditionGrid}>
          {SEARCH_CONDITIONS.map((cond) => {
            const isSelected = selectedConditions.includes(cond);
            return (
              <button
                key={cond}
                className={`${styles.conditionButton} ${isSelected ? styles.selected : ''}`}
                type="button"
                aria-label={`${cond}で絞り込み${isSelected ? '（選択中）' : ''}`}
                aria-pressed={isSelected}
                onClick={() => handleConditionClick(cond)}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* 検索ボタンエリア（必要であれば） */}
      <div className={styles.searchAction}>
        <button type="button" className={styles.submitButton}>
          <SearchIcon className={styles.icon} />
          <span>この条件で検索</span>
        </button>
      </div>
    </div>
  );
};
