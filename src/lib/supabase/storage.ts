/**
 * Supabase Storage 操作ユーティリティ
 * 施設画像のアップロード・削除を行う関数群
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/** Storage バケット名 */
const BUCKET_NAME = 'facility-images';

/**
 * ファイル名から一意のパスを生成
 * @param facilityId 施設ID
 * @param imageType 画像タイプ
 * @param displayOrder 表示順序（ギャラリーのみ）
 * @returns ファイルパス
 */
function generateFilePath(
  facilityId: number,
  imageType: 'thumbnail' | 'gallery',
  displayOrder: number = 0,
): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);

  if (imageType === 'thumbnail') {
    return `${facilityId}/thumbnail/${timestamp}_${randomStr}.webp`;
  }

  return `${facilityId}/gallery/${displayOrder}_${timestamp}_${randomStr}.webp`;
}

/**
 * 施設画像を Supabase Storage にアップロード
 * @param supabase Supabase クライアント
 * @param facilityId 施設ID
 * @param imageType 画像タイプ
 * @param blob 画像Blob（WebP形式）
 * @param displayOrder 表示順序（ギャラリーのみ）
 * @returns アップロードされた画像のパブリックURL
 */
export async function uploadFacilityImage(
  supabase: SupabaseClient,
  facilityId: number,
  imageType: 'thumbnail' | 'gallery',
  blob: Blob,
  displayOrder: number = 0,
): Promise<string> {
  const filePath = generateFilePath(facilityId, imageType, displayOrder);

  const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, blob, {
    contentType: 'image/webp',
    upsert: false,
  });

  if (uploadError) {
    throw new Error(`画像のアップロードに失敗しました: ${uploadError.message}`);
  }

  // パブリックURLを取得
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return publicUrl;
}

/**
 * 施設画像を Supabase Storage から削除
 * @param supabase Supabase クライアント
 * @param imageUrl 削除する画像のURL
 */
export async function deleteFacilityImage(
  supabase: SupabaseClient,
  imageUrl: string,
): Promise<void> {
  // URLからファイルパスを抽出
  // 形式: https://{project}.supabase.co/storage/v1/object/public/facility-images/{path}
  const bucketPath = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const pathIndex = imageUrl.indexOf(bucketPath);

  if (pathIndex === -1) {
    throw new Error('無効な画像URLです');
  }

  const filePath = imageUrl.substring(pathIndex + bucketPath.length);

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    throw new Error(`画像の削除に失敗しました: ${error.message}`);
  }
}

/**
 * 施設の既存画像を取得（特定タイプ）
 * @param supabase Supabase クライアント
 * @param facilityId 施設ID
 * @param imageType 画像タイプ
 * @returns 画像URL配列
 */
export async function listFacilityImages(
  supabase: SupabaseClient,
  facilityId: number,
  imageType: 'thumbnail' | 'gallery',
): Promise<string[]> {
  const folderPath = `${facilityId}/${imageType}`;

  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folderPath);

  if (error) {
    throw new Error(`画像一覧の取得に失敗しました: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((file) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${folderPath}/${file.name}`);
    return publicUrl;
  });
}

/**
 * 孤立した画像ファイルを削除（Option B: アップロード時チェック）
 * Storage に存在するが DB に登録されていないファイルを削除する
 * @param supabase Supabase クライアント
 * @param facilityId 施設ID
 */
export async function cleanupOrphanedImages(
  supabase: SupabaseClient,
  facilityId: number,
): Promise<{ deletedCount: number; error?: Error }> {
  try {
    // 1. DB に登録されている画像 URL 一覧を取得
    const { data: dbImages, error: dbError } = await supabase
      .from('facility_images')
      .select('image_url')
      .eq('facility_id', facilityId);

    if (dbError) {
      const error = new Error(`DB からの画像一覧取得に失敗: ${dbError.message}`);
      console.warn(error.message);
      return { deletedCount: 0, error };
    }

    const dbUrls = new Set(dbImages?.map((img) => img.image_url) || []);

    // 2. Storage 内のファイル一覧を取得（thumbnail と gallery の両方）
    const imageTypes: ('thumbnail' | 'gallery')[] = ['thumbnail', 'gallery'];
    const orphanedPaths: string[] = [];
    const errors: string[] = [];

    for (const imageType of imageTypes) {
      const folderPath = `${facilityId}/${imageType}`;
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(folderPath);

      if (listError) {
        const msg = `Storage 一覧取得に失敗 (${folderPath}): ${listError.message}`;
        console.warn(msg);
        errors.push(msg);
        continue;
      }

      if (!files || files.length === 0) continue;

      // 3. Storage にあるが DB にない = 孤立ファイル
      for (const file of files) {
        // .emptyFolderPlaceholder などのシステムファイルはスキップ
        if (file.name.startsWith('.')) continue;

        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${folderPath}/${file.name}`);

        if (!dbUrls.has(publicUrl)) {
          orphanedPaths.push(`${folderPath}/${file.name}`);
        }
      }
    }

    if (errors.length > 0) {
      return { deletedCount: 0, error: new Error(errors.join(', ')) };
    }

    // 4. 孤立ファイルを削除
    if (orphanedPaths.length > 0) {
      const { error: removeError } = await supabase.storage.from(BUCKET_NAME).remove(orphanedPaths);

      if (removeError) {
        const error = new Error(`孤立ファイルの削除に失敗: ${removeError.message}`);
        console.warn(error.message);
        return { deletedCount: 0, error };
      }

      console.info(`孤立ファイルを ${orphanedPaths.length} 件削除しました`);
      return { deletedCount: orphanedPaths.length };
    }

    return { deletedCount: 0 };
  } catch (err) {
    const error =
      err instanceof Error ? err : new Error('孤立ファイルのクリーンアップ中に不明なエラーが発生');
    console.warn('孤立ファイルのクリーンアップ中にエラー:', error);
    return { deletedCount: 0, error };
  }
}
