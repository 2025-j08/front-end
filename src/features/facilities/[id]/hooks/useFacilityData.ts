'use client';

import { useState, useEffect } from 'react';

import facilitiesDetailData from '@/dummy_data/facilities_detail.json';
import type { FacilityDetail, FacilityDataMap } from '@/types/facility';

/**
 * useFacilityData カスタムフック
 * 施設IDに基づいて施設詳細データを取得します
 *
 * @param id - 施設ID（文字列形式）
 * @returns オブジェクト { data, isLoading, error }
 *
 * @example
 * const { data, isLoading, error } = useFacilityData('4');
 */
export const useFacilityData = (id: string) => {
  const [data, setData] = useState<FacilityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      setError(null);

      try {
        // JSONデータをFacilityDataMap型として扱う
        // NOTE: 本番環境ではzod等でランタイムバリデーションを推奨
        const dataMap = facilitiesDetailData as unknown as FacilityDataMap;

        const facilityData = dataMap[id];

        if (!facilityData) {
          setError(`施設ID: ${id} が見つかりません`);
          setData(null);
        } else {
          setData(facilityData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, isLoading, error };
};
