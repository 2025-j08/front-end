import { OtherInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

type OtherTabProps = {
  otherInfo: OtherInfo;
};

export const OtherTab = ({ otherInfo }: OtherTabProps) => {
  // 文字列の場合は後方互換性のため対応
  const isString = typeof otherInfo === 'string';

  if (isString) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <TabSection content={otherInfo} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        {otherInfo.title && <TabSection title={otherInfo.title} content={otherInfo.description} />}

        <TabSection title="他施設とのネットワークや共同プロジェクト" content={otherInfo.networks} />

        <TabSection title="今後の展望や課題" content={otherInfo.futureOutlook} />

        <TabSection title="自由記述" content={otherInfo.freeText} />
      </div>
    </div>
  );
};
