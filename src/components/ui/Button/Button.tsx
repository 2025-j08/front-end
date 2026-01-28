import Link, { LinkProps } from 'next/link';
import React from 'react';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  /** ボタンのスタイルバリアント */
  variant?: ButtonVariant;
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** 無効化状態かどうか */
  disabled?: boolean;
  /** ローディング状態かどうか */
  isLoading?: boolean;
  /** ローディング中に表示するラベル（省略時は children を表示） */
  loadingLabel?: string;
  /** 幅を 100% にするかどうか */
  fullWidth?: boolean;
  /** モバイル表示時に幅を 100% にするかどうか */
  fullWidthMobile?: boolean;
  /** ボタン内に表示するアイコン */
  icon?: React.ReactNode;
  /** ボタンのラベルやコンテンツ */
  children?: React.ReactNode;
}

/**
 * hrefがない場合は通常のbutton要素として振る舞う型定義
 */
type ButtonAsButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    /** 遷移先URL（buttonとして使用する場合は指定不可） */
    href?: never;
  };

/**
 * hrefがある場合はNext.jsのLinkコンポーネントとして振る舞う型定義
 */
type ButtonAsLinkProps = BaseProps &
  LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    /** 遷移先URL */
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * 共通ボタンコンポーネント
 *
 * - hrefプロパティがある場合はNext.jsのLinkコンポーネントとして動作します
 * - hrefがない場合は通常のbuttonとして動作します
 * - 複数のバリアント（primary, secondary, danger, outline）とサイズをサポート
 * - ローディング状態の表示機能を内蔵
 *
 * 使用例:
 * ```tsx
 * // ボタンとして
 * <Button variant="primary" onClick={handleClick}>送信</Button>
 *
 * // リンクとして
 * <Button href="/about" variant="secondary">詳細へ</Button>
 *
 * // アイコン付き・ローディング状態
 * <Button icon={<SaveIcon />} isLoading={isSubmitting}>保存</Button>
 *
 * // 無効化されたリンク（spanとしてレンダリングされる）
 * <Button href="/about" disabled>詳細へ</Button>
 * ```
 *
 * @component
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  loadingLabel,
  fullWidth = false,
  fullWidthMobile = false,
  icon,
  className = '',
  ...props
}) => {
  const buttonClassNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    fullWidthMobile ? styles.fullWidthMobile : '',
    isLoading || disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {isLoading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{loadingLabel || children}</span>
        </>
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {children}
        </>
      )}
    </>
  );

  // Linkとしてレンダリングする場合
  if ('href' in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLinkProps;

    // 無効化時またはローディング時はspanとしてレンダリング（アクセシビリティ対応）
    if (disabled || isLoading) {
      return (
        <span className={buttonClassNames} aria-disabled="true">
          {content}
        </span>
      );
    }

    return (
      <Link href={href} className={buttonClassNames} {...linkProps}>
        {content}
      </Link>
    );
  }

  // 通常のbuttonとしてレンダリングする場合
  const { type = 'button', ...buttonProps } = props as ButtonAsButtonProps;

  return (
    <button
      type={type}
      className={buttonClassNames}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...buttonProps}
    >
      {content}
    </button>
  );
};
