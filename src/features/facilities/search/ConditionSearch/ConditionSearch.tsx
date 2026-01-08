'use client';

import { useState, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { PREFECTURES, FACILITY_TYPES } from '@/const/searchConditions';
import searchMapData from '@/dummy_data/searchmap_data.json';

import { CitySelectModal } from './CitySelectModal';
import styles from './ConditionSearch.module.scss';

// 住所から市町村名を抽出するヘルパー関数
const extractCityFromAddress = (address: string, prefName: string): string => {
  // 都道府県名を除去（住所の先頭にある場合のみ安全に除去）
  const restAddress = address.startsWith(prefName) ? address.substring(prefName.length) : address;

  // 市の抽出 (例: 大阪市, 神戸市)
  const cityMatch = restAddress.match(/^(.+?市)/);
  if (cityMatch) return cityMatch[1];

  // 郡・町村の抽出 (例: 相楽郡精華町)
  // 「市」を含まない連続部分に限定してマッチさせることで、誤った範囲を取得しないようにする
  const gunMatch = restAddress.match(/^([^市]+郡[^市]+?[町村])/);
  if (gunMatch) return gunMatch[1];

  // 区の抽出 (東京23区など、市がない場合)
  const kuMatch = restAddress.match(/^(.+?区)/);
  if (kuMatch) return kuMatch[1];

  // それ以外（町・村のみ）
  const townMatch = restAddress.match(/^(.+?[町村])/);
  if (townMatch) return townMatch[1];

  return '';
};

export const ConditionSearch = () => {
  // モーダル管理用State
  const [modalOpen, setModalOpen] = useState(false);
  const [activePrefectureId, setActivePrefectureId] = useState<string | null>(null);

  // 選択データState: { 'osaka': ['大阪市', '堺市'], 'hyogo': [] }
  const [selectedCitiesMap, setSelectedCitiesMap] = useState<Record<string, string[]>>({});

  // 形態（施設タイプ）の選択状態
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 施設データから都道府県ごとの市町村リストを動的に生成
  const dynamicAreaData = useMemo(() => {
    // パフォーマンス改善: 都道府県名からデータを高速に引くためのMapを作成
    const prefNameMap = new Map<string, (typeof PREFECTURES)[number]>();
    PREFECTURES.forEach((p) => prefNameMap.set(p.name, p));

    const map: Record<string, Set<string>> = {};

    // 都道府県IDごとにSetを初期化
    PREFECTURES.forEach((pref) => {
      map[pref.id] = new Set();
    });

    // 全施設データを走査して市町村を収集
    searchMapData.forEach((facility) => {
      // 住所の先頭文字列から都道府県を特定 (4文字または3文字)
      let pref = prefNameMap.get(facility.address.substring(0, 4));
      if (!pref) {
        pref = prefNameMap.get(facility.address.substring(0, 3));
      }

      if (pref) {
        const cityName = extractCityFromAddress(facility.address, pref.name);
        if (cityName) {
          map[pref.id].add(cityName);
        }
      }
    });

    // Setを配列に変換してソート（漢字コード順）
    const result: Record<string, string[]> = {};
    Object.keys(map).forEach((key) => {
      // 修正: sensitivity: 'base' を追加して、より自然な日本語ソート順にする
      result[key] = Array.from(map[key]).sort((a, b) =>
        a.localeCompare(b, 'ja', { sensitivity: 'base' }),
      );
    });

    return result;
  }, []); // PREFECTURES と searchMapData は静的データのため依存配列は空でOK

  // 都道府県ボタンクリック時の処理
  const handlePrefectureClick = (prefId: string) => {
    setActivePrefectureId(prefId);
    setModalOpen(true);
  };

  // モーダルでの決定処理
  const handleCitiesConfirm = (cities: string[]) => {
    if (activePrefectureId) {
      setSelectedCitiesMap((prev) => ({
        ...prev,
        [activePrefectureId]: cities,
      }));
    }
  };

  // 形態ボタンクリック時の処理
  const handleTypeClick = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // 検索実行時のハンドラー
  const handleSearch = () => {
    // 選択された条件（市区町村、施設形態）を取得
    const searchConditions = {
      cities: selectedCitiesMap,
      types: selectedTypes,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('条件絞り込み検索実行:', searchConditions);
    }
  };

  // 現在アクティブな都道府県の情報
  const activePrefName = PREFECTURES.find((p) => p.id === activePrefectureId)?.name || '';
  const activeCitiesList = activePrefectureId ? dynamicAreaData[activePrefectureId] || [] : [];
  const currentSelectedCities = activePrefectureId
    ? selectedCitiesMap[activePrefectureId] || []
    : [];

  return (
    <div className={styles.container}>
      {/* 左上のバッジ */}
      <div className={styles.keywordBadge}>条件で探す</div>

      {/* 都道府県セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>都道府県</h3>
        <div className={styles.prefGrid}>
          {PREFECTURES.map((pref) => {
            const selectedCount = (selectedCitiesMap[pref.id] || []).length;
            return (
              <button
                key={pref.id}
                type="button"
                className={`${styles.prefButton} ${styles[pref.id]} ${selectedCount > 0 ? styles.hasSelection : ''}`}
                onClick={() => handlePrefectureClick(pref.id)}
                aria-label={`${pref.name}の市区町村を選択${selectedCount > 0 ? `（${selectedCount}件選択中）` : ''}`}
              >
                {pref.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 形態セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>形態</h3>
        <div className={styles.typeGrid}>
          {FACILITY_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                className={`${styles.typeButton} ${isSelected ? styles.selected : ''}`}
                type="button"
                aria-label={`${type}の施設形態で絞り込み${isSelected ? '（選択中）' : ''}`}
                aria-pressed={isSelected}
                onClick={() => handleTypeClick(type)}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 検索ボタンエリア */}
      <div className={styles.searchAction}>
        <button
          type="button"
          className={styles.submitButton}
          aria-label="絞り込み検索"
          onClick={handleSearch}
        >
          <span>絞り込み検索</span>
          <SearchIcon className={styles.icon} />
        </button>
      </div>

      {/* 市区町村選択モーダル */}
      {modalOpen && (
        <CitySelectModal
          isOpen={modalOpen}
          prefectureName={activePrefName}
          cities={activeCitiesList}
          selectedCities={currentSelectedCities}
          onClose={() => setModalOpen(false)}
          onConfirm={handleCitiesConfirm}
        />
      )}
    </div>
  );
};