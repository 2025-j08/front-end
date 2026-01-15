'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { FacilityListItem } from '@/types/facility';
import { logError } from '@/lib/logger';
import { parseSearchParams } from '@/lib/search-params';
import { getFacilityList, type FacilitySearchConditions } from '@/lib/supabase/queries/facilities';

import { FacilityCard } from './components/FacilityCard/FacilityCard';
import { Pagination } from './components/Pagination/Pagination';
import styles from './FacilitiesList.module.scss';

const ITEMS_PER_PAGE = 10;

/** ページ共通ヘッダー（パンくずリスト + タイトル） */
const PageHeader = () => (
  <>
    <div className={styles.breadcrumb}>
      <Link href="/">施設を探す</Link> &gt; <span>施設一覧</span>
    </div>
    <h1 className={styles.title}>施設一覧</h1>
  </>
);

export const FacilitiesList = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [facilities, setFacilities] = useState<FacilityListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLクエリパラメータから検索条件を取得
  const conditions = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 施設データを取得
  const fetchFacilities = useCallback(
    async (page: number, searchConditions: FacilitySearchConditions) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getFacilityList(searchConditions, page, ITEMS_PER_PAGE);
        setFacilities(result.facilities);
        setTotalCount(result.totalCount);
      } catch (err) {
        logError('施設一覧の取得に失敗しました', {
          component: 'FacilitiesList',
          error: err instanceof Error ? err : new Error(String(err)),
        });
        setError('施設一覧の取得に失敗しました。しばらく経ってから再度お試しください。');
        setFacilities([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 検索条件が変わったらページを1にリセットしてデータを取得
  useEffect(() => {
    setCurrentPage(1);
    fetchFacilities(1, conditions);
  }, [conditions, fetchFacilities]);

  // ページ変更時
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchFacilities(page, conditions);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [conditions, fetchFacilities],
  );

  // ローディング中
  if (isLoading) {
    return (
      <div className={styles.container}>
        <PageHeader />
        <div className={styles.loadingContainer}>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー発生時
  if (error) {
    return (
      <div className={styles.container}>
        <PageHeader />
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button className={styles.errorButton} onClick={() => fetchFacilities(1, conditions)}>
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // データなし
  if (facilities.length === 0) {
    return (
      <div className={styles.container}>
        <PageHeader />
        <div className={styles.emptyContainer}>
          <p>該当する施設が見つかりませんでした。</p>
          <p>検索条件を変更して再度お試しください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader />

      <p className={styles.resultCount}>{totalCount}件の施設が見つかりました</p>

      <div className={styles.facilitiesGrid}>
        {facilities.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
