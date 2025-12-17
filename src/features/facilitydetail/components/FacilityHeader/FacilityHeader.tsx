import styles from './FacilityHeader.module.scss';

type FacilityHeaderProps = {
  name: string;
  corporation: string;
  address: string;
  tel: string;
  websiteUrl?: string;
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
  websiteUrl = '#',
}: FacilityHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInfo}>
        <h1 className={styles.title}>
          {name} <span className={styles.corporation}>運営法人 {corporation}</span>
        </h1>
        <p className={styles.address}>{address}</p>
        <p className={styles.tel}>TEL {tel}</p>
      </div>
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
    </header>
  );
};
