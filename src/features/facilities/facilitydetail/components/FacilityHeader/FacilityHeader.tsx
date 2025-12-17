import styles from './FacilityHeader.module.scss';

type FacilityHeaderProps = {
  name: string;
  corporation: string;
  address: string;
  tel: string;
  websiteUrl?: string;
};

/**
 * URLが有効かどうかを検証する
 * http/https スキームのみ許可し、javascript: などの危険なスキームを拒否
 */
const isValidUrl = (url: string | undefined): boolean => {
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
 * 施設名、運営法人、住所、TEL、Webサイトボタンを表示
 */
export const FacilityHeader = ({
  name,
  corporation,
  address,
  tel,
  websiteUrl,
}: FacilityHeaderProps) => {
  const hasValidWebsite = isValidUrl(websiteUrl);

  return (
    <header className={styles.header}>
      <div className={styles.headerInfo}>
        <h1 className={styles.title}>
          {name} <span className={styles.corporation}>運営法人 {corporation}</span>
        </h1>
        <p className={styles.address}>{address}</p>
        <p className={styles.tel}>TEL {tel}</p>
      </div>
      {hasValidWebsite && (
        <div className={styles.headerAction}>
          <a
            href={websiteUrl}
            className={styles.webButton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="施設Webサイトを新しいタブで開く"
          >
            施設Webサイト
          </a>
        </div>
      )}
    </header>
  );
};
