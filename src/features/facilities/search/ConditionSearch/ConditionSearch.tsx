import React from 'react';
import SearchIcon from '@mui/icons-material/Search'; // 要MUIアイコン

import styles from './ConditionSearch.module.scss';

export const ConditionSearch = () => {
  // 都道府県データ（モック）
  const prefectures = [
    { name: '兵庫県', color: '#ff3333' },
    { name: '京都府', color: '#66cccc' },
    { name: '大阪府', color: '#ffcc33' },
    { name: '和歌山県', color: '#33ccff' },
    { name: '滋賀県', color: '#99cc33' },
    { name: '奈良県', color: '#663399', textColor: '#fff' },
  ];

  // 絞り込み条件データ（モック）
  const conditions = Array(8).fill('xxxxx....');

  return (
    <div className={styles.container}>
      <div className={styles.badge}>キーワードから探す</div>

      {/* 都道府県セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>都道府県</h3>
        <div className={styles.prefGrid}>
          {prefectures.map((pref) => (
            <button
              key={pref.name}
              className={styles.prefButton}
              style={{ backgroundColor: pref.color, color: pref.textColor || '#fff' }}
            >
              {pref.name}
            </button>
          ))}
        </div>
      </div>

      {/* 絞り込み条件セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>絞り込み条件</h3>
        <div className={styles.conditionGrid}>
          {conditions.map((cond, index) => (
            <button key={index} className={styles.conditionButton}>
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* 絞り込み検索ボタン */}
      <div className={styles.searchAction}>
        <button className={styles.submitButton}>
          絞り込み検索
          <SearchIcon className={styles.icon} />
        </button>
      </div>
    </div>
  );
};
