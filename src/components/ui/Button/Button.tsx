import Link, { LinkProps } from 'next/link';
import React from 'react';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  fullWidthMobile?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * hrefがない場合は通常のbutton要素として振る舞う型定義
 */
type ButtonAsButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

/**
 * hrefがある場合はNext.jsのLinkコンポーネントとして振る舞う型定義
 */
type ButtonAsLinkProps = BaseProps &
  LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * 共通ボタンコンポーネント
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
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
    return (
      <Link href={href} className={buttonClassNames} {...linkProps}>
        {content}
      </Link>
    );
  }

  // 通常のbuttonとしてレンダリングする場合
  const { disabled, type = 'button', ...buttonProps } = props as ButtonAsButtonProps;

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
