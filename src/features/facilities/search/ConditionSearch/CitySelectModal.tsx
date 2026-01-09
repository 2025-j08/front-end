'use client';

import { useEffect, useRef } from 'react';

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
  // オーバーレイ上でのマウス操作を追跡するためのRef
  const isMouseDownOnOverlay = useRef(false);

  // モーダル表示時に背景スクロール固定
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      onConfirm(selectedCities.filter((c) => c !== city));
    } else {
      onConfirm([...selectedCities, city]);
    }
  };

  // オーバーレイ上でマウスダウンしたかを記録
  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      isMouseDownOnOverlay.current = true;
    }
  };

  // オーバーレイ上でマウスアップし、かつマウスダウンもオーバーレイ上だった場合のみ閉じる
  const handleOverlayMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDownOnOverlay.current && e.target === e.currentTarget) {
      onClose();
    }
    // 処理終了後はフラグをリセット
    isMouseDownOnOverlay.current = false;
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayMouseDown}
      onMouseUp={handleOverlayMouseUp}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()} // モーダル内のドラッグがオーバーレイに伝播して誤判定されるのを防ぐ（念のため）
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
