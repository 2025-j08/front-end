import styles from './BasicInfoSection.module.scss';

type BasicInfoSectionProps = {
  dormitoryType?: '大舎' | '中舎' | '小舎' | 'グループホーム' | '地域小規模';
  establishedYear?: string;
};

/**
 * 施設詳細ページの基本情報セクション
 * 舎の区分を表示
 */
export const BasicInfoSection = ({ dormitoryType, establishedYear }: BasicInfoSectionProps) => {
  return (
    <section className={styles.basicInfoSection}>
      <div className={styles.gridContainer}>
        <div className={styles.infoCard}>
          <span className={styles.label}>設立年</span>
          <span className={styles.value}>{establishedYear || '-'}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>舎の種別</span>
          <span className={styles.value}>{dormitoryType || '-'}</span>
        </div>
      </div>
    </section>
  );
};
