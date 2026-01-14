'use client';

import Image from 'next/image';
import { useState, useCallback, useRef, ChangeEvent, DragEvent } from 'react';

import { FacilityImage, FacilityImageType } from '@/types/facility';
import { validateImageFile, convertToWebP, createImagePreview } from '@/lib/imageUtils';

import { TabSaveButton } from './TabSaveButton';
import styles from './TabContent.module.scss';
import imageStyles from './ImagesTab.module.scss';

/** アップロード中の画像プレビュー */
type PendingImage = {
  id: string;
  imageType: FacilityImageType;
  displayOrder: number;
  previewUrl: string;
  file: File;
  isUploading: boolean;
  error?: string;
};

type ImagesTabProps = {
  /** 保存済み画像データ */
  images?: FacilityImage[];
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** 画像アップロード時のコールバック */
  onUpload?: (imageType: FacilityImageType, file: File, displayOrder: number) => Promise<void>;
  /** 画像削除時のコールバック */
  onDelete?: (imageId: number) => Promise<void>;
  /** 保存ハンドラー */
  onSave?: () => Promise<void>;
  /** 保存中フラグ */
  isSaving?: boolean;
  /** 変更されたか */
  isDirty?: boolean;
};

/**
 * 画像タブコンポーネント
 * 施設のサムネイルとギャラリー画像を表示・管理
 */
