import { EducationInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

type EducationTabProps = {
  educationInfo: EducationInfo;
};

export const EducationTab = ({ educationInfo }: EducationTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection
          title="進学率と支援体制"
          content={educationInfo.graduationRate || educationInfo.policy}
        />

        <TabSection title="学習支援の工夫や外部連携" content={educationInfo.learningSupport} />

        <TabSection
          title="特化した進路支援内容"
          content={educationInfo.careerSupport || educationInfo.afterCare}
        />
      </div>
    </div>
  );
};
