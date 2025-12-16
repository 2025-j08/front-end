// 施設検索ページ
import { SearchInput } from './SearchInput/SearchInput';
import { ConditionSearch } from './ConditionSearch/ConditionSearch';
import { MapSearch } from './MapSearch/MapSearch';
import styles from './search.module.scss';

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
