// 施設テーブルに初期データを追加する
// 実行方法:
// NEXT_PUBLIC_SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> tsx src/lib/supabase/test/seed_facility.ts
import { readFileSync } from 'fs';
import { join } from 'path';

import { createClient } from '@supabase/supabase-js';

import { logInfo, logError } from '@/lib/logger';

// JSONファイルのパス
const FACILITIES_LIST_PATH = join(__dirname, '../../../dummy_data/facilities_list.json');
const FACILITIES_DETAIL_PATH = join(__dirname, '../../../dummy_data/facilities_detail.json');

// 型定義
type FacilityListItem = {
  id: number;
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  imagePath: string | null;
};

type FacilityDetailItem = {
  id: number;
  name: string;
  corporation?: string;
  fullAddress?: string;
  phone?: string;
  establishedYear?: string;
  [key: string]: unknown;
};

type FacilityInsertData = {
  name: string;
  corporation: string;
  postal_code: string;
  phone: string;
  prefecture: string;
  city: string;
  address_detail: string;
  established_year: number;
};

/**
 * 住所文字列を都道府県、市区町村、町名番地に分割する
 */
function parseAddress(address: string): {
  prefecture: string;
  city: string;
  address_detail: string;
} {
  // 都道府県の正規表現パターン
  const prefecturePattern =
    /(北海道|青森県|岩手県|宮城県|秋田県|山形県|福島県|茨城県|栃木県|群馬県|埼玉県|千葉県|東京都|神奈川県|新潟県|富山県|石川県|福井県|山梨県|長野県|岐阜県|静岡県|愛知県|三重県|滋賀県|京都府|大阪府|兵庫県|奈良県|和歌山県|鳥取県|島根県|岡山県|広島県|山口県|徳島県|香川県|愛媛県|高知県|福岡県|佐賀県|長崎県|熊本県|大分県|宮崎県|鹿児島県|沖縄県)/;

  const prefectureMatch = address.match(prefecturePattern);

  if (!prefectureMatch) {
    // 都道府県が見つからない場合は警告ログを出力してデフォルト値を返す
    console.warn(`都道府県が見つかりません（住所: ${address}）デフォルト値「不明」を使用します`);
    return {
      prefecture: '不明',
      city: '不明',
      address_detail: address,
    };
  }

  const prefecture = prefectureMatch[1];
  const remaining = address.substring(prefecture.length);

  // 市区町村の正規表現パターン（市、区、町、村）
  const cityPattern = /^(.+?[市区町村])/;
  const cityMatch = remaining.match(cityPattern);

  if (!cityMatch) {
    // 市区町村が見つからない場合は警告ログを出力してデフォルト値を返す
    console.warn(`市区町村が見つかりません（住所: ${address}）デフォルト値「不明」を使用します`);
    return {
      prefecture,
      city: '不明',
      address_detail: remaining,
    };
  }

  const city = cityMatch[1];
  const address_detail = remaining.substring(city.length);

  return {
    prefecture,
    city,
    address_detail,
  };
}

/**
 * 設立年を抽出する
 * 例: "1946年（昭和21年）8月" → 1946
 * @throws 設立年が見つからない場合はエラーを発生
 */
function parseEstablishedYear(yearString: string | undefined, facilityId: number): number {
  if (!yearString) {
    throw new Error(`設立年が見つかりません（施設ID: ${facilityId}）`);
  }

  const match = yearString.match(/(\d{4})/);
  if (!match) {
    throw new Error(`設立年を抽出できません（施設ID: ${facilityId}, 値: "${yearString}"）`);
  }

  return parseInt(match[1], 10);
}

/**
 * 施設データを準備する
 */
function prepareFacilityData(): FacilityInsertData[] {
  // JSONファイルを読み込む
  const facilitiesListJson = readFileSync(FACILITIES_LIST_PATH, 'utf-8');
  const facilitiesDetailJson = readFileSync(FACILITIES_DETAIL_PATH, 'utf-8');

  const facilitiesList = JSON.parse(facilitiesListJson);
  const facilitiesDetail = JSON.parse(facilitiesDetailJson) as Record<string, FacilityDetailItem>;

  // 全ページの施設データを収集
  const allFacilities: FacilityListItem[] = [];
  for (const pageKey in facilitiesList.pages) {
    allFacilities.push(...facilitiesList.pages[pageKey]);
  }

  // データを変換
  return allFacilities.map((facility) => {
    const detail = facilitiesDetail[facility.id.toString()];
    const { prefecture, city, address_detail } = parseAddress(facility.address);

    try {
      const established_year = parseEstablishedYear(detail?.establishedYear, facility.id);

      return {
        name: facility.name,
        corporation: detail?.corporation || '法人名未設定',
        postal_code: facility.postalCode,
        phone: facility.phone,
        prefecture,
        city,
        address_detail,
        established_year,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(
        `施設 "${facility.name}"（ID: ${facility.id}）のデータ準備に失敗しました: ${errorMessage}`,
      );
      throw error;
    }
  });
}

/**
 * メイン処理
 */
async function seedFacilities() {
  try {
    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        '環境変数 NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が設定されていません',
      );
    }

    console.log('Supabaseクライアントを初期化しています...');

    // Supabaseクライアントを作成（Service Roleキーを使用）
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('施設データを準備しています...');
    const facilityData = prepareFacilityData();

    console.log(`${facilityData.length}件の施設データを挿入します...`);

    // データを挿入
    const { data, error } = await supabase.from('facilities').insert(facilityData).select();

    if (error) {
      throw error;
    }

    logInfo(`✓ ${data?.length}件の施設データを正常に挿入しました`);
  } catch (error) {
    logError('エラーが発生しました', { error: error instanceof Error ? error : String(error) });
    process.exit(1);
  }
}

// スクリプトを実行
seedFacilities();
