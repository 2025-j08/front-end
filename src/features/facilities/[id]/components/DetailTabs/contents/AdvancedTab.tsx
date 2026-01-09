import { AdvancedInfo } from '@/types/facility';

import { EditField } from './EditField';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type AdvancedTabProps = {
  advancedInfo: AdvancedInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const AdvancedTab = ({
  advancedInfo,
  isEditMode = false,
  onFieldChange,
}: AdvancedTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <EditField
            type="text"
            id="advancedTitle"
            label="タイトル"
            value={advancedInfo.title}
            onChange={(v) => onFieldChange?.('title', v)}
            placeholder="例: 多機能化への取り組み"
          />
          <EditField
            type="textarea"
            id="description"
            label="取り組み内容"
            value={advancedInfo.description}
            onChange={(v) => onFieldChange?.('description', v)}
            rows={4}
          />
          <EditField
            type="textarea"
            id="background"
            label="経緯と背景"
            value={advancedInfo.background}
            onChange={(v) => onFieldChange?.('background', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="challenges"
            label="苦労や課題"
            value={advancedInfo.challenges}
            onChange={(v) => onFieldChange?.('challenges', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="solutions"
            label="工夫や成功要因"
            value={advancedInfo.solutions}
            onChange={(v) => onFieldChange?.('solutions', v)}
            rows={3}
          />
        </div>
      </div>
    );
  }

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
