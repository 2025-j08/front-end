import { useState, useEffect } from 'react';

import { FacilityDetail } from '@/types/facility';
import facilityDataJson from '@/dummy_data/facilities_detail.json';

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
      // console.log('Fetching data for facility ID:', id); // デバッグ用
      try {
        // setIsLoading(true) は初期値でtrueなので削除
        // APIコールを模倣するための遅延
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 型アサーションを使用してデータをセット
        // 注意: 実際のデータ構造が更新された後に正しく機能するように
        // JSONデータも更新する必要があります
        // TODO: zodなどでランタイムバリデーションを行うことを推奨
        // 現在は開発用ダミーデータのためアサーションを使用
        if (facilityDataJson) {
          setData(facilityDataJson as unknown as FacilityDetail);
        } else {
          throw new Error('データが見つかりません');
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
  }, []);

  return { data, isLoading, error };
};
