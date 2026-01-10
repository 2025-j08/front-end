/**
 * LoadingSpinner コンポーネント
 * 共有ローディングスピナー
 */
import styles from './loadingSpinner.module.scss';

/**
 * LoadingSpinnerコンポーネントのProps
 */
export interface LoadingSpinnerProps {
  /** スピナーのサイズ */
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeMap = {
    small: 24,
    medium: 48,
    large: 64,
  };
  const pixelSize = sizeMap[size];

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.spinner}
      role="img"
      aria-label="読み込み中"
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="100"
        strokeDashoffset="25"
      />
    </svg>
  );
};

export { LoadingSpinner };
