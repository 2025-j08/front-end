'use client';

import { useCallback, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import {
  insertFacilityImage,
  deleteFacilityImageById,
  getFacilityImages,
} from '@/lib/supabase/mutations/facilities';
import {
  uploadFacilityImage,
  deleteFacilityImage,
  cleanupOrphanedImages,
} from '@/lib/supabase/storage';
import type { FacilityImage, FacilityImageType } from '@/types/facility';

/**
 * 施設画像アップロード・削除用フック
 */
export const useFacilityImageUpload = (facilityId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 画像をアップロードしてDBに登録する
   */
  const uploadImage = useCallback(
    async (file: File, imageType: FacilityImageType, displayOrder: number) => {
      setIsUploading(true);
      setError(null);

      try {
        const supabase = createClient();
        const numericFacilityId = parseInt(facilityId, 10);

        if (isNaN(numericFacilityId)) {
          throw new Error('無効な施設IDです');
        }

        // 1. Storageにアップロード
        const publicUrl = await uploadFacilityImage(
          supabase,
          numericFacilityId,
          imageType,
          file,
          displayOrder,
        );

        // 2. DBに登録
        await insertFacilityImage(supabase, {
          facility_id: numericFacilityId,
          image_type: imageType,
          image_url: publicUrl,
          display_order: displayOrder,
        });

        // 3. 孤立ファイルのクリーンアップ（バックグラウンドで実行）
        // アップロード成功後に実行することで、過去の失敗/中断によるゴミファイルを削除
        cleanupOrphanedImages(supabase, numericFacilityId).catch((err) => {
          console.warn('孤立ファイルのクリーンアップに失敗:', err);
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : '画像のアップロードに失敗しました';
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [facilityId],
  );

  /**
   * 画像を削除する（DB削除 -> Storage削除）
   */
  const deleteImage = useCallback(async (imageId: number) => {
    setIsUploading(true); // 削除中もローディング扱い
    setError(null);

    try {
      const supabase = createClient();

      // 1. DBから削除 (削除された画像のURLを取得)
      const { imageUrl } = await deleteFacilityImageById(supabase, imageId);

      // 2. Storageから削除 (エラーでも続行するか検討だが、ゴミデータが残るだけなので警告のみでよいかも)
      // Storage削除は非同期で投げっぱなしにする手もあるが、awaitしておく
      if (imageUrl) {
        try {
          await deleteFacilityImage(supabase, imageUrl);
        } catch (storageError) {
          console.warn('Storageからの削除に失敗しました:', storageError);
          // DBからは削除されているので、ユーザーへのエラーとしては扱わない
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '画像の削除に失敗しました';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

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
      console.warn('画像リストの取得に失敗しました:', err);
      return [];
    }
  }, [facilityId]);

  return {
    uploadImage,
    deleteImage,
    fetchImages,
    isUploading,
    error,
  };
};
