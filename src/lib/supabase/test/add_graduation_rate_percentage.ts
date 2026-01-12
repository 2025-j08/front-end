// facilities_detail.json に graduationRatePercentage を追加するスクリプト
// 実行方法:
// node --import tsx src/lib/supabase/test/add_graduation_rate_percentage.ts

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const FACILITIES_DETAIL_PATH = join(__dirname, '../../../dummy_data/facilities_detail.json');

// JSONファイルを読み込む
const facilitiesDetail = JSON.parse(readFileSync(FACILITIES_DETAIL_PATH, 'utf-8'));

// 各施設にgraduationRatePercentageを追加
for (const facilityId in facilitiesDetail) {
  const facility = facilitiesDetail[facilityId];
  if (facility.educationInfo) {
    // 進学率のパーセンテージを追加（デフォルト値: 100%）
    facility.educationInfo.graduationRatePercentage = '100%';
  }
}

// JSONファイルに書き戻す
writeFileSync(FACILITIES_DETAIL_PATH, JSON.stringify(facilitiesDetail, null, 2), 'utf-8');

console.log('✓ graduationRatePercentage を全施設に追加しました');
