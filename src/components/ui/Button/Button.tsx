import Link from 'next/link';
import React from 'react';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  fullWidthMobile?: boolean;
  icon?: React.ReactNode;
  href?: string;
}

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
  disabled,
  href,
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

  if (href) {
    return (
      <Link href={href} className={buttonClassNames} {...(props as any)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={buttonClassNames}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {content}
    </button>
  );
};
