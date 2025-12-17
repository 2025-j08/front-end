import SearchIcon from '@mui/icons-material/Search';

import styles from './ConditionSearch.module.scss';

export const ConditionSearch = () => {
  // 都道府県データ
  // colorプロパティを廃止し、CSSクラスを適用するための識別子(id)を持たせます
  const prefectures = [
    { name: '兵庫県', id: 'hyogo' },
    { name: '京都府', id: 'kyoto' },
    { name: '大阪府', id: 'osaka' },
    { name: '和歌山県', id: 'wakayama' },
    { name: '滋賀県', id: 'shiga' },
    { name: '奈良県', id: 'nara' },
  ];

  // 絞り込み条件データ（モック）
  const conditions = [
    '定員数',
    '現在の生徒数',
    '教員の定員数',
    '教員の人数',
    '少人数制',
    'グループ制',
    '給料',
    '雇用形態',
    '資格条件',
  ];

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
              // styles.prefButton と 各都道府県のクラス(styles[pref.id]) を結合
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
          {/* index ではなく cond (値) を key に使用 */}
          {conditions.map((cond) => (
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
