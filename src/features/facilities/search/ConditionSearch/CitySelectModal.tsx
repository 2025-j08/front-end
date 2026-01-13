'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './CitySelectModal.module.scss';

type Props = {
  isOpen: boolean;
  prefectureName: string;
  cities: string[];
  selectedCities: string[];
  onClose: () => void;
  onConfirm: (cities: string[]) => void;
};

/**
 * CitySelectModal コンポーネント
 *
 * 特定の都道府県に属する市区町村を複数選択するためのモーダルダイアログです。
 * ユーザーはチェックボックスで市区町村を選択し、「決定」ボタンを押すことで親コンポーネントに選択結果を反映させます。
 * モーダルが表示されている間、背景ページのスクロールは無効化されます。
 *
 * @param {Props} props
 * @param {boolean} props.isOpen - モーダルが表示されているかどうか。
 * @param {string} props.prefectureName - モーダルのヘッダーに表示する都道府県名。
 * @param {string[]} props.cities - 選択肢として表示する全市区町村のリスト。
 * @param {string[]} props.selectedCities - 現在選択されている市区町村のリスト（初期値）。
 * @param {() => void} props.onClose - モーダルを閉じる際のコールバック。
 * @param {(cities: string[]) => void} props.onConfirm - 「決定」ボタン押下時のコールバック。
 */
export const CitySelectModal = ({
  isOpen,
  prefectureName,
  cities,
  selectedCities,
  onClose,
  onConfirm,
}: Props) => {
  // モーダル内での一時的な選択状態を管理
  // 親側で条件付きレンダリングを行うため、マウント時に props.selectedCities で初期化される
  const [tempSelectedCities, setTempSelectedCities] = useState<string[]>(selectedCities);

  // オーバーレイ上でのマウス操作を追跡するためのRef
  const isMouseDownOnOverlay = useRef(false);

  // 最新の onClose コールバックを保持する Ref
  const onCloseRef = useRef(onClose);

  // onClose が更新されたら Ref に反映
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /**
   * 親コンポーネント側でモーダルの開閉と選択状態の確定を制御する設計のため、
   * このコンポーネントでは props.selectedCities をマウント時の初期値としてのみ利用し、
   * その後の props 変更に同期させる useEffect はあえて持たない方針としています。
   * モーダルを閉じるタイミングで onConfirm により選択結果のみを親へ伝播させます。
   */

  // モーダル表示時に背景スクロール固定 + Escape キーでのクローズ
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };

    const originalOverflow = document.body.style.overflow;

    // 条件付きレンダリングのため、マウント時は常に isOpen=true のはずだが、念のためチェック
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // チェックボックス切り替え時はローカルステートのみ更新
  const handleToggleCity = (city: string) => {
    setTempSelectedCities((prev) => {
      if (prev.includes(city)) {
        return prev.filter((c) => c !== city);
      } else {
        return [...prev, city];
      }
    });
  };

  // すべて選択
  const handleSelectAll = () => {
    setTempSelectedCities([...cities]);
  };

  // すべて解除
  const handleDeselectAll = () => {
    setTempSelectedCities([]);
  };

  // 全選択状態かどうか
  const isAllSelected = cities.length > 0 && tempSelectedCities.length === cities.length;

  // 「決定」ボタン押下時に親へ変更を通知して閉じる
  const handleConfirmClick = () => {
    onConfirm(tempSelectedCities);
    onClose();
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
        // モーダル内でのマウスダウンがオーバーレイに伝播すると、
        // handleOverlayMouseDown / handleOverlayMouseUp の判定で
        // 「モーダル外クリック」と誤認されてモーダルが閉じてしまうため、
        // ここでイベント伝播を止めている（オーバーレイ上での操作のみ閉じる）。
        onMouseDown={(e) => e.stopPropagation()}
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
            <>
              <div className={styles.selectAllArea}>
                <button
                  type="button"
                  className={styles.selectAllButton}
                  onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                >
                  {isAllSelected ? 'すべて解除' : 'すべて選択'}
                </button>
                <span className={styles.selectionCount}>
                  {tempSelectedCities.length} / {cities.length} 件選択中
                </span>
              </div>
              <div className={styles.cityGrid}>
                {cities.map((city) => {
                  const isChecked = tempSelectedCities.includes(city);
                  const inputId = `city-${city}`;

                  return (
                    <label key={city} className={styles.cityItem} htmlFor={inputId}>
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCity(city)}
                      />
                      <span>{city}</span>
                    </label>
                  );
                })}
              </div>
            </>
          ) : (
            <p>施設データが見つかりませんでした。</p>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.confirm}`}
            onClick={handleConfirmClick}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
};
