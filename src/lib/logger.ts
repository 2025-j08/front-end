/**
 * 構造化ログユーティリティ
 *
 * アプリケーション全体で統一されたログフォーマットを提供します。
 * - timestamp: ISO 8601形式のタイムスタンプ
 * - userId: ユーザーID（該当する場合）
 * - context: その他の関連情報
 */

/**
 * ログメタデータの型定義
 */
type LogMetadata = {
  userId?: string;
  email?: string;
  error?: string | Error;
  stack?: string;
  [key: string]: unknown;
};

/**
 * ログレベル
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * 構造化ログオブジェクトを生成
 * @param metadata - ログに含めるメタデータ
 * @returns タイムスタンプ付きのログオブジェクト
 */
const createLogObject = (metadata: LogMetadata): Record<string, unknown> => {
  const logObject: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  // Error オブジェクトの場合はメッセージとスタックを展開
  if (metadata.error instanceof Error) {
    logObject.error = metadata.error.message;
    logObject.stack = metadata.error.stack;
  }

  return logObject;
};

/**
 * 構造化ログ出力の基本関数
 * @param level - ログレベル
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
const log = (level: LogLevel, message: string, metadata?: LogMetadata): void => {
  const logObject = metadata ? createLogObject(metadata) : { timestamp: new Date().toISOString() };

  switch (level) {
    case 'info':
      console.log(message, logObject);
      break;
    case 'warn':
      console.warn(message, logObject);
      break;
    case 'error':
      console.error(message, logObject);
      break;
    case 'debug':
      console.log(`[DEBUG] ${message}`, logObject);
      break;
  }
};

/**
 * 情報ログを出力
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logInfo = (message: string, metadata?: LogMetadata): void => {
  log('info', message, metadata);
};

/**
 * 警告ログを出力
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logWarn = (message: string, metadata?: LogMetadata): void => {
  log('warn', message, metadata);
};

/**
 * エラーログを出力
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logError = (message: string, metadata?: LogMetadata): void => {
  log('error', message, metadata);
};

/**
 * デバッグログを出力（開発環境のみ）
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logDebug = (message: string, metadata?: LogMetadata): void => {
  if (process.env.NODE_ENV === 'development') {
    log('debug', message, metadata);
  }
};

/**
 * FATAL エラーログを出力（ロールバック失敗など、手動対応が必要な重大なエラー）
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logFatal = (message: string, metadata?: LogMetadata): void => {
  log('error', `FATAL: ${message}`, metadata);
};
