import Link from 'next/link';
// import Image from 'next/image';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

import styles from './header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.container}>
          {/* 左側：ロゴ */}
          <Link href="/" className={styles.logoWrapper}>
            <span className={styles.logoText}>logo</span>
          </Link>

          {/* 右側：ナビゲーション */}
          <nav className={styles.nav}>
            {/* ログイン */}
            <Link href="/features/auth" className={styles.navItem}>
              <LoginOutlinedIcon className={styles.icon} />
              <span>ログイン</span>
            </Link>

            {/* お問い合わせ */}
            <Link href="/features/contact" className={styles.navItem}>
              <ContactSupportOutlinedIcon className={styles.icon} />
              <span>お問い合わせ</span>
            </Link>
          </nav>
        </div>
      </div>
      {/* 下部：画像エリア (no image) */}
      <div className={styles.heroArea}>
        {/* <Image
          src="/images/hero.jpg"
          alt="メインビジュアル"
          fill
          style={{ objectFit: 'cover' }}
          priority
        /> */}

        <span className={styles.noImageText}>no image</span>
      </div>
    </header>
  );
};
