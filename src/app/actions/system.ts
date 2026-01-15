'use server';

import { logError } from '@/lib/logger';

/**
 * システムエラーをサーバーログに記録する（クライアントサイドからの呼び出し用）
 *
 * バックグラウンド処理や非同期処理など、クライアント側で完結する処理において
 * 重大なエラーが発生した場合に、サーバー側のログに残すために使用します。
 *
 * @param message エラーメッセージ
 * @param errorDetails エラーの詳細情報（文字列化したオブジェクトなど）
 */
export async function logSystemError(message: string, errorDetails?: string | object) {
  // オブジェクトの場合は文字列化せずにそのまま渡すことも可能だが、
  // loggerの仕様に合わせて調整
  const details =
    typeof errorDetails === 'object' ? JSON.stringify(errorDetails, null, 2) : errorDetails;

  logError(`[Client Report] ${message}`, {
    details,
    source: 'client-background-task',
  });
}
