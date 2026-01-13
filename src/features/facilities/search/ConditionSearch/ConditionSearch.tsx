'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

import { KINKI_PREFECTURES, FACILITY_TYPES } from '@/const/searchConditions';
import { logError } from '@/lib/clientLogger';
import { buildFacilitiesListUrl } from '@/lib/search-params';
import { getPrefectureCities, type PrefectureCitiesMap } from '@/lib/supabase/queries/facilities';

import { CitySelectModal } from './CitySelectModal';
import styles from './ConditionSearch.module.scss';

/** 都道府県名からCSSクラス名へのマッピング */
const PREFECTURE_TO_CLASS: Record<string, string> = {
  大阪府: 'osaka',
  京都府: 'kyoto',
  滋賀県: 'shiga',
  奈良県: 'nara',
  兵庫県: 'hyogo',
  和歌山県: 'wakayama',
};

export const ConditionSearch = () => {
  const router = useRouter();

  // 都道府県・市区町村データ（Supabaseから取得）
  const [prefectureCities, setPrefectureCities] = useState<PrefectureCitiesMap>({});
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);

  // モーダル管理用State
  const [modalOpen, setModalOpen] = useState(false);
  const [activePrefecture, setActivePrefecture] = useState<string | null>(null);

  // 選択データState: { '大阪府': ['大阪市', '堺市'], '兵庫県': [] }
  const [selectedCitiesMap, setSelectedCitiesMap] = useState<Record<string, string[]>>({});

  // 形態（施設タイプ）の選択状態
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 初回マウント時にSupabaseから都道府県・市区町村データを取得
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getPrefectureCities();
        setPrefectureCities(data);
      } catch (error) {
        const err = error instanceof Error ? error : String(error);
        logError('住所情報の取得に失敗しました', { component: 'ConditionSearch', error: err });
      } finally {
        setIsLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  // 都道府県ボタンクリック時の処理
  const handlePrefectureClick = (prefecture: string) => {
    setActivePrefecture(prefecture);
    setModalOpen(true);
  };

  // モーダルでの決定処理
  const handleCitiesConfirm = (cities: string[]) => {
    if (activePrefecture) {
      setSelectedCitiesMap((prev) => ({
        ...prev,
        [activePrefecture]: cities,
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
    const url = buildFacilitiesListUrl({
      cities: selectedCitiesMap,
      types: selectedTypes,
    });
    router.push(url);
  };

  // 現在アクティブな都道府県の情報
  const activeCitiesList = activePrefecture ? prefectureCities[activePrefecture] || [] : [];
  const currentSelectedCities = activePrefecture ? selectedCitiesMap[activePrefecture] || [] : [];

  return (
    <div className={styles.container}>
      {/* 左上のバッジ */}
      <div className={styles.keywordBadge}>条件で探す</div>

      {/* 都道府県セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>都道府県</h3>
        {isLoadingAreas ? (
          <div className={styles.prefGrid}>
            {KINKI_PREFECTURES.map((pref) => (
              <button
                key={pref}
                type="button"
                className={`${styles.prefButton} ${styles[PREFECTURE_TO_CLASS[pref]]}`}
                disabled
                aria-label={`${pref}（読み込み中）`}
              >
                {pref}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.prefGrid}>
            {KINKI_PREFECTURES.map((pref) => {
              const selectedCount = (selectedCitiesMap[pref] || []).length;
              const cssClass = PREFECTURE_TO_CLASS[pref];
              return (
                <button
                  key={pref}
                  type="button"
                  className={`${styles.prefButton} ${styles[cssClass]} ${selectedCount > 0 ? styles.hasSelection : ''}`}
                  onClick={() => handlePrefectureClick(pref)}
                  aria-label={`${pref}の市区町村を選択${selectedCount > 0 ? `（${selectedCount}件選択中）` : ''}`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        )}
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
      {modalOpen && activePrefecture && (
        <CitySelectModal
          isOpen={modalOpen}
          prefectureName={activePrefecture}
          cities={activeCitiesList}
          selectedCities={currentSelectedCities}
          onClose={() => setModalOpen(false)}
          onConfirm={handleCitiesConfirm}
        />
      )}
    </div>
  );
};
