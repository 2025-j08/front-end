// 施設テーブルに初期データを追加する
// 実行方法:
// node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility.ts
import { readFileSync } from 'fs';
import { join } from 'path';

import { logInfo } from '@/lib/logger';
import {
  createSeedClient,
  parseAddress,
  parseEstablishedYear,
  runSeedScript,
} from '@/lib/supabase/utils/seed';

// JSONファイルのパス
const FACILITIES_LIST_PATH = join(__dirname, '../../../dummy_data/facilities_list.json');
const FACILITIES_DETAIL_PATH = join(__dirname, '../../../dummy_data/facilities_detail.json');

// ============================================
// JSONデータ用の型定義
// ============================================

/** 施設一覧JSONの各項目 */
interface FacilityListJsonItem {
  id: number;
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  imagePath: string | null;
}

/** 施設一覧JSONのルート構造 */
interface FacilitiesListJson {
  totalCount: number;
  limit: number;
  pages: Record<string, FacilityListJsonItem[]>;
}

/** 施設詳細JSONの各項目 */
interface FacilityDetailJsonItem {
  id: number;
  name: string;
  corporation?: string;
  fullAddress?: string;
  phone?: string;
  establishedYear?: string;
}

/** Supabaseへ挿入するデータの型 */
interface FacilityInsertData {
  name: string;
  corporation: string;
  postal_code: string;
  phone: string;
  prefecture: string;
  city: string;
  address_detail: string;
  established_year: number;
}

// ============================================
// データ準備
// ============================================

/**
 * 施設データを準備する
 */
function prepareFacilityData(): FacilityInsertData[] {
  const facilitiesListJson = readFileSync(FACILITIES_LIST_PATH, 'utf-8');
  const facilitiesDetailJson = readFileSync(FACILITIES_DETAIL_PATH, 'utf-8');

  const facilitiesList = JSON.parse(facilitiesListJson) as FacilitiesListJson;
  const facilitiesDetail = JSON.parse(facilitiesDetailJson) as Record<
    string,
    FacilityDetailJsonItem
  >;

  // 全ページの施設データを収集
  const allFacilities: FacilityListJsonItem[] = [];
  for (const pageKey in facilitiesList.pages) {
    allFacilities.push(...facilitiesList.pages[pageKey]);
  }

  // データを変換
  return allFacilities.map((facility) => {
    const detail = facilitiesDetail[facility.id.toString()];
    const { prefecture, city, addressDetail } = parseAddress(facility.address);
    const established_year = parseEstablishedYear(detail?.establishedYear, facility.id);

    return {
      name: facility.name,
      corporation: detail?.corporation || '法人名未設定',
      postal_code: facility.postalCode,
      phone: facility.phone,
      prefecture,
      city,
      address_detail: addressDetail,
      established_year,
    };
  });
}

// ============================================
// メイン処理
// ============================================

async function main(): Promise<void> {
  logInfo('Supabaseクライアントを初期化しています...');
  const supabase = createSeedClient();

  logInfo('施設データを準備しています...');
  const facilityData = prepareFacilityData();

  logInfo(`${facilityData.length}件の施設データを挿入します...`);

  const { data, error } = await supabase.from('facilities').insert(facilityData).select();

  if (error) {
    throw new Error(`施設データの挿入に失敗しました: ${error.message}`);
  }

  logInfo(`✓ ${data?.length}件の施設データを正常に挿入しました`);
}

// スクリプトを実行
runSeedScript(main, '施設シード');
