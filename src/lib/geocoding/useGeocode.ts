'use client';

/**
 * ジオコーディング機能を提供するカスタムフック
 */

import { useState, useCallback } from 'react';

import { fetchApi } from '@/lib/api/fetchApi';
import type { GeocodeResponse, Coordinates } from '@/types/geocoding';

interface UseGeocodeReturn {
  /** ジオコーディングを実行 */
  geocode: (address: string) => Promise<Coordinates | null>;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** エラーをクリア */
  clearError: () => void;
}

/**
 * 住所からGPS座標を取得するカスタムフック
 *
 * @example
 * ```tsx
 * const { geocode, isLoading, error } = useGeocode();
 *
 * const handleGeocode = async () => {
 *   const coords = await geocode('大阪府大阪市中央区本町1-1-1');
 *   if (coords) {
 *     console.log(coords.lat, coords.lng);
 *   }
 * };
 * ```
 */
export function useGeocode(): UseGeocodeReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = useCallback(async (address: string): Promise<Coordinates | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchApi<GeocodeResponse>(
        '/api/geocode',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        },
        'ジオコーディングに失敗しました',
      );

      if (response.success) {
        return response.coordinates;
      } else {
        setError(response.error);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ジオコーディングに失敗しました';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    geocode,
    isLoading,
    error,
    clearError,
  };
}
