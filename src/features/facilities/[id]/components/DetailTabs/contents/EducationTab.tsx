import { EducationInfo } from '@/types/facility';

import { EditField } from './EditField';
import { EditSection } from './EditSection';
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
            {/* 進学率と支援体制セクション - 表示画面と統一 */}
            <EditSection title="進学率と支援体制">
              <EditField
                type="text"
                id="graduationRatePercentage"
                label="進学率"
                value={educationInfo.graduationRatePercentage}
                onChange={(v) => onFieldChange?.('graduationRatePercentage', v)}
                placeholder="例: 90%"
                error={getError('educationInfo.graduationRatePercentage')}
              />
              <EditField
                type="textarea"
                id="graduationRate"
                label="支援体制の詳細"
                value={educationInfo.graduationRate}
                onChange={(v) => onFieldChange?.('graduationRate', v)}
                rows={2}
                placeholder="進学率に関する詳細や支援体制を入力"
                error={getError('educationInfo.graduationRate')}
              />
            </EditSection>

            {/* 学習支援の工夫や外部連携 - 表示画面のタイトルと統一 */}
            <EditSection title="学習支援の工夫や外部連携">
              <EditField
                type="textarea"
                id="learningSupport"
                label="学習支援の内容"
                value={educationInfo.learningSupport}
                onChange={(v) => onFieldChange?.('learningSupport', v)}
                rows={2}
                placeholder="学習支援の工夫や外部連携について入力"
                error={getError('educationInfo.learningSupport')}
              />
            </EditSection>

            {/* 特化した進路支援内容 */}
            <EditSection title="特化した進路支援内容">
              <EditField
                type="textarea"
                id="careerSupport"
                label="進路支援の内容"
                value={educationInfo.careerSupport}
                onChange={(v) => onFieldChange?.('careerSupport', v)}
                rows={2}
                placeholder="特化した進路支援の内容を入力"
                error={getError('educationInfo.careerSupport')}
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
        <TabSection title="進学率と支援体制">
          {educationInfo.graduationRatePercentage && (
            <p className={styles.textContent}>進学率：{educationInfo.graduationRatePercentage}</p>
          )}
          {educationInfo.graduationRate && (
            <p className={styles.textContent}>{educationInfo.graduationRate}</p>
          )}
        </TabSection>

        <TabSection title="学習支援の工夫や外部連携" content={educationInfo.learningSupport} />

        <TabSection title="特化した進路支援内容" content={educationInfo.careerSupport} />
      </div>
    </div>
  );
};
