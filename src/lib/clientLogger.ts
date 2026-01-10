/**
 * クライアントサイド用の構造化ログユーティリティ
 *
 * フロントエンド（ブラウザ）で実行されるログを統一します。
 * - timestamp: ISO 8601形式のタイムスタンプ
 * - context: その他の関連情報（コンポーネント名、ユーザーアクション等）
 */

/**
 * クライアント用ログメタデータの型定義
 */
type ClientLogMetadata = {
  component?: string;
  action?: string;
  error?: string | Error;
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
const createLogObject = (metadata: ClientLogMetadata): Record<string, unknown> => {
  const logObject: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  // Error オブジェクトの場合はメッセージを展開
  if (metadata.error instanceof Error) {
    logObject.error = metadata.error.message;
    // 開発環境ではスタックも含める
    if (process.env.NODE_ENV === 'development') {
      logObject.stack = metadata.error.stack;
    }
  }

  return logObject;
};

/**
 * 構造化ログ出力の基本関数
 * @param level - ログレベル
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
const log = (level: LogLevel, message: string, metadata?: ClientLogMetadata): void => {
  // 本番環境ではログを出力しない（必要に応じて変更）
  if (process.env.NODE_ENV === 'production') {
    // 本番環境ではエラーのみ出力
    if (level !== 'error') {
      return;
    }
  }

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
export const logInfo = (message: string, metadata?: ClientLogMetadata): void => {
  log('info', message, metadata);
};

/**
 * 警告ログを出力
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logWarn = (message: string, metadata?: ClientLogMetadata): void => {
  log('warn', message, metadata);
};

/**
 * エラーログを出力
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logError = (message: string, metadata?: ClientLogMetadata): void => {
  log('error', message, metadata);
};

/**
 * デバッグログを出力（開発環境のみ）
 * @param message - ログメッセージ
 * @param metadata - 追加のメタデータ
 */
export const logDebug = (message: string, metadata?: ClientLogMetadata): void => {
  if (process.env.NODE_ENV === 'development') {
    log('debug', message, metadata);
  }
};
