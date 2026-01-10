/**
 * パスワードバリデーション用の共通関数と定数
 */

/**
 * メールアドレスの正規表現パターン（安全重視・実用的な検証用）
 *
 * 注意: RFC 5322に完全準拠していません（引用符で囲まれたローカル部、
 * コメント構文、IPアドレス形式のドメインなどには非対応）。
 * 一般的なメールアドレス形式の検証には十分です。
 *
 * 設計方針:
 * - セキュリティ重視のホワイトリスト方式
 * - 最終的な有効性はメール送信時に検証される前提
 * - インジェクションリスクのある記号はローカル部では不許可
 *
 * ローカル部（@の前）:
 * - 許可文字: 英数字 + `.`, `_`, `+`, `-` のみ
 * - 連続するドットは禁止
 * - 先頭・末尾のドットは禁止
 *
 * ドメイン部（@の後）:
 * - 英数字とハイフンを許可（ハイフンは先頭・末尾では禁止）
 * - 最低1つのドットが必要
 * - TLDは2文字以上の英字（.com、.museum、.technology など）
 * - 国際化ドメイン名（IDN）には非対応
 *
 * セキュリティ上の注意:
 * - 一般に RFC 5322 で有効な特殊記号のうち、`!#$%&'*=/=?^`{|}~` は
 *   DB/コマンド文脈での誤用やインジェクションリスクを高めるため不許可。
 * - 本正規表現はローカル部を [a-zA-Z0-9._+-] のみに限定し、実運用に十分な範囲に絞っています。
 * - もしレガシーなアドレス形式の許容が必要になった場合は、別途"拡張モード"の導入を検討してください。
 */
// 安全重視版のメール正規表現
// - ローカル部: 英数字と . _ + - のみ、連続ドット/先頭末尾ドット不可
// - ドメイン: サブドメイン可、ハイフンはラベル先頭/末尾不可、TLDは2文字以上の英字
export const EMAIL_REGEX = new RegExp(
  // ローカル部
  String.raw`^(?:[A-Za-z0-9](?:[A-Za-z0-9_+\.-]*[A-Za-z0-9])?)` +
    // @
    String.raw`@` +
    // ドメインラベル（先頭末尾にハイフン不可）を1つ以上、最後はTLD
    // 例: example.com, a-b.example.co.jp
    String.raw`(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+` +
    // TLD（2文字以上の英字）
    String.raw`[A-Za-z]{2,}$`,
);

/**
 * パスワード要件の定数
 */
export const PASSWORD_REQUIREMENTS = {
  /** 最小文字数 */
  MIN_LENGTH: 8,
  /** 必要な文字種の数（大文字・小文字・数字から） */
  MIN_CHARACTER_TYPES: 2,
} as const;

/**
 * バリデーション結果の型
 */
export interface PasswordValidationResult {
  /** バリデーションが成功したかどうか */
  isValid: boolean;
  /** エラーメッセージの配列 */
  errors: string[];
}

/**
 * パスワードの詳細バリデーション（登録フォーム用）
 * 8文字以上 + 大文字・小文字・数字から2種類以上を含む
 * @param password - 検証するパスワード
 * @returns バリデーション結果
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // 最小文字数チェック
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`パスワードは${PASSWORD_REQUIREMENTS.MIN_LENGTH}文字以上で入力してください`);
  }

  // 文字種のチェック（大文字・小文字・数字から2種類以上）
  let characterTypeCount = 0;
  if (/[A-Z]/.test(password)) characterTypeCount++;
  if (/[a-z]/.test(password)) characterTypeCount++;
  if (/\d/.test(password)) characterTypeCount++;

  if (characterTypeCount < PASSWORD_REQUIREMENTS.MIN_CHARACTER_TYPES) {
    errors.push('大文字・小文字・数字から2種類以上を含めてください');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * パスワード要件の説明テキストを生成
 * @returns 要件説明テキスト
 */
export const getPasswordRequirementsText = (): string => {
  return `${PASSWORD_REQUIREMENTS.MIN_LENGTH}文字以上、大文字・小文字・数字から2種類以上`;
};

/**
 * 汎用バリデーション結果の型
 */
export interface ValidationResult {
  /** バリデーションが成功したかどうか */
  isValid: boolean;
  /** エラーメッセージ */
  error?: string;
}

/**
 * メールアドレスのバリデーション
 * @param email - 検証するメールアドレス
 * @param fieldName - フィールド名（エラーメッセージ用、デフォルト: 'メールアドレス'）
 * @returns バリデーション結果
 */
export const validateEmail = (
  email: string,
  fieldName: string = 'メールアドレス',
): ValidationResult => {
  const trimmed = email.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: `${fieldName}を入力してください`,
    };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: `有効な${fieldName}を入力してください`,
    };
  }
  return { isValid: true };
};

/**
 * 必須入力バリデーション
 * @param value - 検証する値
 * @param fieldName - フィールド名（エラーメッセージ用）
 * @returns バリデーション結果
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return {
      isValid: false,
      error: `${fieldName}を入力してください`,
    };
  }
  return { isValid: true };
};

/**
 * パスワード一致バリデーション
 * @param password - パスワード
 * @param confirmPassword - 確認用パスワード
 * @returns バリデーション結果
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'パスワードが一致しません',
    };
  }
  return { isValid: true };
};
