import React from 'react';

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
        <div className={styles.imagePlaceholder}>image</div>
      </div>
    </div>
  );
};
