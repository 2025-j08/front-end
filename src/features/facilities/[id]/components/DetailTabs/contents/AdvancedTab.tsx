import { AdvancedInfo } from '@/types/facility';

import { EditField } from './EditField';
import { EditSection } from './EditSection';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type AdvancedTabProps = TabProps<AdvancedInfo>;

export const AdvancedTab = ({
  data: advancedInfo,
  isEditMode = false,
  onFieldChange,
  getError = () => undefined,
}: AdvancedTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={styles.tabContentWrapper}>
          <div className={styles.textSection}>
            {/* 実施している多機能化への取り組み */}
            <EditSection title="実施している多機能化への取り組み">
              <EditField
                type="textarea"
                id="description"
                label="取り組み内容"
                value={advancedInfo.description}
                onChange={(v) => onFieldChange?.('description', v)}
                rows={4}
                error={getError('advancedInfo.description')}
              />
            </EditSection>

            {/* 実現に向けた経緯と背景 */}
            <EditSection title="実現に向けた経緯と背景">
              <EditField
                type="textarea"
                id="background"
                label="経緯と背景"
                value={advancedInfo.background}
                onChange={(v) => onFieldChange?.('background', v)}
                rows={3}
                error={getError('advancedInfo.background')}
              />
            </EditSection>

            {/* 取り組みにあたっての苦労や課題 */}
            <EditSection title="取り組みにあたっての苦労や課題">
              <EditField
                type="textarea"
                id="challenges"
                label="苦労や課題"
                value={advancedInfo.challenges}
                onChange={(v) => onFieldChange?.('challenges', v)}
                rows={3}
                error={getError('advancedInfo.challenges')}
              />
            </EditSection>

            {/* 工夫や成功要因・乗り越えた方法 */}
            <EditSection title="工夫や成功要因・乗り越えた方法">
              <EditField
                type="textarea"
                id="solutions"
                label="工夫や成功要因"
                value={advancedInfo.solutions}
                onChange={(v) => onFieldChange?.('solutions', v)}
                rows={3}
                error={getError('advancedInfo.solutions')}
              />
            </EditSection>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection title="実施している多機能化への取り組み" content={advancedInfo.description} />

        <TabSection title="実現に向けた経緯と背景" content={advancedInfo.background} />

        <TabSection title="取り組みにあたっての苦労や課題" content={advancedInfo.challenges} />

        <TabSection title="工夫や成功要因・乗り越えた方法" content={advancedInfo.solutions} />
      </div>
    </div>
  );
};
