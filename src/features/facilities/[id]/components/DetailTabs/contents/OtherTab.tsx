import { OtherInfo } from '@/types/facility';

import { EditField } from './EditField';
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
          <EditField
            type="text"
            id="otherTitle"
            label="タイトル"
            value={otherInfo.title}
            onChange={(v) => onFieldChange?.('title', v)}
          />
          <EditField
            type="textarea"
            id="otherDescription"
            label="説明"
            value={otherInfo.description}
            onChange={(v) => onFieldChange?.('description', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="networks"
            label="他施設とのネットワーク"
            value={otherInfo.networks}
            onChange={(v) => onFieldChange?.('networks', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="futureOutlook"
            label="今後の展望や課題"
            value={otherInfo.futureOutlook}
            onChange={(v) => onFieldChange?.('futureOutlook', v)}
            rows={3}
          />
          <EditField
            type="textarea"
            id="freeText"
            label="自由記述"
            value={otherInfo.freeText}
            onChange={(v) => onFieldChange?.('freeText', v)}
            rows={4}
          />
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
