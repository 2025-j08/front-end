import { MouseEvent } from 'react';

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
  /** URLエラーメッセージ */
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
 */
const getUrlValidationError = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined;

  // 空でない場合は形式を検証
  if (!isValidUrl(url)) {
    return 'http:// または https:// で始まる有効なURLを入力してください';
  }

  return undefined;
};

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

  const handleWebClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!hasValidWebsite) {
      e.preventDefault();
    }
  };

  // URL入力時のバリデーション
  const handleUrlChange = (newUrl: string) => {
    onUrlChange?.(newUrl);
    // バリデーションエラーはonUrlChangeの外側で管理
    // （親コンポーネント側でgetError('websiteUrl')で取得）
  };

  const validationError = getUrlValidationError(websiteUrl);

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
        {showWebButton && (
          <a
            href={hasValidWebsite ? (websiteUrl ?? undefined) : undefined}
            className={styles.webButton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="施設Webサイトを新しいタブで開く"
            aria-disabled={!hasValidWebsite}
            tabIndex={hasValidWebsite ? undefined : -1}
            onClick={handleWebClick}
          >
            施設Webサイト
          </a>
        )}
        {isEditMode && (
          <div className={styles.websiteWrapper}>
            <input
              type="text"
              className={styles.urlInput}
              value={websiteUrl ?? ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com"
              aria-label="施設WebサイトURL"
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'url-error' : undefined}
            />
            <span className={styles.helpText}>施設のWebサイトがあればURLを入力してください</span>
            {validationError && (
              <span className={styles.errorText} id="url-error">
                {validationError}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
