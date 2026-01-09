import { OtherInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type OtherTabProps = {
  otherInfo: OtherInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const OtherTab = ({ otherInfo, isEditMode = false, onFieldChange }: OtherTabProps) => {
  // 文字列の場合は後方互換性のため対応
  const isString = typeof otherInfo === 'string';

  if (isString) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <TabSection content={otherInfo} />
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <div className={styles.editGroup}>
            <label htmlFor="otherTitle" className={styles.editLabel}>
              タイトル
            </label>
            <input
              type="text"
              id="otherTitle"
              className={styles.editInput}
              value={otherInfo.title || ''}
              onChange={(e) => onFieldChange?.('title', e.target.value)}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="otherDescription" className={styles.editLabel}>
              説明
            </label>
            <textarea
              id="otherDescription"
              className={styles.editTextarea}
              value={otherInfo.description || ''}
              onChange={(e) => onFieldChange?.('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="networks" className={styles.editLabel}>
              他施設とのネットワーク
            </label>
            <textarea
              id="networks"
              className={styles.editTextarea}
              value={otherInfo.networks || ''}
              onChange={(e) => onFieldChange?.('networks', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="futureOutlook" className={styles.editLabel}>
              今後の展望や課題
            </label>
            <textarea
              id="futureOutlook"
              className={styles.editTextarea}
              value={otherInfo.futureOutlook || ''}
              onChange={(e) => onFieldChange?.('futureOutlook', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="freeText" className={styles.editLabel}>
              自由記述
            </label>
            <textarea
              id="freeText"
              className={styles.editTextarea}
              value={otherInfo.freeText || ''}
              onChange={(e) => onFieldChange?.('freeText', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        {(otherInfo.title || otherInfo.description) && (
          <TabSection title={otherInfo.title} content={otherInfo.description} />
        )}

        <TabSection title="他施設とのネットワークや共同プロジェクト" content={otherInfo.networks} />

        <TabSection title="今後の展望や課題" content={otherInfo.futureOutlook} />

        <TabSection title="自由記述" content={otherInfo.freeText} />
      </div>
    </div>
  );
};
