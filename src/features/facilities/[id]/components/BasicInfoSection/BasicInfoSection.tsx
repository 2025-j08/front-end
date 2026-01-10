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
  /** エラー取得関数 */
  getError?: (field: string) => string | undefined;
};

/** 情報カード（ラベルと値を表示する共通コンポーネント） */
type InfoCardProps = {
  label: string;
  value: string;
};

const InfoCard = ({ label, value }: InfoCardProps) => (
  <div className={styles.infoCard}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);

/** 併設施設カード（共通コンポーネント） */
type AnnexCardProps = {
  annexFacilities: AnnexFacility[] | undefined;
  annexText: string;
};

const AnnexCard = ({ annexFacilities, annexText }: AnnexCardProps) => (
  <div className={`${styles.infoCard} ${styles.annexCard}`}>
    <div className={styles.annexHeader}>
      <span className={styles.label}>併設施設</span>
      <span className={styles.subStatus}>{annexFacilities?.length ? 'あり' : 'なし'}</span>
    </div>
    <div className={styles.annexContent}>
      <span className={styles.value}>{annexText}</span>
    </div>
  </div>
);

/** 数値入力フィールド（定員入力用の共通コンポーネント） */
type NumberInputFieldProps = {
  id: string;
  label: string;
  value: number | undefined;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
};

const NumberInputField = ({
  id,
  label,
  value,
  placeholder,
  error,
  onChange,
}: NumberInputFieldProps) => (
  <div className={styles.capacityField}>
    <label htmlFor={id} className={styles.subLabel}>
      {label}
    </label>
    <input
      type="number"
      id={id}
      className={`${styles.editInput} ${error ? styles.errorInput : ''}`}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={0}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <span id={`${id}-error`} className={styles.errorText} role="alert">
        {error}
      </span>
    )}
  </div>
);

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
  // 数値フィールド変更のヘルパー関数
  const handleNumberChange = (field: string, value: string) => {
    onFieldChange?.(field, value ? Number(value) : undefined);
  };

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
          <InfoCard label="施設の種類" value={dormitoryType || '-'} />
          <InfoCard label="設立年" value={establishedYear || '-'} />
          <div className={styles.infoCard}>
            <label className={styles.label} htmlFor="capacity">
              施設定員
            </label>
            <div className={styles.capacityInputs}>
              <NumberInputField
                id="capacity"
                label="定員"
                value={capacity}
                placeholder="定員"
                error={getError('capacity')}
                onChange={(value) => handleNumberChange('capacity', value)}
              />
              <NumberInputField
                id="provisionalCapacity"
                label="暫定定員"
                value={provisionalCapacity}
                placeholder="暫定定員"
                error={getError('provisionalCapacity')}
                onChange={(value) => handleNumberChange('provisionalCapacity', value)}
              />
            </div>
          </div>
          <AnnexCard annexFacilities={annexFacilities} annexText={annexText} />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.basicInfoSection}>
      <div className={styles.gridContainer}>
        <InfoCard label="施設の種類" value={dormitoryType || '-'} />
        <InfoCard label="設立年" value={establishedYear || '-'} />
        <InfoCard label="施設定員" value={capacityText} />
        <AnnexCard annexFacilities={annexFacilities} annexText={annexText} />
      </div>
    </section>
  );
};
