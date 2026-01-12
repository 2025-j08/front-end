import { OtherInfo } from '@/types/facility';

import { EditField } from './EditField';
import { TabSaveButton } from './TabSaveButton';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type OtherTabProps = TabProps<OtherInfo>;

export const OtherTab = ({
  data: otherInfo,
  isEditMode = false,
  onFieldChange,
  onSave,
  isSaving = false,
  isDirty = false,
  getError = () => undefined,
}: OtherTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={styles.tabContentWrapper}>
          <div className={styles.textSection}>
            <div className={styles.editGroup}>
              <EditField
                type="textarea"
                id="networks"
                label="他施設とのネットワーク"
                value={otherInfo.networks}
                onChange={(v) => onFieldChange?.('networks', v)}
                rows={3}
                error={getError('otherInfo.networks')}
              />
            </div>
            <div className={styles.editGroup}>
              <EditField
                type="textarea"
                id="futureOutlook"
                label="今後の展望や課題"
                value={otherInfo.futureOutlook}
                onChange={(v) => onFieldChange?.('futureOutlook', v)}
                rows={3}
                error={getError('otherInfo.futureOutlook')}
              />
            </div>
            <div className={styles.editGroup}>
              <EditField
                type="textarea"
                id="freeText"
                label="自由記述"
                value={otherInfo.freeText}
                onChange={(v) => onFieldChange?.('freeText', v)}
                rows={4}
                error={getError('otherInfo.freeText')}
              />
            </div>
          </div>
        </div>
        {onSave && <TabSaveButton onSave={onSave} isSaving={isSaving} isDirty={isDirty} />}
      </>
    );
  }

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        {(otherInfo.title || otherInfo.description) && (
          <TabSection title={otherInfo.title} content={otherInfo.description} />
        )}

        <TabSection title="他施設とのネットワークや共同プロジェクト" content={otherInfo.networks} />

        <TabSection title="今後の展望や課題" content={otherInfo.futureOutlook} />

        <TabSection title="自由記述" content={otherInfo.freeText} />
      </div>
    </div>
  );
};
