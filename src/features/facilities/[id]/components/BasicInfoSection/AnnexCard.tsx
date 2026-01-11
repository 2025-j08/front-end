import type { AnnexFacility } from '@/types/facility';

import styles from './BasicInfoSection.module.scss';

/** 併設施設カード（共通コンポーネント） */
type AnnexCardProps = {
  annexFacilities: AnnexFacility[] | undefined;
  annexText: string;
};

export const AnnexCard = ({ annexFacilities, annexText }: AnnexCardProps) => (
  <div className={`${styles.infoCard} ${styles.annexCard}`}>
    <div className={styles.annexHeader}>
      <span className={styles.label}>併設施設</span>
      <span className={styles.subStatus}>{annexFacilities?.length ? 'あり' : 'なし'}</span>
    </div>
    <div className={styles.annexContent}>
      <span className={styles.value}>{annexText}</span>
    </div>
  </div>
);
