import { EducationInfo } from '@/types/facility';

import { EditField } from './EditField';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type EducationTabProps = {
  educationInfo: EducationInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
  errors?: Record<string, string>;
  getError?: (field: string) => string | undefined;
};

export const EducationTab = ({
  educationInfo,
  isEditMode = false,
  onFieldChange,
  errors = {},
  getError = () => undefined,
}: EducationTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.editGroup}>
          <EditField
            type="textarea"
            id="graduationRate"
            label="進学率と支援体制"
            value={educationInfo.graduationRate}
            onChange={(v) => onFieldChange?.('graduationRate', v)}
            rows={2}
          />
          <EditField
            type="textarea"
            id="learningSupport"
            label="学習支援の内容"
            value={educationInfo.learningSupport}
            onChange={(v) => onFieldChange?.('learningSupport', v)}
            rows={2}
          />
          <EditField
            type="textarea"
            id="careerSupport"
            label="特化した進路支援内容"
            value={educationInfo.careerSupport}
            onChange={(v) => onFieldChange?.('careerSupport', v)}
            rows={2}
          />
          <EditField
            type="textarea"
            id="afterCare"
            label="アフターケア（旧項目）"
            value={educationInfo.afterCare}
            onChange={(v) => onFieldChange?.('afterCare', v)}
            rows={2}
          />
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
