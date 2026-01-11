import type { AnnexFacility } from '@/types/facility';

import { formatCapacity } from '../../utils/formatters';
import { InfoCard } from './InfoCard';
import { AnnexCard } from './AnnexCard';
import { CapacityInput } from './CapacityInput';
import { AnnexFacilityEditor } from './AnnexFacilityEditor';
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
  /** エラー取得関数 */
  getError?: (field: string) => string | undefined;
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
  getError = () => undefined,
}: BasicInfoSectionProps) => {
  // 定員表示の生成（フォーマッター関数を使用）
  const capacityText = formatCapacity(capacity, provisionalCapacity);

  // 併設施設表示の生成
  const annexText = annexFacilities?.length
    ? annexFacilities.map((f) => `${f.name}（${f.type}）`).join('、')
    : '-';

  return (
    <section className={styles.basicInfoSection}>
      <div className={styles.gridContainer}>
        <InfoCard label="施設の種類" value={dormitoryType || '-'} />
        <InfoCard label="設立年" value={establishedYear || '-'} />

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
