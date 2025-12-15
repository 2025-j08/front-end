/**
 * LoadingSpinner コンポーネント
 * 共有ローディングスピナー
 */
import styles from './loadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner = ({ size = 'medium', color = '#4a9f7e' }: LoadingSpinnerProps) => {
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
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="100"
        strokeDashoffset="25"
      />
    </svg>
  );
};

export { LoadingSpinner };
