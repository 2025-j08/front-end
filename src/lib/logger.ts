/**
 * 統合ログユーティリティ
 *
 * サーバーサイドとクライアントサイドの両方で使用可能な統一されたログフォーマットを提供します。
 * - timestamp: ISO 8601形式のタイムスタンプ
 * - userId: ユーザーID（該当する場合）
 * - context: その他の関連情報
 */

/**
 * メールアドレスをマスク化してプライバシーを保護
 *
 * GDPRやその他のプライバシー規制への対応として、
 * ログに記録されるメールアドレスを部分的にマスクします。
 *
 * @param email - マスク化するメールアドレス
 * @returns マスク化されたメールアドレス
 *
 * @example
 * maskEmail('user@example.com')      // => 'u***@e***.com'
 * maskEmail('john.doe@company.co.jp') // => 'j***@c***.co.jp'
 * maskEmail('a@b.com')                // => 'a***@b***.com'
 */
const INVALID_EMAIL_MASK = '[INVALID_EMAIL]';

export const maskEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return INVALID_EMAIL_MASK;
  }

  const trimmedEmail = email.trim();
  const atIndex = trimmedEmail.indexOf('@');

  if (atIndex <= 0 || atIndex === trimmedEmail.length - 1) {
    return INVALID_EMAIL_MASK;
  }

  const localPart = trimmedEmail.substring(0, atIndex);
  const domainPart = trimmedEmail.substring(atIndex + 1);

  const maskedLocal = localPart.length > 0 ? `${localPart[0]}***` : '***';

  const domainParts = domainPart.split('.');
  if (domainParts.length === 0) {
    return `${maskedLocal}@***`;
  }

  const maskedDomainParts = domainParts.map((part, index) => {
    if (index === domainParts.length - 1) {
      return part;
    }
    return part.length > 0 ? `${part[0]}***` : '***';
  });

  const hasEmptyDomainSegment = domainParts.some((part) => part.length === 0);
  if (hasEmptyDomainSegment) {
    return INVALID_EMAIL_MASK;
  }

  return `${maskedLocal}@${maskedDomainParts.join('.')}`;
};

/**
 * ログメタデータの型定義
 */
type LogMetadata = {
  userId?: string;
  email?: string;
  component?: string;
  action?: string;
  error?: string | Error;
  stack?: string;
  [key: string]: unknown;
};

/**
 * ログレベル
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * 実行環境の判定
 */
const isServer = typeof window === 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * 構造化ログオブジェクトを生成
 */
const createLogObject = (metadata: LogMetadata): Record<string, unknown> => {
  const logObject: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  if (metadata.error instanceof Error) {
    logObject.error = metadata.error.message;
    // サーバーサイドまたは開発環境ではスタックを含める
    if (isServer || isDevelopment) {
      logObject.stack = metadata.error.stack;
    }
  }

  return logObject;
};

/**
 * ログ出力をスキップすべきか判定
 */
const shouldSkipLog = (level: LogLevel): boolean => {
  // クライアントサイドの本番環境ではエラーのみ出力
  if (!isServer && isProduction && level !== 'error') {
    return true;
  }
  return false;
};

/**
 * 構造化ログ出力の基本関数
 */
const log = (level: LogLevel, message: string, metadata?: LogMetadata): void => {
  if (shouldSkipLog(level)) {
    return;
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
 */
export const logInfo = (message: string, metadata?: LogMetadata): void => {
  log('info', message, metadata);
};

/**
 * 警告ログを出力
 */
export const logWarn = (message: string, metadata?: LogMetadata): void => {
  log('warn', message, metadata);
};

/**
 * エラーログを出力
 */
export const logError = (message: string, metadata?: LogMetadata): void => {
  log('error', message, metadata);
};

/**
 * デバッグログを出力（開発環境のみ）
 */
export const logDebug = (message: string, metadata?: LogMetadata): void => {
  if (isDevelopment) {
    log('debug', message, metadata);
  }
};

/**
 * FATAL エラーログを出力（ロールバック失敗など、手動対応が必要な重大なエラー）
 */
export const logFatal = (message: string, metadata?: LogMetadata): void => {
  log('error', `FATAL: ${message}`, metadata);
};
