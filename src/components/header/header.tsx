'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { SvgIconComponent } from '@mui/icons-material';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useCurrentUser, type UserRole } from '@/hooks/useCurrentUser';

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
  href: string | ((facilityId: number | null) => string);
  allowedRoles: UserRole[];
};

const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  { label: 'ユーザー発行', href: '/admin/user-issuance', allowedRoles: ['admin'] },
  { label: 'ユーザー管理', href: '/admin/users', allowedRoles: ['admin'] },
  { label: '施設管理', href: '/admin/facilities', allowedRoles: ['admin'] },
  {
    label: '施設情報編集',
    href: (facilityId) => (facilityId ? `/features/facilities/${facilityId}/edit` : '#'),
    allowedRoles: ['staff'],
  },
];

// メニューのID定義（aria-controls用）
const ADMIN_MENU_ID = 'admin-menu-dropdown';

/**
 * ヘッダーコンポーネント
 *
 * アプリケーション全体のナビゲーションとロゴを表示します。
 * クライアントサイドでのインタラクション（ドロップダウンメニューなど）を含みます。
 * 管理メニューへのアクセス機能を提供します。
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null); // トリガーボタンへの参照

  // ユーザー情報を取得
  const { isLoggedIn, role, facilityId } = useCurrentUser();

  // 権限に応じた管理メニュー項目をフィルタリング
  const filteredMenuItems = useMemo(() => {
    if (!role) return [];
    return ADMIN_MENU_ITEMS.filter((item) => item.allowedRoles.includes(role));
  }, [role]);

  // 管理メニューを表示するかどうか（ログイン済みかつメニュー項目がある場合）
  const showAdminMenu = isLoggedIn && filteredMenuItems.length > 0;

  // カスタムフックを使用してメニュー外クリックを検知して閉じる
  // NOTE: menuRefはトリガーボタンを含むラッパー要素に設定しています。
  // これにより、トリガーボタン自体をクリックした場合はuseClickOutsideが発火せず（内側と判定される）、
  // ボタン自身のonClickハンドラーによるトグル動作のみが実行される意図的な設計となっています。
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // メニューが開いたときに最初の項目にフォーカスを移動
  useEffect(() => {
    if (isMenuOpen) {
      // requestAnimationFrameを使用してDOM描画後に確実にフォーカスを設定
      requestAnimationFrame(() => {
        const firstItem = menuRef.current?.querySelector('[role="menuitem"]') as HTMLElement;
        firstItem?.focus();
      });
    }
  }, [isMenuOpen]);

  // フォーカスが外れた場合（Tab移動など）にメニューを閉じる
  const handleBlur = (e: React.FocusEvent) => {
    // 新しいフォーカス先がメニューの外側であれば閉じる
    if (menuRef.current && !menuRef.current.contains(e.relatedTarget as Node)) {
      setIsMenuOpen(false);
    }
  };

  // キーボード操作のハンドリング
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // メニューが開いていない状態で下矢印キーが押されたらメニューを開く
    if (!isMenuOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsMenuOpen(true);
      }
      return;
    }

    // メニュー内の項目を取得
    const items = Array.from(
      menuRef.current?.querySelectorAll('[role="menuitem"]') || [],
    ) as HTMLElement[];
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case ' ': // Spaceキー対応 (Point 1)
        // role="menuitem" のリンク上でSpaceキーが押された場合、クリック動作をエミュレート
        if (currentIndex !== -1) {
          e.preventDefault(); // ページスクロールを防ぐ
          items[currentIndex].click();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsMenuOpen(false);
        triggerRef.current?.focus(); // トリガーボタンにフォーカスを戻す
        break;
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex =
          currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
        items[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Tab':
        // Tabキーの場合はデフォルトの挙動（次の要素へフォーカス移動）を許可し、
        // onBlurイベントによってメニューが閉じるようにする
        setIsMenuOpen(false);
        break;
    }
  };

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
            {showAdminMenu && (
              <div
                className={styles.menuWrapper}
                ref={menuRef}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  className={`${styles.navItem} ${styles.menuTrigger}`}
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                  aria-controls={ADMIN_MENU_ID}
                  aria-label={isMenuOpen ? '管理メニューを閉じる' : '管理メニューを開く'}
                >
                  <SettingsOutlinedIcon className={styles.icon} />
                  <span>管理メニュー</span>
                </button>

                {isMenuOpen && (
                  <div id={ADMIN_MENU_ID} className={styles.dropdown} role="menu">
                    {filteredMenuItems.map((item) => {
                      const href =
                        typeof item.href === 'function' ? item.href(facilityId) : item.href;
                      return (
                        <Link
                          key={item.label}
                          href={href}
                          className={styles.dropdownItem}
                          onClick={() => setIsMenuOpen(false)}
                          role="menuitem"
                          tabIndex={-1}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* 下部：ヒーロー画像エリア */}
      <div className={styles.heroArea}>
        <Image
          src="/images/herotest.png"
          alt="メインビジュアル"
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="100vw"
        />
      </div>
    </header>
  );
};
