import { SpecialtyInfo } from '@/types/facility';

import { EditField } from './EditField';
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
          <EditField
            type="textarea"
            id="features"
            label="特に力を入れている取り組み"
            value={specialtyInfo.features?.join('\n')}
            onChange={(v) => onFieldChange?.('features', (v as string).split('\n'))}
            rows={5}
            placeholder="1行に1つずつ入力（空行は保存時に除外されます）"
          />
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
