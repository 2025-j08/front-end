/**
 * タブコンポーネントの共通Props型定義
 * 全てのタブコンポーネントで共通して使用される基本的なプロパティを定義
 */

/**
 * 汎用タブコンポーネントのProps型
 * @template T - タブコンポーネントが扱うデータ型（AccessInfo, PhilosophyInfo等）
 */
export type TabProps<T> = {
  /** タブが表示するデータ */
  data: T;
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** フィールド変更時のコールバック関数 */
  onFieldChange?: (field: string, value: unknown) => void;
  /** エラーメッセージのマップ（フィールド名 -> エラーメッセージ） */
  errors?: Record<string, string>;
  /** 指定されたフィールドのエラーメッセージを取得する関数 */
  getError?: (field: string) => string | undefined;
  /** 保存ハンドラー */
  onSave?: () => Promise<void>;
  /** 保存中フラグ */
  isSaving?: boolean;
  /** 変更されたか */
  isDirty?: boolean;
};
