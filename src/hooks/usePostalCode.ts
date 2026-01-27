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
 * 郵便番号検索のクライアントサイドキャッシュ
 */
const addressCache = new Map<string, PostalAddress>();

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

    // キャッシュをチェック
    if (addressCache.has(cleanPostalCode)) {
      setError(null);
      return addressCache.get(cleanPostalCode) || null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/postal-code?zipcode=${cleanPostalCode}`);
      const data: PostalCodeResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '住所の取得に失敗しました');
      }

      const address = data.address || null;
      if (address) {
        addressCache.set(cleanPostalCode, address);
      }

      return address;
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
    /**
     * 外部からエラーを設定するための関数
     * フック内部のバリデーション（桁数など）とは別に、
     * 利用側のビジネスロジック（例：特定の都道府県のみ許可）でエラーとしたい場合に使用します。
     */
    setError,
  };
};
