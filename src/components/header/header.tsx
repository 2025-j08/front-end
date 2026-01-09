'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import styles from './header.module.scss';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            {/* 【追加】管理メニュー */}
            <div className={styles.menuWrapper} ref={menuRef}>
              <button
                type="button"
                className={`${styles.navItem} ${styles.menuTrigger}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <SettingsOutlinedIcon className={styles.icon} />
                <span>管理メニュー</span>
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <Link
                    href="/admin/user-issuance"
                    className={styles.dropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ユーザー発行
                  </Link>
                  <Link
                    href="/admin/users"
                    className={styles.dropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ユーザー管理
                  </Link>
                  <Link
                    href="/admin/facilities"
                    className={styles.dropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    施設管理
                  </Link>
                  <Link
                    href="/admin/facilities/edit"
                    className={styles.dropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    施設情報編集
                  </Link>
                </div>
              )}
            </div>
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
