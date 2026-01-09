import { PhilosophyInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

type PhilosophyTabProps = {
  philosophyInfo: PhilosophyInfo;
};

export const PhilosophyTab = ({ philosophyInfo }: PhilosophyTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection title={philosophyInfo.title} content={philosophyInfo.description} />
      </div>
    </div>
  );
};
