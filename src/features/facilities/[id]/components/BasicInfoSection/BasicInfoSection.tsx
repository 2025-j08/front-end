import styles from './BasicInfoSection.module.scss';

type BasicInfoSectionProps = {
  establishedYear?: string;
  dormitoryType?: '大舎' | '中舎' | '小舎';
};

/**
 * 施設詳細ページの基本情報グリッドセクション
 * 設立年、舎の区分を表示
 */
export const BasicInfoSection = ({ establishedYear, dormitoryType }: BasicInfoSectionProps) => {
  return (
    <section className={styles.basicInfoSection}>
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.label}>設立年</span>
          <span className={styles.value}>{establishedYear || '-'}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>舎の区分</span>
          <span className={styles.value}>{dormitoryType || '-'}</span>
        </div>
      </div>
    </section>
  );
};
