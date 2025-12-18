import { PhilosophyInfo } from '@/types/facility';

import styles from './TabContent.module.scss';

type PhilosophyTabProps = {
  philosophyInfo: PhilosophyInfo;
};

export const PhilosophyTab = ({ philosophyInfo }: PhilosophyTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <h3 className={styles.contentTitle}>{philosophyInfo.title}</h3>
        <p className={styles.simpleText}>{philosophyInfo.description}</p>
      </div>
    </div>
  );
};
