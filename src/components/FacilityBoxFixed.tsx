import React from 'react';

import styles from './FacilityBox.module.scss';

type FacilityBoxProps = {
  name: string;
  postal: string;
  address1: string;
  address2?: string;
  tel: string;
};

const FacilityBox: React.FC<FacilityBoxProps> = ({ name, postal, address1, address2, tel }) => {
  return (
    <div className={styles.container}>
      {/* 左側（施設情報） */}
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>

        <div className={styles.details}>
          <div>住所</div>
          <div>〒 {postal}</div>
          <div>{address1}</div>
          {address2 && <div>{address2}</div>}
          <div>TEL {tel}</div>
        </div>
      </div>

      {/* 右側（画像） */}
      <figure className={styles.imageWrapper} aria-hidden={false}>
        {/* Placeholder until real images are provided. Use role+aria-label for accessibility. */}
        <div className={styles.placeholder} role="img" aria-label={`${name} の画像プレースホルダ`}>
          image
        </div>
      </figure>
    </div>
  );
};

export default FacilityBox;
