/**
 * APIリクエスト用のヘルパー関数
 * クライアントサイドからのAPI呼び出しを統一的に処理する
 */

/**
 * APIリクエストを実行し、レスポンスをJSONとしてパースする
 *
 * @template T - レスポンスの型
 * @param url - リクエスト先のURL
 * @param options - fetchのオプション
 * @param defaultErrorMessage - エラー時のデフォルトメッセージ
 * @returns パースされたJSONレスポンス
 * @throws Error - リクエストが失敗した場合
 *
 * @example
 * ```typescript
 * const data = await fetchApi<{ id: number }>(
 *   '/api/facilities/1',
 *   { method: 'PATCH', body: JSON.stringify({ name: 'New Name' }) },
 *   '更新に失敗しました'
 * );
 * ```
 */
export async function fetchApi<T>(
  url: string,
  options: RequestInit,
  defaultErrorMessage: string,
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = defaultErrorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || defaultErrorMessage;
    } catch {
      // JSONパース失敗時はデフォルトメッセージを使用
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(defaultErrorMessage);
  }
}
