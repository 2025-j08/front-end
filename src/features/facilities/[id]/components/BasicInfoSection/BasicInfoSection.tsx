import type { AnnexFacility } from '@/types/facility';

import styles from './BasicInfoSection.module.scss';

type BasicInfoSectionProps = {
  dormitoryType?: '大舎' | '中舎' | '小舎' | 'グループホーム' | '地域小規模';
  establishedYear?: string;
  capacity?: number;
  provisionalCapacity?: number;
  annexFacilities?: AnnexFacility[];
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** フィールド更新ハンドラー */
  onFieldChange?: (field: string, value: unknown) => void;
};

/**
 * 施設詳細ページの基本情報セクション
 * 設立年、舎の種別、定員、併設施設を表示
 * 編集モード時は入力フィールドを表示
 */
export const BasicInfoSection = ({
  dormitoryType,
  establishedYear,
  capacity,
  provisionalCapacity,
  annexFacilities,
  isEditMode = false,
  onFieldChange,
}: BasicInfoSectionProps) => {
  // 定員表示の生成
  const capacityText = capacity
    ? provisionalCapacity
      ? `${capacity}名（暫定${provisionalCapacity}名）`
      : `${capacity}名`
    : '-';

  // 併設施設表示の生成
  const annexText = annexFacilities?.length
    ? annexFacilities.map((f) => `${f.name}（${f.type}）`).join('、')
    : '-';

  if (isEditMode) {
    return (
      <section className={styles.basicInfoSection}>
        <div className={styles.gridContainer}>
          <div className={styles.infoCard}>
            <span className={styles.label}>設立年</span>
            <span className={styles.value}>{establishedYear || '-'}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.label}>舎の種別</span>
            <span className={styles.value}>{dormitoryType || '-'}</span>
          </div>
          <div className={styles.infoCard}>
            <label className={styles.label} htmlFor="capacity">
              定員
            </label>
            <div className={styles.capacityInputs}>
              <input
                type="number"
                id="capacity"
                className={styles.editInput}
                value={capacity || ''}
                onChange={(e) =>
                  onFieldChange?.('capacity', e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="定員"
                aria-label="定員"
                min={0}
              />
              <input
                type="number"
                id="provisionalCapacity"
                className={styles.editInput}
                value={provisionalCapacity || ''}
                onChange={(e) =>
                  onFieldChange?.(
                    'provisionalCapacity',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="暫定定員"
                aria-label="暫定定員"
                min={0}
              />
            </div>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.label}>併設施設</span>
            <span className={styles.value}>{annexText}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.basicInfoSection}>
      <div className={styles.gridContainer}>
        <div className={styles.infoCard}>
          <span className={styles.label}>設立年</span>
          <span className={styles.value}>{establishedYear || '-'}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>舎の種別</span>
          <span className={styles.value}>{dormitoryType || '-'}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>定員</span>
          <span className={styles.value}>{capacityText}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>併設施設</span>
          <span className={styles.value}>{annexText}</span>
        </div>
      </div>
    </section>
  );
};
