import { PhilosophyInfo } from '@/types/facility';

import { EditField } from './EditField';
import { TabSaveButton } from './TabSaveButton';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type PhilosophyTabProps = TabProps<PhilosophyInfo>;

export const PhilosophyTab = ({
  data: philosophyInfo,
  isEditMode = false,
  onFieldChange,
  getError = () => undefined,
  onSave,
  isSaving = false,
  isDirty = false,
}: PhilosophyTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={styles.tabContentWrapper}>
          <div className={styles.textSection}>
            <EditField
              type="textarea"
              id="message"
              label="理念メッセージ"
              value={philosophyInfo.message}
              onChange={(v) => onFieldChange?.('message', v)}
              rows={3}
              placeholder="施設の理念メッセージを入力してください"
              error={getError('philosophyInfo.message')}
            />
            <EditField
              type="textarea"
              id="description"
              label="日々の支援の中で重視している視点"
              value={philosophyInfo.description}
              onChange={(v) => onFieldChange?.('description', v)}
              rows={10}
              placeholder="日々の支援の中で重視している視点を入力してください"
              error={getError('philosophyInfo.description')}
            />
          </div>
        </div>
        {onSave && <TabSaveButton onSave={onSave} isSaving={isSaving} isDirty={isDirty} />}
      </>
    );
  }

  return (
    <div className={styles.philosophyTabContainer}>
      {philosophyInfo.message && (
        <div className={styles.textSection}>
          <TabSection title="理念" content={philosophyInfo.message} />
        </div>
      )}
      <div className={styles.textSection}>
        <TabSection title="日々の支援の中で重視している視点" content={philosophyInfo.description} />
      </div>
    </div>
  );
};
