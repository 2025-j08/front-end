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
  // セキュリティ対策: ユーザー入力ファイル名を使用せず、ランダム生成されたファイル名を使用する
  // これによりパストラバーサルや特殊文字によるリスクを排除
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 11);

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
