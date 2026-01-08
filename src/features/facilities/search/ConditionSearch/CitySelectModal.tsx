'use client';

import { useEffect } from 'react';

import styles from './CitySelectModal.module.scss';

type Props = {
  isOpen: boolean;
  prefectureName: string;
  cities: string[];
  selectedCities: string[];
  onClose: () => void;
  onConfirm: (cities: string[]) => void;
};

export const CitySelectModal = ({
  isOpen,
  prefectureName,
  cities,
  selectedCities,
  onClose,
  onConfirm,
}: Props) => {
  // モーダル表示時に背景スクロール固定
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      onConfirm(selectedCities.filter((c) => c !== city));
    } else {
      onConfirm([...selectedCities, city]);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.header}>
          <h3 id="modal-title">{prefectureName}の市区町村を選択</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {cities.length > 0 ? (
            <div className={styles.cityGrid}>
              {cities.map((city) => (
                <label key={city} className={styles.cityItem}>
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(city)}
                    onChange={() => handleToggleCity(city)}
                  />
                  <span>{city}</span>
                </label>
              ))}
            </div>
          ) : (
            <p>施設データが見つかりませんでした。</p>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.confirm}`}
            onClick={onClose}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
};
