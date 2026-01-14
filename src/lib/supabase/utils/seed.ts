/**
 * シード処理の共通ユーティリティ
 *
 * 各シードスクリプト間で共有される処理を集約し、
 * 重複コードを削減し、一貫性を保つためのユーティリティ関数を提供します。
 */

import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { logInfo, logWarn } from '@/lib/logger';

// ============================================
// 環境変数関連
// ============================================

/**
 * シード処理に必要な環境変数を検証して返す
 */
export function getSeedEnv(): { url: string; serviceRoleKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('環境変数 NEXT_PUBLIC_SUPABASE_URL が設定されていません');
  }

  if (!serviceRoleKey) {
    throw new Error('環境変数 SUPABASE_SERVICE_ROLE_KEY が設定されていません');
  }

  return { url, serviceRoleKey };
}

/**
 * シード用のSupabaseクライアントを作成
 */
export function createSeedClient(): SupabaseClient {
  const { url, serviceRoleKey } = getSeedEnv();
  return createClient(url, serviceRoleKey);
}

// ============================================
// 住所パース関連
// ============================================

/** 住所パース結果の型 */
export interface ParsedAddress {
  prefecture: string;
  city: string;
  addressDetail: string;
}

/** 都道府県の正規表現パターン */
const PREFECTURE_PATTERN =
  /(北海道|青森県|岩手県|宮城県|秋田県|山形県|福島県|茨城県|栃木県|群馬県|埼玉県|千葉県|東京都|神奈川県|新潟県|富山県|石川県|福井県|山梨県|長野県|岐阜県|静岡県|愛知県|三重県|滋賀県|京都府|大阪府|兵庫県|奈良県|和歌山県|鳥取県|島根県|岡山県|広島県|山口県|徳島県|香川県|愛媛県|高知県|福岡県|佐賀県|長崎県|熊本県|大分県|宮崎県|鹿児島県|沖縄県)/;

/**
 * 市区町村の正規表現パターン
 * 優先順位順に適用（市 > 郡+町/村 > 区 > 町/村）
 */
const CITY_PATTERNS = [
  /^(.+?市)/, // 市（政令指定都市含む）
  /^(.+?郡.+?[町村])/, // 郡+町/村（例: 相楽郡精華町）
  /^(.+?区)/, // 区（東京23区）
  /^(.+?[町村])/, // 町/村（郡なし）
];

/**
 * 住所文字列を都道府県、市区町村、町名番地に分割する
 *
 * @param address 住所文字列
 * @returns パース結果（都道府県、市区町村、住所詳細）
 */
export function parseAddress(address: string): ParsedAddress {
  const prefectureMatch = address.match(PREFECTURE_PATTERN);

  if (!prefectureMatch) {
    logWarn(`都道府県が見つかりません（住所: ${address}）デフォルト値「不明」を使用します`);
    return {
      prefecture: '不明',
      city: '不明',
      addressDetail: address,
    };
  }

  const prefecture = prefectureMatch[1];
  const remaining = address.substring(address.indexOf(prefecture) + prefecture.length);

  let city = '';
  let addressDetail = remaining;

  for (const pattern of CITY_PATTERNS) {
    const match = remaining.match(pattern);
    if (match) {
      city = match[1];
      addressDetail = remaining.substring(city.length);
      break;
    }
  }

  if (!city) {
    logWarn(`市区町村が見つかりません（住所: ${address}）デフォルト値「不明」を使用します`);
    return {
      prefecture,
      city: '不明',
      addressDetail: remaining,
    };
  }

  return {
    prefecture,
    city,
    addressDetail,
  };
}

/**
 * 郵便番号付き住所から住所情報を抽出する
 *
 * @param fullAddress 郵便番号付きの完全住所（例: 〒123-4567 東京都...）
 * @returns パース結果（郵便番号を除いた住所のパース結果）
 */
export function parseFullAddress(fullAddress: string): ParsedAddress & { postalCode: string } {
  const postalCodeMatch = fullAddress.match(/〒(\d{3}-\d{4})/);
  const postalCode = postalCodeMatch ? postalCodeMatch[1] : '000-0000';

  // 郵便番号を除去して住所部分を取得
  const addressPart = fullAddress.replace(/〒\d{3}-\d{4}\s*/, '').trim();
  const parsed = parseAddress(addressPart);

  return {
    postalCode,
    ...parsed,
  };
}

// ============================================
// 年号パース関連
// ============================================

/**
 * 設立年を抽出する
 *
 * @param yearString 設立年文字列（例: "1946年（昭和21年）8月"）
 * @param facilityId 施設ID（エラーログ用）
 * @returns 西暦年（4桁の数値）
 */
export function parseEstablishedYear(yearString: string | undefined, facilityId: number): number {
  const currentYear = new Date().getFullYear();

  if (!yearString) {
    logWarn(
      `設立年が見つかりません（施設ID: ${facilityId}）仮データとして現在年「${currentYear}」を使用します`,
    );
    return currentYear;
  }

  const match = yearString.match(/(\d{4})/);
  if (!match) {
    logWarn(
      `設立年を抽出できません（施設ID: ${facilityId}, 値: "${yearString}"）仮データとして現在年「${currentYear}」を使用します`,
    );
    return currentYear;
  }

  return parseInt(match[1], 10);
}

// ============================================
// シーケンスリセット関連
// ============================================

/**
 * 施設関連テーブルのシーケンスをリセットする
 *
 * IDを明示的に指定してINSERTした場合、シーケンスが追従しないため、
 * 新規追加時にIDが衝突する問題を防ぐためリセットする
 *
 * @param supabase Supabaseクライアント
 */
export async function resetFacilitySequences(supabase: SupabaseClient): Promise<void> {
  logInfo('シーケンスをリセットしています...');

  // facilities テーブルのシーケンスをリセット
  const { error: facilitiesError } = await supabase.rpc('reset_facilities_sequence');
  if (facilitiesError) {
    logWarn(
      `facilities シーケンスのリセットに失敗しました: ${facilitiesError.message}。` +
        `seed.sql実行時に自動リセットされます。`,
    );
  }

  // facility_types テーブルのシーケンスをリセット
  const { error: typesError } = await supabase.rpc('reset_facility_types_sequence');
  if (typesError) {
    logWarn(
      `facility_types シーケンスのリセットに失敗しました: ${typesError.message}。` +
        `seed.sql実行時に自動リセットされます。`,
    );
  }

  logInfo('✓ シーケンスリセット処理が完了しました');
}

// ============================================
// スクリプト実行ヘルパー
// ============================================

/**
 * シードスクリプトのエントリーポイントとして使用するラッパー関数
 * 統一されたエラーハンドリングと終了処理を提供
 *
 * @param mainFn メインのシード処理関数
 * @param scriptName スクリプト名（エラーログ用）
 */
export function runSeedScript(mainFn: () => Promise<void>, scriptName: string): void {
  mainFn()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`${scriptName}に失敗しました:`, err);
      process.exit(1);
    });
}
