import { EducationInfo } from '@/types/facility';

import { EditField } from './EditField';
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
          <EditField
            type="text"
            id="graduationRate"
            label="進学率"
            value={educationInfo.graduationRate}
            onChange={(v: any) => onFieldChange?.('graduationRate', v)}
            placeholder="例: 高校進学率95%"
          />
          <EditField
            type="textarea"
            id="policy"
            label="教育方針"
            value={educationInfo.policy}
            onChange={(v: any) => onFieldChange?.('policy', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="learningSupport"
            label="学習支援の工夫や外部連携"
            value={educationInfo.learningSupport}
            onChange={(v: any) => onFieldChange?.('learningSupport', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="careerSupport"
            label="進路支援内容"
            value={educationInfo.careerSupport}
            onChange={(v: any) => onFieldChange?.('careerSupport', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="afterCare"
            label="アフターケア"
            value={educationInfo.afterCare}
            onChange={(v: any) => onFieldChange?.('afterCare', v)}
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
