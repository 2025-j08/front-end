import { AdvancedInfo } from '@/types/facility';

import { EditField } from './EditField';
import { TabSaveButton } from './TabSaveButton';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type AdvancedTabProps = TabProps<AdvancedInfo>;

export const AdvancedTab = ({
  data: advancedInfo,
  isEditMode = false,
  onFieldChange,
  onSave,
  isSaving = false,
  isDirty = false,
  getError = () => undefined,
}: AdvancedTabProps) => {
  if (isEditMode) {
    return (
      <>
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
              id="solutions"
              label="工夫や成功要因"
              value={advancedInfo.solutions}
              onChange={(v) => onFieldChange?.('solutions', v)}
              rows={3}
            />
          </div>
        </div>
        {onSave && <TabSaveButton onSave={onSave} isSaving={isSaving} isDirty={isDirty} />}
      </>
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
