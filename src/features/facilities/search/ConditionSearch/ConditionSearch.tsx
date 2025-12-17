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
  return (
    <div className={styles.container}>
      <div className={styles.badge}>キーワードから探す</div>

      {/* 都道府県セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>都道府県</h3>
        <div className={styles.prefGrid}>
          {/* PREFECTURES 定数を使用 */}
          {PREFECTURES.map((pref) => (
            <button
              key={pref.name}
              className={`${styles.prefButton} ${styles[pref.id]}`}
              type="button"
              aria-label={`${pref.name}を選択`}
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
          {/* SEARCH_CONDITIONS 定数を使用 */}
          {SEARCH_CONDITIONS.map((cond) => (
            <button
              key={cond}
              className={styles.conditionButton}
              type="button"
              aria-label={`${cond}で絞り込み`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* 絞り込み検索ボタン */}
      <div className={styles.searchAction}>
        <button
          className={styles.submitButton}
          type="button"
          aria-label="選択した条件で絞り込み検索を実行"
        >
          絞り込み検索
          <SearchIcon className={styles.icon} />
        </button>
      </div>
    </div>
  );
};
