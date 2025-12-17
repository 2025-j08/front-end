'use client';

import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { PREFECTURES, SEARCH_CONDITIONS } from '@/const/searchConditions';

import styles from './ConditionSearch.module.scss';

/**
 * ConditionSearch コンポーネント
 *
 * 施設の絞り込み検索機能を提供するコンポーネントです。
 * ユーザーは以下の条件を選択して検索を実行できます：
 * 1. 都道府県（PREFECTURES定数に基づく：兵庫、京都、大阪など）
 * 2. その他の詳細条件（SEARCH_CONDITIONS定数に基づく：定員数、雇用形態、資格条件など）
 *
 * 選択された条件に基づいて、より具体的なニーズに合った施設を探すことを目的としています。
 *
 * @returns {JSX.Element} 条件検索パネルを表示するJSX要素
 */
export const ConditionSearch = () => {
  // 都道府県の選択状態（複数選択可）
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  // 絞り込み条件の選択状態（複数選択可）
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  /**
   * 都道府県ボタンクリック時のハンドラー
   * 選択状態をトグルします。
   */
  const handlePrefClick = (id: string) => {
    setSelectedPrefs((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  /**
   * 絞り込み条件ボタンクリック時のハンドラー
   * 選択状態をトグルします。
   */
  const handleConditionClick = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    );
  };

  /**
   * 検索実行ボタンクリック時のハンドラー
   * 選択された都道府県と条件を元に検索処理を行います。
   */
  const handleSearch = () => {
    console.log('絞り込み検索実行:', {
      prefectures: selectedPrefs,
      conditions: selectedConditions,
    });
    // TODO: ここに実際の検索処理（クエリパラメータの構築やAPI呼び出しなど）を実装
  };

  return (
    <div className={styles.container}>
      <div className={styles.badge}>キーワードから探す</div>

      {/* 都道府県セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>都道府県</h3>
        <div className={styles.prefGrid}>
          {/* PREFECTURES 定数を使用 */}
          {PREFECTURES.map((pref) => {
            const isSelected = selectedPrefs.includes(pref.id);
            return (
              <button
                key={pref.name}
                className={`${styles.prefButton} ${styles[pref.id]}`}
                type="button"
                aria-label={`${pref.name}を選択${isSelected ? '（選択中）' : ''}`}
                aria-pressed={isSelected}
                onClick={() => handlePrefClick(pref.id)}
                style={
                  isSelected
                    ? {
                        border: '3px solid #000',
                        transform: 'scale(0.98)',
                        boxShadow: 'none',
                      }
                    : undefined
                }
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
          {/* SEARCH_CONDITIONS 定数を使用 */}
          {SEARCH_CONDITIONS.map((cond) => {
            const isSelected = selectedConditions.includes(cond);
            return (
              <button
                key={cond}
                className={styles.conditionButton}
                type="button"
                aria-label={`${cond}で絞り込み${isSelected ? '（選択中）' : ''}`}
                aria-pressed={isSelected}
                onClick={() => handleConditionClick(cond)}
                style={
                  isSelected
                    ? {
                        backgroundColor: '#333',
                        color: '#fff',
                        borderColor: '#333',
                      }
                    : undefined
                }
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* 絞り込み検索ボタン */}
      <div className={styles.searchAction}>
        <button
          className={styles.submitButton}
          type="button"
          aria-label="選択した条件で絞り込み検索を実行"
          onClick={handleSearch}
        >
          絞り込み検索
          <SearchIcon className={styles.icon} />
        </button>
      </div>
    </div>
  );
};
