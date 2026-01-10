import { validateRequestBody, type ParseResult } from './validators';

/**
 * フィールドバリデーション関数の型
 */
type FieldValidator<T> = (value: unknown) => ValidationResult<T>;

/**
 * バリデーション結果型
 */
type ValidationResult<T> = { isValid: true; value: T } | { isValid: false; error: string };

/**
 * バリデーションスキーマの定義型
 */
type ValidationSchema<T> = {
  [K in keyof T]: {
    validator: FieldValidator<T[K]>;
    errorMessage: string;
  };
};

/**
 * 汎用的なリクエストボディバリデーター作成関数
 *
 * @param schema - バリデーションスキーマ
 * @returns リクエストボディをパースする関数
 *
 * @example
 * ```typescript
 * const validateSignIn = createValidator<SignInRequestBody>({
 *   email: {
 *     validator: (value) => {
 *       if (typeof value !== 'string') {
 *         return { isValid: false, error: '有効なメールアドレスを指定してください' };
 *       }
 *       const result = validateEmail(value);
 *       if (!result.isValid) {
 *         return { isValid: false, error: result.error ?? '有効なメールアドレスを指定してください' };
 *       }
 *       return { isValid: true, value: value.trim() };
 *     },
 *     errorMessage: '有効なメールアドレスを指定してください',
 *   },
 *   password: {
 *     validator: (value) => {
 *       if (typeof value !== 'string') {
 *         return { isValid: false, error: 'パスワードが不正です' };
 *       }
 *       const result = validatePassword(value);
 *       if (!result.isValid) {
 *         return { isValid: false, error: 'パスワードが不正です' };
 *       }
 *       return { isValid: true, value };
 *     },
 *     errorMessage: 'パスワードが不正です',
 *   },
 * });
 * ```
 */
export function createValidator<T extends Record<string, any>>(
  schema: ValidationSchema<T>,
): (body: unknown) => ParseResult<T> {
  return (body: unknown): ParseResult<T> => {
    // 基本的なJSONオブジェクト検証
    const bodyValidation = validateRequestBody(body);
    if (!bodyValidation.success) {
      return bodyValidation as ParseResult<T>;
    }

    const obj = bodyValidation.data;
    const result: Partial<T> = {};

    // 各フィールドをスキーマに従って検証
    for (const [key, fieldSchema] of Object.entries(schema) as [
      keyof T,
      ValidationSchema<T>[keyof T],
    ][]) {
      const value = obj[key as string];
      const validation = fieldSchema.validator(value);

      if (!validation.isValid) {
        return {
          success: false,
          message: validation.error || fieldSchema.errorMessage,
        };
      }

      result[key] = validation.value;
    }

    return { success: true, data: result as T };
  };
}

/**
 * 文字列フィールドのバリデーター作成ヘルパー
 *
 * @param validator - バリデーション関数
 * @param errorMessage - エラーメッセージ
 * @param trim - 文字列をトリムするか（デフォルト: true）
 * @returns フィールドバリデーター
 */
export function stringField(
  validator: (value: string) => { isValid: boolean; error?: string },
  errorMessage: string,
  trim = true,
): FieldValidator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { isValid: false, error: errorMessage };
    }

    const validationResult = validator(value);
    if (!validationResult.isValid) {
      return { isValid: false, error: validationResult.error ?? errorMessage };
    }

    return { isValid: true, value: trim ? value.trim() : value };
  };
}

/**
 * 正の整数フィールドのバリデーター作成ヘルパー
 *
 * @param errorMessage - エラーメッセージ
 * @returns フィールドバリデーター
 */
export function positiveIntegerField(errorMessage: string): FieldValidator<number> {
  return (value: unknown): ValidationResult<number> => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      return { isValid: false, error: errorMessage };
    }

    return { isValid: true, value: parsed };
  };
}
