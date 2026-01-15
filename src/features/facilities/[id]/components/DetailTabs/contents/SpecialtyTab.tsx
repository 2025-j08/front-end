import { SpecialtyInfo } from '@/types/facility';

import { EditField } from './EditField';
import { EditSection } from './EditSection';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type SpecialtyTabProps = TabProps<SpecialtyInfo>;

export const SpecialtyTab = ({
  data: specialtyInfo,
  isEditMode = false,
  onFieldChange,
  getError = () => undefined,
  onSave,
  isSaving = false,
  isDirty = false,
}: SpecialtyTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={styles.tabContentWrapper}>
          <div className={styles.textSection}>
            {/* 表示画面のタイトルと統一 */}
            <EditSection title="特に力を入れている取り組み/支援領域">
              <EditField
                type="textarea"
                id="features"
                label="取り組み内容"
                value={specialtyInfo.features}
                onChange={(v) => onFieldChange?.('features', v)}
                rows={5}
                placeholder="特に力を入れている取り組み/支援領域を入力してください"
                error={getError('specialtyInfo.features')}
              />
            </EditSection>

            <EditSection title="特色ある活動や独自プログラム">
              <EditField
                type="textarea"
                id="programs"
                label="プログラム内容"
                value={specialtyInfo.programs}
                onChange={(v) => onFieldChange?.('programs', v)}
                rows={3}
                placeholder="特色ある活動や独自プログラムを入力してください"
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
        <TabSection title="特に力を入れている取り組み/支援領域" content={specialtyInfo.features} />

        <TabSection title="特色ある活動や独自プログラム" content={specialtyInfo.programs} />
      </div>
    </div>
  );
};
