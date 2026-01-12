'use client';

import { useState, useEffect } from 'react';

import { getFacilityDetail } from '@/lib/supabase/queries/facilities';
import type { FacilityDetail } from '@/types/facility';

/**
 * useFacilityData カスタムフックの戻り値型
 */
type UseFacilityDataReturn = {
  data: FacilityDetail | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * useFacilityData カスタムフック
 * 施設IDに基づいてSupabaseから施設詳細データを取得します
 *
 * @param id - 施設ID（文字列形式）
 * @returns オブジェクト { data, isLoading, error }
 *
 * @example
 * const { data, isLoading, error } = useFacilityData('4');
 */
export const useFacilityData = (id: string): UseFacilityDataReturn => {
  const [data, setData] = useState<FacilityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // IDを数値に変換
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
          setError(`無効な施設ID: ${id}`);
          setData(null);
          return;
        }

        // Supabaseから施設詳細データを取得
        const facilityData = await getFacilityDetail(numericId);

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
