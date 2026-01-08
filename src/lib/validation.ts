/**
 * パスワードバリデーション用の共通関数と定数
 */

/**
 * パスワード要件の定数
 */
export const PASSWORD_REQUIREMENTS = {
  /** 最小文字数 */
  MIN_LENGTH: 8,
  /** 大文字を含む必要があるか */
  REQUIRE_UPPERCASE: true,
  /** 小文字を含む必要があるか */
  REQUIRE_LOWERCASE: true,
  /** 数字を含む必要があるか */
  REQUIRE_NUMBER: true,
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
 * @param password - 検証するパスワード
 * @returns バリデーション結果
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // 最小文字数チェック
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`パスワードは${PASSWORD_REQUIREMENTS.MIN_LENGTH}文字以上で入力してください`);
  }

  // 大文字チェック
  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('大文字を1文字以上含めてください');
  }

  // 小文字チェック
  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('小文字を1文字以上含めてください');
  }

  // 数字チェック
  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('数字を1文字以上含めてください');
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
  const requirements: string[] = [];

  requirements.push(`${PASSWORD_REQUIREMENTS.MIN_LENGTH}文字以上`);

  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE) {
    requirements.push('大文字を1文字以上');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE) {
    requirements.push('小文字を1文字以上');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER) {
    requirements.push('数字を1文字以上');
  }

  return requirements.join('、');
};

/**
 * フリガナバリデーション結果の型
 */
export interface FuriganaValidationResult {
  /** バリデーションが成功したかどうか */
  isValid: boolean;
  /** エラーメッセージ */
  error?: string;
}

/**
 * フリガナ（カタカナ）のバリデーション
 * 全角カタカナ、長音記号、中黒、スペースのみを許可
 * @param furigana - 検証するフリガナ
 * @returns バリデーション結果
 */
export const validateFurigana = (furigana: string): FuriganaValidationResult => {
  // 空文字の場合はバリデーションをスキップ（requiredは別途チェック）
  if (!furigana) {
    return { isValid: true };
  }

  // 全角カタカナ（ァ-ヶ）、長音記号（ー）、中黒（・）、全角スペース、半角スペースを許可
  const katakanaRegex = /^[ァ-ヶー・\s　]+$/;

  if (!katakanaRegex.test(furigana)) {
    return {
      isValid: false,
      error: 'フリガナはカタカナで入力してください',
    };
  }

  return { isValid: true };
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
