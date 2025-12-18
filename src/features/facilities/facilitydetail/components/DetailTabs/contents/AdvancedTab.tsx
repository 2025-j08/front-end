import { AdvancedInfo } from '@/types/facility';

import styles from './TabContent.module.scss';

type AdvancedTabProps = {
  advancedInfo: AdvancedInfo;
};

export const AdvancedTab = ({ advancedInfo }: AdvancedTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <p className={styles.simpleText}>{advancedInfo.description}</p>
      </div>
    </div>
  );
};
