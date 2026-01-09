'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { SvgIconComponent } from '@mui/icons-material';

import styles from './header.module.scss';

// ナビゲーション項目の定義
type NavItem = {
  label: string;
  href: string;
  icon: SvgIconComponent;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'ログイン', href: '/features/auth', icon: LoginOutlinedIcon },
  { label: 'お問い合わせ', href: '/features/contact', icon: ContactSupportOutlinedIcon },
];

// 管理メニュー項目の定義
type AdminMenuItem = {
  label: string;
  href: string;
};

const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  { label: 'ユーザー発行', href: '/admin/user-issuance' },
  { label: 'ユーザー管理', href: '/admin/users' },
  { label: '施設管理', href: '/admin/facilities' },
  { label: '施設情報編集', href: '/admin/facilities/edit' },
];

/**
 * クリックアウトサイドフック
 * 指定した要素の外側をクリックした際にコールバックを実行
 */
const useClickOutside = (ref: React.RefObject<HTMLElement | null>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // refが存在し、かつクリックされた要素がrefの内側でない場合
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // カスタムフックを使用してメニュー外クリックを検知して閉じる
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      {/* 上部ナビゲーションエリア */}
      <div className={styles.headerTop}>
        <div className={styles.container}>
          {/* 左側：ロゴ */}
          <Link href="/" className={styles.logoWrapper} aria-label="トップページへ">
            <span className={styles.logoText}>logo</span>
          </Link>

          {/* 右側：ナビゲーション */}
          <nav className={styles.nav}>
            {/* 通常ナビゲーション項目 */}
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navItem}>
                <item.icon className={styles.icon} />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* 管理メニュー（ドロップダウン） */}
            <div className={styles.menuWrapper} ref={menuRef}>
              <button
                type="button"
                className={`${styles.navItem} ${styles.menuTrigger}`}
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                aria-label="管理メニューを開く"
              >
                <SettingsOutlinedIcon className={styles.icon} />
                <span>管理メニュー</span>
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown} role="menu">
                  {ADMIN_MENU_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.dropdownItem}
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* 下部：ヒーロー画像エリア (no image) */}
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
