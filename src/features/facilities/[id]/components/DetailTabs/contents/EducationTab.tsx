import { EducationInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type EducationTabProps = {
  educationInfo: EducationInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const EducationTab = ({
  educationInfo,
  isEditMode = false,
  onFieldChange,
}: EducationTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <div className={styles.editGroup}>
            <label htmlFor="graduationRate" className={styles.editLabel}>
              進学率
            </label>
            <input
              type="text"
              id="graduationRate"
              className={styles.editInput}
              value={educationInfo.graduationRate || ''}
              onChange={(e) => onFieldChange?.('graduationRate', e.target.value)}
              placeholder="例: 高校進学率95%"
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="policy" className={styles.editLabel}>
              教育方針
            </label>
            <textarea
              id="policy"
              className={styles.editTextarea}
              value={educationInfo.policy || ''}
              onChange={(e) => onFieldChange?.('policy', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="learningSupport" className={styles.editLabel}>
              学習支援の工夫や外部連携
            </label>
            <textarea
              id="learningSupport"
              className={styles.editTextarea}
              value={educationInfo.learningSupport || ''}
              onChange={(e) => onFieldChange?.('learningSupport', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="careerSupport" className={styles.editLabel}>
              進路支援内容
            </label>
            <textarea
              id="careerSupport"
              className={styles.editTextarea}
              value={educationInfo.careerSupport || ''}
              onChange={(e) => onFieldChange?.('careerSupport', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="afterCare" className={styles.editLabel}>
              アフターケア
            </label>
            <textarea
              id="afterCare"
              className={styles.editTextarea}
              value={educationInfo.afterCare || ''}
              onChange={(e) => onFieldChange?.('afterCare', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  }

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
