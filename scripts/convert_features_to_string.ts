// facilities_detail.json の features を配列から文字列に変換するスクリプト
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filePath = join(__dirname, '../src/dummy_data/facilities_detail.json');

// JSONファイルを読み込む
const data = JSON.parse(readFileSync(filePath, 'utf-8'));

// 各施設のfeaturesを変換
for (const facilityId in data) {
  const facility = data[facilityId];
  if (facility.specialtyInfo && Array.isArray(facility.specialtyInfo.features)) {
    // 配列を改行なしの連結文字列に変換
    facility.specialtyInfo.features = facility.specialtyInfo.features.join('');
  }
}

// ファイルに書き戻す（整形あり）
writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

console.log('✓ facilities_detail.json の features を配列から文字列に変換しました');
