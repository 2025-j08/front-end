import styles from './FacilityHeader.module.scss';

type FacilityHeaderProps = {
  name: string;
  corporation?: string;
  fullAddress: string;
  phone: string;
  websiteUrl?: string | null;
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** 編集モード切り替えハンドラー */
  onEditModeToggle?: () => void;
  /** 保存中かどうか */
  isSaving?: boolean;
  /** 未保存の変更があるか */
  isDirty?: boolean;
  /** 保存ハンドラー */
  onSave?: () => void;
  /** キャンセルハンドラー */
  onCancel?: () => void;
};

/**
 * URLが有効かどうかを検証する
 * http/https スキームのみ許可し、javascript: などの危険なスキームを拒否
 */
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || url === '#') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * 施設詳細ページのヘッダーセクション
 * 施設名、運営法人、住所、TEL、Webサイトボタン、編集ボタンを表示
 */
export const FacilityHeader = ({
  name,
  corporation,
  fullAddress,
  phone,
  websiteUrl,
  isEditMode = false,
  onEditModeToggle,
  isSaving = false,
  isDirty = false,
  onSave,
  onCancel,
}: FacilityHeaderProps) => {
  const hasValidWebsite = isValidUrl(websiteUrl);

  return (
    <header className={styles.header}>
      <div className={styles.headerInfo}>
        <h1 className={styles.title}>
          {name}
          {corporation && <span className={styles.corporation}>運営法人 {corporation}</span>}
          {isEditMode && isDirty && (
            <span className={styles.dirtyIndicator} role="status" aria-live="polite">
              ● 未保存の変更があります
            </span>
          )}
        </h1>
        <p className={styles.address}>{fullAddress}</p>
        <p className={styles.tel}>TEL {phone}</p>
      </div>
      <div className={styles.headerAction}>
        {hasValidWebsite && !isEditMode && (
          <a
            href={websiteUrl ?? undefined}
            className={styles.webButton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="施設Webサイトを新しいタブで開く"
          >
            施設Webサイト
          </a>
        )}
        {isEditMode ? (
          <>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={isSaving}
            >
              キャンセル
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={onSave}
              disabled={isSaving || !isDirty}
              aria-busy={isSaving}
              aria-live="polite"
            >
              {isSaving ? '保存中...' : '保存する'}
            </button>
          </>
        ) : (
          <button
            type="button"
            className={styles.editButton}
            onClick={onEditModeToggle}
            aria-label="施設情報を編集する"
          >
            編集
          </button>
        )}
      </div>
    </header>
  );
};
