'use client';

import { useCallback, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import {
  getFacilityImages,
  manageFacilityImages,
  type NewImageInput,
} from '@/lib/supabase/mutations/facilities';
import { uploadFacilityImage, deleteFacilityImage } from '@/lib/supabase/storage';
import type { FacilityImage, FacilityImageType } from '@/types/facility';

/**
 * 施設画像アップロード・削除用フック
 * RPC を使用した一括保存に対応
 */
export const useFacilityImageUpload = (facilityId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 最新の画像リストを取得する
   */
  const fetchImages = useCallback(async (): Promise<FacilityImage[]> => {
    try {
      const supabase = createClient();
      const numericFacilityId = parseInt(facilityId, 10);
      if (isNaN(numericFacilityId)) return [];

      const images = await getFacilityImages(supabase, numericFacilityId);
      return images.map((img) => ({
        id: img.id,
        imageUrl: img.image_url,
        imageType: img.image_type as FacilityImageType,
        displayOrder: img.display_order,
      }));
    } catch (err) {
      console.warn('画像リストの取得に失敗:', err);
      return [];
    }
  }, [facilityId]);

  /**
   * 画像を一括保存する（RPC使用）
   * 1. 新規画像を全てStorageにアップロード
   * 2. RPCで削除・追加を一括実行（トランザクション）
   * 3. エラー時はアップロード済み画像を削除してロールバック
   * 4. 成功時は最新の画像リストを返す
   */
  const saveAllImages = useCallback(
    async (
      uploads: { file: File; type: FacilityImageType; displayOrder: number }[],
      deleteIds: number[],
    ): Promise<FacilityImage[]> => {
      setIsUploading(true);
      setError(null);

      const uploadedUrls: string[] = [];
      const supabase = createClient();

      try {
        const numericFacilityId = parseInt(facilityId, 10);
        if (isNaN(numericFacilityId)) {
          throw new Error('無効な施設IDです');
        }

        // 1. 全画像をStorageにアップロード
        const newImages: NewImageInput[] = [];
        for (const { file, type, displayOrder } of uploads) {
          const publicUrl = await uploadFacilityImage(
            supabase,
            numericFacilityId,
            type,
            file,
            displayOrder,
          );
          uploadedUrls.push(publicUrl);
          newImages.push({
            image_type: type,
            image_url: publicUrl,
            display_order: displayOrder,
          });
        }

        // 2. RPCで削除・追加を一括実行
        const result = await manageFacilityImages(
          supabase,
          numericFacilityId,
          deleteIds,
          newImages,
        );

        // 3. 削除された画像をStorageから削除
        for (const url of result.deleted_urls) {
          try {
            await deleteFacilityImage(supabase, url);
          } catch (storageError) {
            console.warn('Storage削除失敗（無視）:', storageError);
          }
        }

        // 4. 最新の画像リストを取得して返す
        return await fetchImages();
      } catch (err) {
        // ロールバック: アップロード済み画像を全て削除
        if (uploadedUrls.length > 0) {
          await Promise.allSettled(uploadedUrls.map((url) => deleteFacilityImage(supabase, url)));
        }
        const message = err instanceof Error ? err.message : '画像の保存に失敗しました';
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [facilityId, fetchImages],
  );

  return {
    saveAllImages,
    fetchImages,
    isUploading,
    error,
  };
};
