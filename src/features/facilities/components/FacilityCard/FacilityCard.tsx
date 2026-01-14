import Image from 'next/image';
import Link from 'next/link';

import { Facility } from '@/types/facility';

import styles from './FacilityCard.module.scss';

type FacilityCardProps = {
  facility: Facility;
};

export const FacilityCard = ({ facility }: FacilityCardProps) => {
  return (
    <div className={styles.card}>
      <Link href={`/features/facilities/${facility.id}`} className={styles.link}>
        <h2 className={styles.name}>{facility.name}</h2>
        <div className={styles.content}>
          <div className={styles.info}>
            <p className={styles.label}>住所</p>
            <p className={styles.postalCode}>〒 {facility.postalCode}</p>
            <p className={styles.address}>{facility.address}</p>
            <p className={styles.label}>TEL</p>
            <p className={styles.phone}>{facility.phone}</p>
          </div>
          <div className={styles.imageWrapper}>
            {facility.imagePath ? (
              <Image
                src={facility.imagePath}
                alt={facility.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 120px"
                unoptimized
              />
            ) : (
              <div className={styles.imagePlaceholder}>no image</div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
