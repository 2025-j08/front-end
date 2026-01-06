import { useState, useEffect } from 'react';

import { FacilityDetail } from '@/types/facility';
import facilityDataJson from '@/dummy_data/facilities_detail.json';

// IDをキーにした辞書型
type FacilityDataMap = Record<string, FacilityDetail>;

// 将来的なAPIレスポンスの型定義
type FacilityDataResponse = {
  data: FacilityDetail | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * useFacilityData
 * 施設詳細データを取得するカスタムフック
 * 現在はダミーデータを非同期で返すように実装（API統合の準備）
 */
export const useFacilityData = (id: string): FacilityDataResponse => {
  const [data, setData] = useState<FacilityDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // APIコールを模倣するための遅延
        await new Promise((resolve) => setTimeout(resolve, 300));

        // IDをキーにしてデータを取得
        const dataMap = facilityDataJson as unknown as FacilityDataMap;
        const facilityData = dataMap[id];

        if (facilityData) {
          setData(facilityData);
        } else {
          throw new Error(`施設ID: ${id} のデータが見つかりません`);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('データの取得に失敗しました'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, isLoading, error };
};
