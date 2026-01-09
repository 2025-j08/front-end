import { AdvancedInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type AdvancedTabProps = {
  advancedInfo: AdvancedInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const AdvancedTab = ({
  advancedInfo,
  isEditMode = false,
  onFieldChange,
}: AdvancedTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <div className={styles.editGroup}>
            <label htmlFor="advancedTitle" className={styles.editLabel}>
              タイトル
            </label>
            <input
              type="text"
              id="advancedTitle"
              className={styles.editInput}
              value={advancedInfo.title || ''}
              onChange={(e) => onFieldChange?.('title', e.target.value)}
              placeholder="例: 多機能化への取り組み"
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="description" className={styles.editLabel}>
              取り組み内容
            </label>
            <textarea
              id="description"
              className={styles.editTextarea}
              value={advancedInfo.description || ''}
              onChange={(e) => onFieldChange?.('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="background" className={styles.editLabel}>
              経緯と背景
            </label>
            <textarea
              id="background"
              className={styles.editTextarea}
              value={advancedInfo.background || ''}
              onChange={(e) => onFieldChange?.('background', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="challenges" className={styles.editLabel}>
              苦労や課題
            </label>
            <textarea
              id="challenges"
              className={styles.editTextarea}
              value={advancedInfo.challenges || ''}
              onChange={(e) => onFieldChange?.('challenges', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="solutions" className={styles.editLabel}>
              工夫や成功要因
            </label>
            <textarea
              id="solutions"
              className={styles.editTextarea}
              value={advancedInfo.solutions || ''}
              onChange={(e) => onFieldChange?.('solutions', e.target.value)}
              rows={3}
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
          title={advancedInfo.title || '多機能化への取り組み'}
          content={advancedInfo.description}
        />

        <TabSection title="経緯と背景" content={advancedInfo.background} />

        <TabSection title="取り組みにあたっての苦労や課題" content={advancedInfo.challenges} />

        <TabSection title="工夫や成功要因・乗り越えた方法" content={advancedInfo.solutions} />
      </div>
    </div>
  );
};
