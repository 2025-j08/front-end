import { EducationInfo } from '@/types/facility';

import { EditField } from './EditField';
import { TabSaveButton } from './TabSaveButton';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type EducationTabProps = TabProps<EducationInfo>;

export const EducationTab = ({
  data: educationInfo,
  isEditMode = false,
  onFieldChange,
  onSave,
  isSaving = false,
  isDirty = false,
  getError = () => undefined,
}: EducationTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={styles.tabContentWrapper}>
          <div className={styles.textSection}>
            <div className={styles.editGroup}>
              <EditField
                type="textarea"
                id="graduationRate"
                label="進学率と支援体制"
                value={educationInfo.graduationRate}
                onChange={(v) => onFieldChange?.('graduationRate', v)}
                rows={2}
                error={getError('educationInfo.graduationRate')}
              />
            </div>
            <div className={styles.editGroup}>
              <EditField
                type="textarea"
                id="learningSupport"
                label="学習支援の内容"
                value={educationInfo.learningSupport}
                onChange={(v) => onFieldChange?.('learningSupport', v)}
                rows={2}
                error={getError('educationInfo.learningSupport')}
              />
            </div>
            <div className={styles.editGroup}>
              <EditField
                type="textarea"
                id="careerSupport"
                label="特化した進路支援内容"
                value={educationInfo.careerSupport}
                onChange={(v) => onFieldChange?.('careerSupport', v)}
                rows={2}
                error={getError('educationInfo.careerSupport')}
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
        <TabSection title="進学率と支援体制" content={educationInfo.graduationRate} />

        <TabSection title="学習支援の工夫や外部連携" content={educationInfo.learningSupport} />

        <TabSection title="特化した進路支援内容" content={educationInfo.careerSupport} />
      </div>
    </div>
  );
};
