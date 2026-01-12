import type { AnnexFacility } from '@/types/facility';

import { formatCapacity } from '../../utils/formatters';
import { InfoCard } from './InfoCard';
import { AnnexCard } from './AnnexCard';
import { CapacityInput } from './CapacityInput';
import { AnnexFacilityEditor } from './AnnexFacilityEditor';
import styles from './BasicInfoSection.module.scss';

/** 施設の種類の選択肢 */
const DORMITORY_TYPE_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '大舎', label: '大舎' },
  { value: '中舎', label: '中舎' },
  { value: '小舎', label: '小舎' },
  { value: 'グループホーム', label: 'グループホーム' },
  { value: '地域小規模', label: '地域小規模' },
] as const;

type BasicInfoSectionProps = {
  dormitoryType?: '大舎' | '中舎' | '小舎' | 'グループホーム' | '地域小規模';
  establishedYear?: string;
  capacity?: number;
  provisionalCapacity?: number;
  annexFacilities?: AnnexFacility[];
  phone?: string;
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** フィールド更新ハンドラー */
  onFieldChange?: (field: string, value: unknown) => void;
  /** エラー取得関数 */
  getError?: (field: string) => string | undefined;
  /** 保存ハンドラー */
  onSave?: () => Promise<void>;
  /** 保存中フラグ */
  isSaving?: boolean;
  /** 変更されたか */
  isDirty?: boolean;
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
  phone,
  isEditMode = false,
  onFieldChange,
  getError = () => undefined,
  onSave,
  isSaving = false,
  isDirty = false,
}: BasicInfoSectionProps) => {
  // 定員表示の生成（フォーマッター関数を使用）
  const capacityText = formatCapacity(capacity, provisionalCapacity);

  // 併設施設表示の生成
  const annexText = annexFacilities?.length
    ? annexFacilities.map((f) => `${f.name}（${f.type}）`).join('、')
    : '-';

  // 保存ボタンのクリックハンドラー
  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
  };

  return (
    <section className={styles.basicInfoSection}>
      {isEditMode && (
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>基本情報</h3>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={styles.saveButton}
          >
            {isSaving ? '保存中...' : '保存する'}
          </button>
        </div>
      )}
      <div className={styles.gridContainer}>
        {isEditMode ? (
          <div className={styles.infoCard}>
            <label className={styles.label} htmlFor="dormitoryType">
              施設の種類
            </label>
            <select
              id="dormitoryType"
              className={styles.editInput}
              value={dormitoryType || ''}
              onChange={(e) => onFieldChange?.('dormitoryType', e.target.value || undefined)}
            >
              {DORMITORY_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <InfoCard label="施設の種類" value={dormitoryType || '-'} />
        )}

        {isEditMode ? (
          <div className={styles.infoCard}>
            <label className={styles.label} htmlFor="establishedYear">
              設立年
            </label>
            <input
              type="text"
              id="establishedYear"
              className={styles.editInput}
              value={establishedYear || ''}
              onChange={(e) => onFieldChange?.('establishedYear', e.target.value)}
              placeholder="例: 1990年"
            />
          </div>
        ) : (
          <InfoCard label="設立年" value={establishedYear || '-'} />
        )}

        {isEditMode ? (
          <CapacityInput
            capacity={capacity}
            provisionalCapacity={provisionalCapacity}
            onFieldChange={onFieldChange}
            getError={getError}
          />
        ) : (
          <InfoCard label="施設定員" value={capacityText} />
        )}

        {isEditMode && (
          <div className={styles.infoCard}>
            <label className={styles.label} htmlFor="phone">
              電話番号
            </label>
            <input
              type="tel"
              id="phone"
              className={styles.editInput}
              value={phone || ''}
              onChange={(e) => onFieldChange?.('phone', e.target.value)}
              placeholder="例: 03-1234-5678"
            />
          </div>
        )}

        {isEditMode ? (
          <div className={`${styles.infoCard} ${styles.annexCard}`}>
            <div className={styles.annexHeader}>
              <span className={styles.label}>併設施設</span>
              <span className={styles.subStatus}>{annexFacilities?.length ? 'あり' : 'なし'}</span>
            </div>
            <AnnexFacilityEditor annexFacilities={annexFacilities} onFieldChange={onFieldChange} />
          </div>
        ) : (
          <AnnexCard annexFacilities={annexFacilities} annexText={annexText} />
        )}
      </div>
    </section>
  );
};
