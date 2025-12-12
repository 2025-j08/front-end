import Image from 'next/image';

import { Facility } from '@/types/facility';

import styles from './FacilityCard.module.scss';

type FacilityCardProps = {
  facility: Facility;
};

export const FacilityCard = ({ facility }: FacilityCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h2 className={styles.name}>{facility.name}</h2>
        <p className={styles.label}>住所</p>
        <p className={styles.postalCode}>〒 {facility.postalCode}</p>
        <p className={styles.address}>{facility.address}</p>
        <p className={styles.phone}>TEL {facility.phone}</p>
      </div>
      <div className={styles.imageWrapper}>
        {facility.imagePath ? (
          <Image
            src={facility.imagePath}
            alt={facility.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 120px"
          />
        ) : (
          <div className={styles.imagePlaceholder}>no image</div>
        )}
      </div>
    </div>
  );
};
