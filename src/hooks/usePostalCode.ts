import { useState, useCallback } from 'react';

import { validatePostalCode, normalizePostalCode } from '@/lib/validation';

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
 * LRU (Least Recently Used) 方式で最大20件まで保持します
 */
const CACHE_LIMIT = 20;
const addressCache = new Map<string, PostalAddress>();

/**
 * 郵便番号から住所を検索するカスタムフック
 */
export const usePostalCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = useCallback(async (postalCode: string): Promise<PostalAddress | null> => {
    // 形式を整えてバリデーション
    const cleanPostalCode = normalizePostalCode(postalCode);
    const validation = validatePostalCode(cleanPostalCode);

    if (!validation.isValid) {
      setError(validation.error || '郵便番号の形式が正しくありません');
      return null;
    }

    // キャッシュをチェック (LRU: 使用されたエントリを末尾に移動)
    if (addressCache.has(cleanPostalCode)) {
      const cachedAddress = addressCache.get(cleanPostalCode)!;
      addressCache.delete(cleanPostalCode);
      addressCache.set(cleanPostalCode, cachedAddress);

      setError(null);
      return cachedAddress;
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
        // キャッシュサイズ制限 (LRU: 古いエントリを削除)
        if (addressCache.size >= CACHE_LIMIT) {
          const firstKey = addressCache.keys().next().value;
          if (firstKey) {
            addressCache.delete(firstKey);
          }
        }
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
