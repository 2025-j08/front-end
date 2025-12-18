import { StaffInfo } from '@/types/facility';

import styles from './TabContent.module.scss';

type StaffTabProps = {
  staffInfo: StaffInfo;
};

export const StaffTab = ({ staffInfo }: StaffTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <p className={`${styles.simpleText} ${styles.marginBottom24}`}>
          {staffInfo.message}
        </p>

        <div className={styles.staffGrid}>
          {staffInfo.staffDetails.map((staff, index) => (
            // roleとindexを組み合わせて再レンダリング時の安定性を向上
            <div key={`${staff.role}-${index}`} className={styles.staffCard}>
              <span className={styles.role}>{staff.role}</span>
              <p className={styles.description}>{staff.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
