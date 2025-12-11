import React from 'react';

import styles from './facilityBox.module.scss';

type FacilityBoxProps = {
  name: string;
  postal: string;
  address1: string;
  address2?: string;
  tel: string;
};

/**
 * 施設情報カードコンポーネント
 * 施設の名前、郵便番号、住所、電話番号を表示する再利用可能なカード。
 * 左側に情報、右側に画像プレースホルダを配置し、レスポンシブ対応。
 * @param props - 施設情報のプロップス
 */
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
      <figure className={styles.imageWrapper}>
        {/* Placeholder until real images are provided. Use role+aria-label for accessibility. */}
        <div className={styles.placeholder} role="img" aria-label={`${name} の画像プレースホルダ`}>
          image
        </div>
      </figure>
    </div>
  );
};

export default FacilityBox;
