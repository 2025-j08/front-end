/**
 * フォームフィールド共通の型定義
 */

/** すべてのフォームフィールドで共通のプロパティ */
export interface BaseFieldProps {
  /** フィールドのラベル名 */
  label: string;
  /** 一意の識別子 */
  id: string;
  /** フォーム送信時のキー名 */
  name: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 必須フィールドかどうか */
  required?: boolean;
  /** 入力の最大文字数 */
  maxLength?: number;
  /** 入力フィールドの値 */
  value?: string;
}

/** アクセシビリティ関連の共通プロパティ */
export interface AccessibilityProps {
  /** エラーメッセージやヘルプテキストのID（aria-describedby用） */
  ariaDescribedBy?: string;
  /** 検証エラーがあるかどうか */
  ariaInvalid?: boolean;
}
