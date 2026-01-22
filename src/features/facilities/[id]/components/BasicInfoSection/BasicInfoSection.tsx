import type { AnnexFacility, DormitoryType } from '@/types/facility';
import { FACILITY_TYPE_OPTIONS } from '@/const/searchConditions';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

import { formatCapacity } from '../../utils/formatters';
import { InfoCard } from './InfoCard';
import { AnnexCard } from './AnnexCard';
import { CapacityInput } from './CapacityInput';
import { AnnexFacilityEditor } from './AnnexFacilityEditor';
import styles from './BasicInfoSection.module.scss';

type BasicInfoSectionProps = {
  dormitoryType?: DormitoryType[];
  establishedYear?: string;
  capacity?: number;
  provisionalCapacity?: number;
  annexFacilities?: AnnexFacility[];
  phone?: string;
  corporation?: string;
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
  corporation,
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

  // 施設種類の共通ラベル定義
  const facilityTypeLabel = (
    <span className={styles.label}>
      施設の種類
      <InfoTooltip
        content={
          <div style={{ padding: '4px 0' }}>
            <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>施設の運営形態による区分</p>

            <div style={{ marginBottom: '10px' }}>
              <strong>・大舎（1舎20人以上）</strong>
              <p style={{ margin: '4px 0 0 1em', fontSize: '0.85em', lineHeight: '1.5', color: '#666' }}>
                多くの児童が生活する伝統的な形態です。集団生活が中心となります。
              </p>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <strong>・中舎（1舎13〜19人）</strong>
              <p style={{ margin: '4px 0 0 1em', fontSize: '0.85em', lineHeight: '1.5', color: '#666' }}>
                大舎より小規模で、区画ごとの生活集団により家庭的な雰囲気を重視しています。
              </p>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <strong>・小舎（1舎12人以下）</strong>
              <p style={{ margin: '4px 0 0 1em', fontSize: '0.85em', lineHeight: '1.5', color: '#666' }}>
                少人数単位での生活により、職員との愛着形成やきめ細かい個別ケアがしやすい環境です。
              </p>
            </div>

            <div>
              <strong>・グループホーム（6人程度）</strong>
              <p style={{ margin: '4px 0 0 1em', fontSize: '0.85em', lineHeight: '1.5', color: '#666' }}>
                地域の一般住宅などを利用した小規模な形態です。最も家庭に近い環境で生活できます。
              </p>
            </div>
          </div>
        }
        ariaLabel="施設の種類についての詳細情報"
      />
    </span>
  );

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
            {facilityTypeLabel}
            <div className={styles.checkboxGroup} role="group" aria-label="施設の種類">
              {FACILITY_TYPE_OPTIONS.map((option) => {
                const isChecked = dormitoryType?.includes(option.value as DormitoryType) || false;
                const checkboxId = `dormitoryType-${option.value}`;
                return (
                  <label key={option.value} className={styles.checkboxLabel} htmlFor={checkboxId}>
                    <input
                      type="checkbox"
                      id={checkboxId}
                      name="dormitoryType"
                      className={styles.checkbox}
                      checked={isChecked}
                      onChange={(e) => {
                        const current = dormitoryType || [];
                        const newValue = e.target.checked
                          ? [...current, option.value as DormitoryType]
                          : current.filter((t) => t !== option.value);
                        onFieldChange?.('dormitoryType', newValue);
                      }}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.infoCard}>
            {facilityTypeLabel}
            {dormitoryType && dormitoryType.length > 0 ? (
              <ul className={styles.dormitoryTypeList}>
                {dormitoryType.map((type) => (
                  <li key={type} className={styles.dormitoryTypeItem}>
                    {type}
                  </li>
                ))}
              </ul>
            ) : (
              <span className={styles.value}>-</span>
            )}
          </div>
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

        {isEditMode ? (
          <AnnexCard annexFacilities={annexFacilities} isEditing={true}>
            <AnnexFacilityEditor annexFacilities={annexFacilities} onFieldChange={onFieldChange} />
          </AnnexCard>
        ) : (
          <AnnexCard annexFacilities={annexFacilities} annexText={annexText} />
        )}
      </div>
    </section>
  );
};
