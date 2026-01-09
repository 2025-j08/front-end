import { PhilosophyInfo } from '@/types/facility';

import { EditField } from './EditField';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type PhilosophyTabProps = {
  philosophyInfo: PhilosophyInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const PhilosophyTab = ({
  philosophyInfo,
  isEditMode = false,
  onFieldChange,
}: PhilosophyTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <EditField
            type="text"
            id="philosophyTitle"
            label="タイトル"
            value={philosophyInfo.title}
            onChange={(v: any) => onFieldChange?.('title', v)}
          />
          <EditField
            type="textarea"
            id="philosophyDescription"
            label="説明"
            value={philosophyInfo.description}
            onChange={(v: any) => onFieldChange?.('description', v)}
            rows={5}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection title={philosophyInfo.title} content={philosophyInfo.description} />
      </div>
    </div>
  );
};
