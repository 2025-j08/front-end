import styles from './FacilityHeader.module.scss';

type FacilityHeaderProps = {
  name: string;
  corporation?: string;
  fullAddress: string;
  phone: string;
  websiteUrl?: string | null;
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** URL変更ハンドラー */
  onUrlChange?: (url: string) => void;
  /** URLエラーメッセージ（サーバー側バリデーション用） */
  urlError?: string;
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
 * URL入力値をリアルタイムで検証するヘルパー関数
 * 空文字列の場合はエラーなし（オプショナルフィールド）
 */
const getUrlValidationError = (url: string | undefined | null): string | undefined => {
  if (!url || url.trim() === '') return undefined;
  if (!isValidUrl(url)) {
    return 'http:// または https:// で始まる有効なURLを入力してください';
  }
  return undefined;
};

/**
 * 施設詳細ページのヘッダーセクション
 * 施設名、運営法人、住所、TEL、Webサイトボタンを表示
 */
export const FacilityHeader = ({
  name,
  corporation,
  fullAddress,
  phone,
  websiteUrl,
  isEditMode = false,
  onUrlChange,
  urlError,
}: FacilityHeaderProps) => {
  const hasValidWebsite = isValidUrl(websiteUrl);
  const showWebButton = isEditMode || hasValidWebsite;

  const handleUrlChange = (newUrl: string) => {
    onUrlChange?.(newUrl);
  };

  // エラーメッセージの優先順位: サーバー側エラー > クライアント側バリデーション
  const clientValidationError = getUrlValidationError(websiteUrl);
  const displayError = urlError || clientValidationError;

  return (
    <header className={styles.header}>
      <div className={styles.headerInfo}>
        <h1 className={styles.title}>
          {name}
          {corporation && <span className={styles.corporation}>運営法人 {corporation}</span>}
        </h1>
        <p className={styles.address}>{fullAddress}</p>
        <p className={styles.tel}>TEL {phone}</p>
      </div>
      <div className={styles.headerAction}>
        {showWebButton &&
          (hasValidWebsite ? (
            <a
              href={websiteUrl ?? undefined}
              className={styles.webButton}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="施設Webサイトを新しいタブで開く"
            >
              施設Webサイト
            </a>
          ) : (
            isEditMode && (
              <button
                type="button"
                className={styles.webButton}
                disabled
                aria-label="施設Webサイトは未設定です"
              >
                施設Webサイト
              </button>
            )
          ))}
        {isEditMode && (
          <div className={styles.websiteWrapper}>
            <input
              type="text"
              className={styles.urlInput}
              value={websiteUrl ?? ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com"
              aria-label="施設WebサイトURL"
              aria-invalid={!!displayError}
              aria-describedby={displayError ? 'url-error' : undefined}
            />
            <span className={styles.helpText}>施設のWebサイトがあればURLを入力してください</span>
            {displayError && (
              <span className={styles.errorText} id="url-error" role="alert">
                {displayError}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
