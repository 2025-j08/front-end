import { PhilosophyInfo } from '@/types/facility';

import { EditField } from './EditField';
import { EditSection } from './EditSection';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type PhilosophyTabProps = TabProps<PhilosophyInfo>;

export const PhilosophyTab = ({
  data: philosophyInfo,
  isEditMode = false,
  onFieldChange,
  getError = () => undefined,
}: PhilosophyTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={styles.philosophyTabContainer}>
          <div className={styles.textSection}>
            {/* 理念セクション - 編集画面では常に表示 */}
            <EditSection title="理念">
              <EditField
                type="textarea"
                id="message"
                label="理念"
                value={philosophyInfo.message}
                onChange={(v) => onFieldChange?.('message', v)}
                rows={3}
                placeholder="施設の理念を入力してください"
                error={getError('philosophyInfo.message')}
              />
            </EditSection>

            {/* 日々の支援の中で重視している視点 - 表示画面と同じタイトル */}
            <EditSection title="日々の支援の中で重視している視点">
              <EditField
                type="textarea"
                id="description"
                label="重視している視点"
                value={philosophyInfo.description}
                onChange={(v) => onFieldChange?.('description', v)}
                rows={10}
                placeholder="日々の支援の中で重視している視点を入力してください"
                error={getError('philosophyInfo.description')}
              />
            </EditSection>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.philosophyTabContainer}>
      <div className={styles.textSection}>
        <TabSection title="理念" content={philosophyInfo.message} />
      </div>
      <div className={styles.textSection}>
        <TabSection title="日々の支援の中で重視している視点" content={philosophyInfo.description} />
      </div>
    </div>
  );
};
