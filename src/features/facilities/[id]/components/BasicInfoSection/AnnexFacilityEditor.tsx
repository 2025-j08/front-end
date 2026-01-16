import type { AnnexFacility } from '@/types/facility';

import styles from './BasicInfoSection.module.scss';

/** ゴミ箱アイコン（削除ボタン用） */
const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/** 併設施設編集コンポーネント */
type AnnexFacilityEditorProps = {
  annexFacilities: AnnexFacility[] | undefined;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const AnnexFacilityEditor = ({
  annexFacilities,
  onFieldChange,
}: AnnexFacilityEditorProps) => {
  const items = annexFacilities || [];

  const handleItemChange = (index: number, field: 'name' | 'type', value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onFieldChange?.('annexFacilities', newItems);
  };

  const handleAddItem = () => {
    const newItems = [...items, { name: '', type: '' }];
    onFieldChange?.('annexFacilities', newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onFieldChange?.('annexFacilities', newItems);
  };

  return (
    <div className={styles.annexEditor}>
      {items.length === 0 ? (
        <span className={styles.value}>-</span>
      ) : (
        items.map((item, index) => (
          <div key={index} className={styles.annexItem}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.annexInput}
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                placeholder="施設名"
                aria-label={`併設施設${index + 1}の名前`}
              />
              <input
                type="text"
                className={styles.annexInput}
                value={item.type}
                onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                placeholder="種別"
                aria-label={`併設施設${index + 1}の種別`}
              />
            </div>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleRemoveItem(index)}
              aria-label={`併設施設${index + 1}を削除`}
            >
              <TrashIcon />
            </button>
          </div>
        ))
      )}
      <button type="button" className={styles.addButton} onClick={handleAddItem}>
        + 施設を追加
      </button>
    </div>
  );
};
