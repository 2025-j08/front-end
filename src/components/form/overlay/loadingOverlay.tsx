/**
 * LoadingOverlay 共通コンポーネント
 * フォーム送信中のオーバーレイ
 */
import { LoadingSpinner } from '../spinner';
import styles from './loadingOverlay.module.scss';

/**
 * LoadingOverlayコンポーネントのProps
 */
export interface LoadingOverlayProps {
  /** 表示するテキスト */
  text?: string;
  /** オーバーレイの表示状態 */
  isVisible: boolean;
}

const LoadingOverlay = ({ text = '処理中...', isVisible }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-busy="true">
      <LoadingSpinner size="medium" />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export { LoadingOverlay };
