/**
 * FormButton 共通コンポーネント
 * 認証フォーム共通の送信ボタン
 * 内部で共通の Button コンポーネントを使用するようにリファクタリングしました。
 */
import styles from './formButton.module.scss';

import { Button } from '@/components/ui/Button';

/**
 * FormButtonコンポーネントのProps
 */
export interface FormButtonProps {
  /** ボタンのラベルテキスト */
  label?: string;
  /** ローディング中のラベルテキスト */
  loadingLabel?: string;
  /** ローディング状態 */
  isLoading?: boolean;
  /** 無効化状態 */
  disabled?: boolean;
  /** ボタンのタイプ */
  type?: 'submit' | 'button' | 'reset';
  /** 追加のクラス名 */
  className?: string;
}

const FormButton = ({
  label = '送信',
  loadingLabel = '処理中...',
  isLoading = false,
  disabled = false,
  type = 'submit',
  className = '',
}: FormButtonProps) => {
  return (
    <div className={styles.buttonContainer}>
      <Button
        type={type}
        variant="primary"
        size="lg"
        isLoading={isLoading}
        loadingLabel={loadingLabel}
        disabled={disabled}
        fullWidthMobile
        className={className}
      >
        {label}
      </Button>
    </div>
  );
};

export { FormButton };
