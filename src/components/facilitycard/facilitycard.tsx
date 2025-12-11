'use client';
import React from 'react';

import styles from './facilitycard.module.scss';

export type Facility = {
  id?: string | number;
  name: string;
  address: string;
  postalCode?: string;
  phone?: string;
  imageUrl?: string;
};

type Props = { facility: Facility };

const FacilityCard: React.FC<Props> = ({ facility }) => {
  return (
    <article className={styles.card} role="group" aria-label={facility.name}>
      <div className={styles.left}>
        <h3 className={styles.title}>{facility.name}</h3>

        <div className={styles.label}>住所</div>

        <div className={styles.address}>
          <div className={styles.postal}>〒 {facility.postalCode ?? 'XXX-XXXX'}</div>
          <div className={styles['addr-line']}>{facility.address}</div>
          <div className={styles.phone}>TEL {facility.phone ?? 'xxx-xxxx-xxxx'}</div>
        </div>
      </div>

      <div className={styles.right}>
        {facility.imageUrl ? (
          <img className={styles.image} src={facility.imageUrl} alt={`${facility.name} の画像`} />
        ) : (
          <div className={styles.placeholder}>image</div>
        )}
      </div>
    </article>
  );
};

export default FacilityCard;
