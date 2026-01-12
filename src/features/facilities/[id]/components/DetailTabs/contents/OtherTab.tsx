import { OtherInfo } from '@/types/facility';

import { EditField } from './EditField';
import { EditSection } from './EditSection';
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
            {/* 他施設とのネットワーク - 編集画面では常に表示 */}
            <EditSection title="他施設とのネットワークや共同プロジェクト">
              <EditField
                type="textarea"
                id="networks"
                label="ネットワークや共同プロジェクト"
                value={otherInfo.networks}
                onChange={(v) => onFieldChange?.('networks', v)}
                rows={3}
                error={getError('otherInfo.networks')}
              />
            </EditSection>

            {/* 今後の展望や課題 */}
            <EditSection title="今後の展望や課題">
              <EditField
                type="textarea"
                id="futureOutlook"
                label="展望や課題"
                value={otherInfo.futureOutlook}
                onChange={(v) => onFieldChange?.('futureOutlook', v)}
                rows={3}
                error={getError('otherInfo.futureOutlook')}
              />
            </EditSection>

            {/* 自由記述 */}
            <EditSection title="自由記述">
              <EditField
                type="textarea"
                id="freeText"
                label="自由記述"
                value={otherInfo.freeText}
                onChange={(v) => onFieldChange?.('freeText', v)}
                rows={4}
                error={getError('otherInfo.freeText')}
              />
            </EditSection>
          </div>
        </div>
        {onSave && <TabSaveButton onSave={onSave} isSaving={isSaving} isDirty={isDirty} />}
      </>
    );
  }

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        {otherInfo.networks && (
          <TabSection
            title="他施設とのネットワークや共同プロジェクト"
            content={otherInfo.networks}
          />
        )}

        {otherInfo.futureOutlook && (
          <TabSection title="今後の展望や課題" content={otherInfo.futureOutlook} />
        )}

        {otherInfo.freeText && <TabSection title="自由記述" content={otherInfo.freeText} />}
      </div>
    </div>
  );
};
