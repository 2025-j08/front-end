import { SpecialtyInfo } from '@/types/facility';

import styles from './TabContent.module.scss';

type SpecialtyTabProps = {
  specialtyInfo: SpecialtyInfo;
};

export const SpecialtyTab = ({ specialtyInfo }: SpecialtyTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <ul className={styles.featureList}>
          {specialtyInfo.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
