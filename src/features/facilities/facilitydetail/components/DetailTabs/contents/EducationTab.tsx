import { EducationInfo } from '@/types/facility';

import styles from './TabContent.module.scss';

type EducationTabProps = {
  educationInfo: EducationInfo;
};

export const EducationTab = ({ educationInfo }: EducationTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <h3 className={styles.contentTitle}>方針</h3>
        <p className={styles.simpleText} style={{ marginBottom: '24px' }}>
          {educationInfo.policy}
        </p>

        <h3 className={styles.contentTitle}>アフターケア</h3>
        <p className={styles.simpleText}>{educationInfo.afterCare}</p>
      </div>
    </div>
  );
};
