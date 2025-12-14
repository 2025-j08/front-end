import Link from 'next/link';

import styles from './footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 左側：サイト情報 */}
        <div className={styles.infoArea}>
          <strong className={styles.siteName}>近畿児童養護施設データベース</strong>
          <div className={styles.addressInfo}>
            <p>〒542-0065</p>
            <p>大阪府大阪市中央区中寺1丁目1番54号 大阪社会福祉指導センター内</p>
            <p>TEL 06-6762-9001</p>
          </div>
        </div>

        {/* 右側：ナビゲーション */}
        <nav className={styles.nav} aria-label="Footer navigation">
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
