import { useState, useCallback } from 'react';

/**
 * 住所データの型
 */
export interface PostalAddress {
  prefecture: string;
  city: string;
  town: string;
  prefectureKana: string;
  cityKana: string;
  townKana: string;
}

/**
 * 郵便番号検索レスポンスの型
 */
interface PostalCodeResponse {
  success: boolean;
  address?: PostalAddress;
  error?: string;
}

/**
 * 郵便番号から住所を検索するカスタムフック
 */
export const usePostalCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = useCallback(async (postalCode: string): Promise<PostalAddress | null> => {
    // 7桁であることを確認（ハイフン除去後）
    const cleanPostalCode = postalCode.replace(/[^\d]/g, '');
    if (cleanPostalCode.length !== 7) {
      setError('郵便番号は7桁で入力してください');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/postal-code?zipcode=${cleanPostalCode}`);
      const data: PostalCodeResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '住所の取得に失敗しました');
      }

      return data.address || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchAddress,
    isLoading,
    error,
    setError,
  };
};
