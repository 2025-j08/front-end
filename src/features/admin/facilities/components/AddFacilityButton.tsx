'use client';

import React from 'react';

import styles from '../styles/AddFacilityButton.module.scss';

/**
 * 施設を追加するボタンコンポーネントに渡される Props。
 */
interface AddFacilityButtonProps {
  /**
   * 「追加」ボタンがクリックされたときに呼び出されるハンドラー。
   */
  onClick: () => void;
}

/**
 * 管理画面で新しい施設を追加するための「追加」ボタンを表示するコンポーネント。
 */
export const AddFacilityButton: React.FC<AddFacilityButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <button onClick={onClick} className={styles.button}>
        追加
      </button>
    </div>
  );
};
