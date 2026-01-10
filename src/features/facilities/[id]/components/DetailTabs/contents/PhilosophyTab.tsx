import { PhilosophyInfo } from '@/types/facility';

import { EditField } from './EditField';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type PhilosophyTabProps = {
  philosophyInfo: PhilosophyInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
  errors?: Record<string, string>;
  getError?: (field: string) => string | undefined;
};

export const PhilosophyTab = ({
  philosophyInfo,
  isEditMode = false,
  onFieldChange,
  errors = {},
  getError = () => undefined,
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
            onChange={(v) => onFieldChange?.('title', v)}
          />

          <EditField
            type="textarea"
            id="description"
            label="運営方針・理念"
            value={philosophyInfo.description}
            onChange={(v) => onFieldChange?.('description', v)}
            rows={10}
            placeholder="施設の運営方針や理念を入力してください"
            error={getError('philosophyInfo.description')}
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
