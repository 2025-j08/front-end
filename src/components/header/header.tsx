import Link from 'next/link';

import styles from './header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* 左側：ロゴ */}
        <Link href="/" className={styles.logoWrapper}>
          <span className={styles.logoText}>logo</span>
        </Link>

        {/* 右側：ナビゲーション */}
        <nav className={styles.nav}>
          {/* ログイン (Google Material Icon: login) */}
          <Link href="/features/auth" className={styles.navItem}>
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
            </svg>
            <span>ログイン</span>
          </Link>

          {/* お問い合わせ (Google Material Icon: contact_support) */}
          <Link href="/features/contact" className={styles.navItem}>
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
            >
              <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5l3.5 3.5 1.6-1.6V19c3.04-.6 5.4-3.3 5.4-6.5 0-4.69-3.81-8.5-8.5-8.5zM12 17h-1v-2h1v2zm1-4.4c-.6.4-1 .8-1 1.4v.5h-2v-.5c0-1.1.9-2 2-2h.5c.6 0 1-.4 1-1 0-.6-.4-1-1-1s-1 .4-1 1h-2c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.1-.9 2-2 2.5z" />
            </svg>
            <span>お問い合わせ</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
