import { SpecialtyInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type SpecialtyTabProps = {
  specialtyInfo: SpecialtyInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const SpecialtyTab = ({
  specialtyInfo,
  isEditMode = false,
  onFieldChange,
}: SpecialtyTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <div className={styles.editGroup}>
            <label htmlFor="features" className={styles.editLabel}>
              特に力を入れている取り組み
            </label>
            <textarea
              id="features"
              className={styles.editTextarea}
              value={specialtyInfo.features?.join('\n') || ''}
              onChange={(e) =>
                onFieldChange?.(
                  'features',
                  e.target.value.split('\n').filter((f) => f.trim()),
                )
              }
              rows={5}
              placeholder="1行に1つずつ入力"
            />
          </div>
          <div className={styles.editGroup}>
            <label htmlFor="programs" className={styles.editLabel}>
              特色ある活動や独自プログラム
            </label>
            <textarea
              id="programs"
              className={styles.editTextarea}
              value={specialtyInfo.programs || ''}
              onChange={(e) => onFieldChange?.('programs', e.target.value)}
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
        <TabSection title="当施設が特に力を入れている取り組み">
          <ul className={styles.featureList}>
            {specialtyInfo.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </TabSection>

        <TabSection title="特色ある活動や独自プログラム" content={specialtyInfo.programs} />
      </div>
    </div>
  );
};
