import { PhilosophyInfo } from '@/types/facility';

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
          <div className={styles.editGroup}>
            <label htmlFor="philosophyTitle" className={styles.editLabel}>
              タイトル
            </label>
            <input
              type="text"
              id="philosophyTitle"
              className={styles.editInput}
              value={philosophyInfo.title || ''}
              onChange={(e) => onFieldChange?.('title', e.target.value)}
            />
          </div>
          <div className={styles.editGroup}>
            <label htmlFor="philosophyDescription" className={styles.editLabel}>
              説明
            </label>
            <textarea
              id="philosophyDescription"
              className={styles.editTextarea}
              value={philosophyInfo.description || ''}
              onChange={(e) => onFieldChange?.('description', e.target.value)}
              rows={5}
            />
          </div>
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
