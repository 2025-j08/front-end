import { StaffInfo } from '@/types/facility';

import styles from './TabContent.module.scss';

type StaffTabProps = {
  staffInfo: StaffInfo;
};

export const StaffTab = ({ staffInfo }: StaffTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <p className={styles.simpleText} style={{ marginBottom: '24px' }}>
          {staffInfo.message}
        </p>

        <div className={styles.staffGrid}>
          {staffInfo.staffDetails.map((staff, index) => (
            <div key={index} className={styles.staffCard}>
              <span className={styles.role}>{staff.role}</span>
              <p className={styles.description}>{staff.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
