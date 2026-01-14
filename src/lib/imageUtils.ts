/**
 * 画像処理ユーティリティ
 * 画像の変換・リサイズ・検証を行う関数群
 */

/** 許可される入力画像のMIMEタイプ */
const ALLOWED_INPUT_TYPES = ['image/jpeg', 'image/png'] as const;

/** サムネイル画像の最大サイズ（px） */
const THUMBNAIL_MAX_WIDTH = 400;
const THUMBNAIL_MAX_HEIGHT = 300;

/** ギャラリー画像の最大サイズ（px） */
const GALLERY_MAX_WIDTH = 1200;
const GALLERY_MAX_HEIGHT = 900;

/** WebP変換後の最大ファイルサイズ（バイト） */
const MAX_OUTPUT_SIZE = 1024 * 1024; // 1MB

/** 画像検証結果 */
export type ImageValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * 入力画像ファイルの検証
 * @param file 検証対象のファイル
 * @returns 検証結果
 */
export function validateImageFile(file: File): ImageValidationResult {
  // MIMEタイプチェック
  if (!ALLOWED_INPUT_TYPES.includes(file.type as (typeof ALLOWED_INPUT_TYPES)[number])) {
    return {
      isValid: false,
      error: '対応している画像形式はJPEGまたはPNGのみです。',
    };
  }

  // ファイルサイズチェック（入力は10MBまで許容）
  const maxInputSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxInputSize) {
    return {
      isValid: false,
      error: '画像ファイルのサイズは10MB以下にしてください。',
    };
  }

  return { isValid: true };
}

/**
 * 画像をリサイズしてCanvasに描画
 * @param img 画像要素
 * @param maxWidth 最大幅
 * @param maxHeight 最大高さ
 * @returns リサイズ後のCanvas
 */
function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
): HTMLCanvasElement {
  let { width, height } = img;

  if (width <= 0 || height <= 0) {
    throw new Error('画像の幅または高さが正しくありません');
  }

  // アスペクト比を維持してリサイズ
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context の取得に失敗しました');
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

/**
 * ファイルをHTMLImageElementとして読み込む
 * @param file 画像ファイル
 * @returns Promise<HTMLImageElement>
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('画像の読み込みに失敗しました'));
    };

    img.src = url;
  });
}

/**
 * CanvasからWebP Blobを生成（品質を調整してサイズ制限に収める）
 * @param canvas 変換元のCanvas
 * @param maxSizeBytes 最大サイズ（バイト）
 * @returns Promise<Blob>
 */
async function canvasToWebP(canvas: HTMLCanvasElement, maxSizeBytes: number): Promise<Blob> {
  // 品質を段階的に下げて試行
  const qualities = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4];

  for (const quality of qualities) {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', quality);
    });

    if (blob && blob.size <= maxSizeBytes) {
      return blob;
    }
  }

  throw new Error(
    `画像を${Math.round(maxSizeBytes / 1024 / 1024)}MB以内に圧縮できませんでした。より小さい画像を使用してください。`,
  );
}

/**
 * 画像をWebP形式に変換（サムネイル用）
 * @param file 元の画像ファイル（JPEG/PNG）
 * @returns 変換後のWebP Blob
 * @throws 変換後に1MBを超過した場合はエラー
 */
export async function convertToThumbnailWebP(file: File): Promise<Blob> {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const img = await loadImageFromFile(file);
  const canvas = resizeImage(img, THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_HEIGHT);
  return canvasToWebP(canvas, MAX_OUTPUT_SIZE);
}

/**
 * 画像をWebP形式に変換（ギャラリー用）
 * @param file 元の画像ファイル（JPEG/PNG）
 * @returns 変換後のWebP Blob
 * @throws 変換後に1MBを超過した場合はエラー
 */
export async function convertToGalleryWebP(file: File): Promise<Blob> {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const img = await loadImageFromFile(file);
  const canvas = resizeImage(img, GALLERY_MAX_WIDTH, GALLERY_MAX_HEIGHT);
  return canvasToWebP(canvas, MAX_OUTPUT_SIZE);
}

/**
 * 画像タイプに応じてWebPに変換
 * @param file 元の画像ファイル
 * @param imageType 画像タイプ
 * @returns 変換後のWebP Blob
 */
export async function convertToWebP(file: File, imageType: 'thumbnail' | 'gallery'): Promise<Blob> {
  if (imageType === 'thumbnail') {
    return convertToThumbnailWebP(file);
  }
  return convertToGalleryWebP(file);
}

/**
 * 画像ファイルからプレビューURL（Data URL）を生成
 * @param file 画像ファイル
 * @returns Promise<string> Data URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}
