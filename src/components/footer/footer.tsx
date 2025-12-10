import Link from 'next/link';

import styles from './footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 左側：サイト情報 */}
        <div className={styles.infoArea}>
          <h2 className={styles.siteName}>サイト名前</h2>
          <div className={styles.addressInfo}>
            <p>〒xxx-xxxx</p>
            <p>xx県xx市xx.....</p>
            <p>TEL xxx-xxxx-xxxx</p>
          </div>
        </div>

        {/* 右側：ナビゲーション */}
        <nav className={styles.nav}>
          <Link href="/features/facilities/search" className={styles.navLink}>
            施設を探す
          </Link>
          <Link href="/features/facilities" className={styles.navLink}>
            施設一覧
          </Link>
          <Link href="/features/auth" className={styles.navLink}>
            ログイン
          </Link>
          <Link href="/features/contact" className={styles.navLink}>
            お問い合わせ
          </Link>
        </nav>
      </div>
    </footer>
  );
};
