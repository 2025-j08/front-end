/**
 * SuccessOverlay 共通コンポーネント
 * フォーム送信成功時のオーバーレイ
 */
import styles from './successOverlay.module.scss';

/**
 * SuccessOverlayコンポーネントのProps
 */
export interface SuccessOverlayProps {
  /** 表示するテキスト */
  text?: string;
  /** オーバーレイの表示状態 */
  isVisible: boolean;
}

const SuccessOverlay = ({ text = '送信が完了しました', isVisible }: SuccessOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">
        ✓
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export { SuccessOverlay };
