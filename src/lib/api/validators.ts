import { NextResponse } from 'next/server';

/**
 * API共通のエラーレスポンス型
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * API共通の成功レスポンス型
 */
export interface ApiSuccessResponse<T = void> {
  success: true;
  data?: T;
}

/**
 * APIレスポンスの統一型
 */
export type ApiResponse<T = void> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * リクエストボディのパース結果型
 */
export type ParseResult<T> = { success: true; data: T } | { success: false; message: string };

/**
 * エラーレスポンスを生成する共通関数
 *
 * @param message - エラーメッセージ
 * @param status - HTTPステータスコード
 * @returns NextResponse
 */
export function createErrorResponse(message: string, status: number) {
  return NextResponse.json<ApiErrorResponse>({ success: false, error: message }, { status });
}

/**
 * 成功レスポンスを生成する共通関数
 *
 * @param data - レスポンスデータ（オプション）
 * @returns NextResponse
 */
export function createSuccessResponse<T = void>(data?: T) {
  const response: ApiSuccessResponse<T> = { success: true };
  if (data !== undefined) {
    response.data = data;
  }
  return NextResponse.json(response);
}

/**
 * リクエストボディが有効なJSONオブジェクトであることを検証
 *
 * @param body - 検証対象のリクエストボディ
 * @returns 検証結果
 */
export function validateRequestBody(body: unknown): ParseResult<Record<string, unknown>> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { success: false, message: '不正なリクエスト形式です' };
  }
  return { success: true, data: body as Record<string, unknown> };
}

/**
 * 文字列フィールドを検証して取得
 *
 * @param obj - 検証対象のオブジェクト
 * @param fieldName - フィールド名
 * @param errorMessage - エラーメッセージ
 * @returns 検証結果
 */
export function validateStringField(
  obj: Record<string, unknown>,
  fieldName: string,
  errorMessage: string,
): ParseResult<string> {
  const value = obj[fieldName];
  if (typeof value !== 'string' || value.trim() === '') {
    return { success: false, message: errorMessage };
  }
  return { success: true, data: value };
}

/**
 * 数値フィールドを検証して取得（正の整数のみ）
 *
 * @param obj - 検証対象のオブジェクト
 * @param fieldName - フィールド名
 * @param errorMessage - エラーメッセージ
 * @returns 検証結果
 */
export function validatePositiveIntegerField(
  obj: Record<string, unknown>,
  fieldName: string,
  errorMessage: string,
): ParseResult<number> {
  const value = obj[fieldName];
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { success: false, message: errorMessage };
  }

  return { success: true, data: parsed };
}
