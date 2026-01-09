import { AdvancedInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

type AdvancedTabProps = {
  advancedInfo: AdvancedInfo;
};

export const AdvancedTab = ({ advancedInfo }: AdvancedTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection
          title={advancedInfo.title || '多機能化への取り組み'}
          content={advancedInfo.description}
        />

        <TabSection title="経緯と背景" content={advancedInfo.background} />

        <TabSection title="取り組みにあたっての苦労や課題" content={advancedInfo.challenges} />

        <TabSection title="工夫や成功要因・乗り越えた方法" content={advancedInfo.solutions} />
      </div>
    </div>
  );
};
