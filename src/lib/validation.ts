/**
 * パスワードバリデーション用の共通関数と定数
 */

/**
 * メールアドレスの正規表現パターン（RFC準拠）
 *
 * ローカル部（@の前）:
 * - 英数字で開始・終了（_, -, +は中間のみ許可、.は連続不可・先頭末尾不可）
 * ドメイン部（@の後）:
 * - 各ラベルは英数字で開始・終了（ハイフンは中間のみ）
 * - 連続するドットを禁止
 * - TLDは2文字以上の英字のみ
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

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
