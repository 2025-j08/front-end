import styles from './BasicInfoSection.module.scss';

type BasicInfoSectionProps = {
  facilityType: string;
  establishedYear: string;
  capacity: string;
  hasAnnex: boolean;
  annexDetail?: string;
  onHelpClick?: () => void;
};

/**
 * 施設詳細ページの基本情報グリッドセクション
 * 施設種類、設立年、定員、併設施設を表示
 */
export const BasicInfoSection = ({
  facilityType,
  establishedYear,
  capacity,
  hasAnnex,
  annexDetail,
  onHelpClick,
}: BasicInfoSectionProps) => {
  return (
    <section className={styles.basicInfoSection}>
      {/* 上段 3カラム */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.label}>施設の種類</span>
          <span className={styles.value}>{facilityType}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>設立年</span>
          <span className={styles.value}>{establishedYear}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>施設定員</span>
          <span className={styles.value}>{capacity}</span>
        </div>
      </div>

      {/* 下段 併設施設 */}
      <div className={styles.annexCard}>
        <div className={styles.annexStatus}>
          <span className={styles.label}>併設施設</span>
          <span className={styles.statusValue}>{hasAnnex ? 'あり' : 'なし'}</span>
        </div>
        {hasAnnex && annexDetail && <div className={styles.annexDetail}>{annexDetail}</div>}
      </div>

      <div className={styles.helpLink}>
        <button
          type="button"
          className={styles.helpButton}
          onClick={onHelpClick}
          aria-label="施設の種類についてのヘルプを表示"
        >
          ? 施設の種類について
        </button>
      </div>
    </section>
  );
};
