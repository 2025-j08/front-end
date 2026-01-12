import { SpecialtyInfo } from '@/types/facility';

import { EditField } from './EditField';
import { TabSaveButton } from './TabSaveButton';
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
            <div className={styles.editGroup}>
              <EditField
                type="textarea"
                id="features"
                label="特に力を入れている取り組み/支援領域"
                value={specialtyInfo.features}
                onChange={(v) => onFieldChange?.('features', v)}
                rows={5}
                placeholder="特に力を入れている取り組み/支援領域を入力してください"
                error={getError('specialtyInfo.features')}
              />
            </div>
            <EditField
              type="textarea"
              id="programs"
              label="特色ある活動や独自プログラム"
              value={specialtyInfo.programs}
              onChange={(v) => onFieldChange?.('programs', v)}
              rows={3}
            />
          </div>
        </div>
        {onSave && <TabSaveButton onSave={onSave} isSaving={isSaving} isDirty={isDirty} />}
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
