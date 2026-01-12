/**
 * タブ保存ボタンコンポーネント
 * 各タブの編集モード時に表示される保存ボタン
 */

import styles from './TabContent.module.scss';

type TabSaveButtonProps = {
  onSave: () => Promise<void>;
  isSaving: boolean;
  isDirty: boolean;
};

export const TabSaveButton = ({ onSave, isSaving, isDirty }: TabSaveButtonProps) => {
  return (
    <div className={styles.tabSaveButtonContainer}>
      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || isSaving}
        className={styles.tabSaveButton}
      >
        {isSaving ? '保存中...' : '保存する'}
      </button>
    </div>
  );
};
