'use client';

import React from 'react';

import styles from '@/styles/AddFacilityButton.module.scss';

interface AddFacilityButtonProps {
  onClick: () => void;
}

export const AddFacilityButton: React.FC<AddFacilityButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <button onClick={onClick} className={styles.button}>
        追加
      </button>
    </div>
  );
};