export const ImagesTab = ({
  images = [],
  isEditMode = false,
  onUpload,
  onDelete,
  onSave,
  isSaving = false,
  isDirty = false,
}: ImagesTabProps) => {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [dragOver, setDragOver] = useState<FacilityImageType | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // 既存画像を取得
  const thumbnail = images.find((img) => img.imageType === 'thumbnail');
  const galleryImages = images
    .filter((img) => img.imageType === 'gallery')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // ファイル選択ハンドラー
  const handleFileSelect = useCallback(
    async (files: FileList | null, imageType: FacilityImageType) => {
      if (!files || files.length === 0 || !onUpload) return;

      const file = files[0];
      const validation = validateImageFile(file);

      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // 表示順序を決定
      let displayOrder = 0;
      if (imageType === 'gallery') {
        const usedOrders = new Set([
          ...galleryImages.map((img) => img.displayOrder),
          ...pendingImages.filter((p) => p.imageType === 'gallery').map((p) => p.displayOrder),
        ]);

        // 0, 1, 2 の順で空きを探す
        let found = false;
        for (let i = 0; i < 3; i++) {
          if (!usedOrders.has(i)) {
            displayOrder = i;
            found = true;
            break;
          }
        }

        if (!found) {
          alert('ギャラリー画像は最大3枚までです。');
          return;
        }
      }

      const pendingId = `pending-${Date.now()}`;
      const previewUrl = await createImagePreview(file);

      // プレビュー追加
      setPendingImages((prev) => [
        ...prev,
        {
          id: pendingId,
          imageType,
          displayOrder,
          previewUrl,
          file,
          isUploading: true,
        },
      ]);

      try {
        // WebP変換してアップロード
        const webpBlob = await convertToWebP(file, imageType);
        const webpFile = new File([webpBlob], file.name.replace(/\.[^.]+$/, '.webp'), {
          type: 'image/webp',
        });

        await onUpload(imageType, webpFile, displayOrder);

        // 成功したら pending から削除
        setPendingImages((prev) => prev.filter((p) => p.id !== pendingId));
      } catch (error) {
        // エラー表示
        setPendingImages((prev) =>
          prev.map((p) =>
            p.id === pendingId
              ? {
                  ...p,
                  isUploading: false,
                  error: error instanceof Error ? error.message : 'アップロードに失敗しました',
                }
              : p,
          ),
        );
      }
    },
    [onUpload, galleryImages, pendingImages],
  );

  // ドラッグ&ドロップハンドラー
  const handleDragOver = useCallback((e: DragEvent, imageType: FacilityImageType) => {
    e.preventDefault();
    setDragOver(imageType);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent, imageType: FacilityImageType) => {
      e.preventDefault();
      setDragOver(null);
      handleFileSelect(e.dataTransfer.files, imageType);
    },
    [handleFileSelect],
  );

  // 画像削除ハンドラー
  const handleDelete = useCallback(
    async (imageId: number) => {
      if (!onDelete) return;
      if (!confirm('この画像を削除しますか？')) return;

      try {
        await onDelete(imageId);
      } catch (error) {
        alert(error instanceof Error ? error.message : '削除に失敗しました');
      }
    },
    [onDelete],
  );

  // pending画像の削除
  const handlePendingDelete = useCallback((pendingId: string) => {
    setPendingImages((prev) => prev.filter((p) => p.id !== pendingId));
  }, []);

  // 閲覧モード
  if (!isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={imageStyles.imagesContainer}>
          {/* ギャラリー */}
          <section className={imageStyles.section}>
            <h3 className={styles.contentTitle}>詳細画面用ギャラリー</h3>
            {galleryImages.length > 0 ? (
              <div className={imageStyles.galleryGrid}>
                {galleryImages.map((img) => (
                  <div key={img.id} className={imageStyles.galleryItem}>
                    <Image
                      src={img.imageUrl}
                      alt={`施設画像 ${img.displayOrder + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={imageStyles.galleryImage}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={imageStyles.noImage}>
                <span>ギャラリー画像がありません</span>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // 編集モード
  return (
    <>
      <div className={styles.tabContentWrapper}>
        <div className={imageStyles.imagesContainer}>
          {/* サムネイルアップロード */}
          <section className={imageStyles.section}>
            <h3 className={styles.contentTitle}>一覧画面用サムネイル（1枚）</h3>
            <p className={imageStyles.helpText}>
              JPEG または PNG 形式の画像をアップロードしてください。自動的に WebP
              形式に変換されます。
            </p>

            {thumbnail ? (
              <div className={imageStyles.uploadedItem}>
                <div className={imageStyles.thumbnailWrapper}>
                  <Image
                    src={thumbnail.imageUrl}
                    alt="施設サムネイル"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={imageStyles.thumbnailImage}
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  className={imageStyles.deleteButton}
                  onClick={() => handleDelete(thumbnail.id)}
                  aria-label="サムネイル画像を削除"
                >
                  削除
                </button>
              </div>
            ) : (
              <div
                className={`${imageStyles.dropZone} ${dragOver === 'thumbnail' ? imageStyles.dragOver : ''}`}
                onDragOver={(e) => handleDragOver(e, 'thumbnail')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'thumbnail')}
                onClick={() => thumbnailInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    thumbnailInputRef.current?.click();
                  }
                }}
              >
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileSelect(e.target.files, 'thumbnail')
                  }
                  className={imageStyles.hiddenInput}
                  aria-label="サムネイル画像を選択"
                />
                <div className={imageStyles.dropZoneContent}>
                  <span className={imageStyles.dropIcon}>📷</span>
                  <span>クリックまたはドラッグ&ドロップで画像を選択</span>
                </div>
              </div>
            )}

            {/* サムネイルのpending表示 */}
            {pendingImages
              .filter((p) => p.imageType === 'thumbnail')
              .map((pending) => (
                <div key={pending.id} className={imageStyles.pendingItem}>
                  <div className={imageStyles.thumbnailWrapper}>
                    <Image
                      src={pending.previewUrl}
                      alt="アップロード中"
                      fill
                      sizes="400px"
                      className={imageStyles.thumbnailImage}
                      unoptimized
                    />
                    {pending.isUploading && (
                      <div className={imageStyles.uploadingOverlay}>アップロード中...</div>
                    )}
                  </div>
                  {pending.error && (
                    <div className={imageStyles.errorMessage}>
                      <span>{pending.error}</span>
                      <button type="button" onClick={() => handlePendingDelete(pending.id)}>
                        削除
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </section>

          {/* ギャラリーアップロード */}
          <section className={imageStyles.section}>
            <h3 className={styles.contentTitle}>詳細画面用ギャラリー（最大3枚）</h3>
            <p className={imageStyles.helpText}>
              JPEG または PNG 形式の画像をアップロードしてください。自動的に WebP
              形式に変換されます。
            </p>

            <div className={imageStyles.galleryEditGrid}>
              {/* 既存のギャラリー画像 */}
              {galleryImages.map((img) => (
                <div key={img.id} className={imageStyles.uploadedItem}>
                  <div className={imageStyles.galleryItemWrapper}>
                    <Image
                      src={img.imageUrl}
                      alt={`施設画像 ${img.displayOrder + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className={imageStyles.galleryImage}
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    className={imageStyles.deleteButton}
                    onClick={() => handleDelete(img.id)}
                    aria-label={`ギャラリー画像${img.displayOrder + 1}を削除`}
                  >
                    削除
                  </button>
                </div>
              ))}

              {/* pending のギャラリー画像 */}
              {pendingImages
                .filter((p) => p.imageType === 'gallery')
                .map((pending) => (
                  <div key={pending.id} className={imageStyles.pendingItem}>
                    <div className={imageStyles.galleryItemWrapper}>
                      <Image
                        src={pending.previewUrl}
                        alt="アップロード中"
                        fill
                        sizes="300px"
                        className={imageStyles.galleryImage}
                        unoptimized
                      />
                      {pending.isUploading && (
                        <div className={imageStyles.uploadingOverlay}>アップロード中...</div>
                      )}
                    </div>
                    {pending.error && (
                      <div className={imageStyles.errorMessage}>
                        <span>{pending.error}</span>
                        <button type="button" onClick={() => handlePendingDelete(pending.id)}>
                          削除
                        </button>
                      </div>
                    )}
                  </div>
                ))}

              {/* 追加ボタン（3枚未満の場合） */}
              {galleryImages.length +
                pendingImages.filter((p) => p.imageType === 'gallery').length <
                3 && (
                <div
                  className={`${imageStyles.dropZone} ${dragOver === 'gallery' ? imageStyles.dragOver : ''}`}
                  onDragOver={(e) => handleDragOver(e, 'gallery')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'gallery')}
                  onClick={() => galleryInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      galleryInputRef.current?.click();
                    }
                  }}
                >
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFileSelect(e.target.files, 'gallery')
                    }
                    className={imageStyles.hiddenInput}
                    aria-label="ギャラリー画像を追加"
                  />
                  <div className={imageStyles.dropZoneContent}>
                    <span className={imageStyles.dropIcon}>📷</span>
                    <span>クリックまたはドラッグ&ドロップで画像を選択</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      {onSave && <TabSaveButton onSave={onSave} isSaving={isSaving} isDirty={isDirty} />}
    </>
  );
};
