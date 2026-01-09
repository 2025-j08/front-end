import { SpecialtyInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

type SpecialtyTabProps = {
  specialtyInfo: SpecialtyInfo;
};

export const SpecialtyTab = ({ specialtyInfo }: SpecialtyTabProps) => {
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
