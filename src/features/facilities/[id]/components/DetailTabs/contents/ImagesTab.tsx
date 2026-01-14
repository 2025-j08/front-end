'use client';

import Image from 'next/image';
import { useState, useCallback, DragEvent } from 'react';

import { FacilityImage, FacilityImageType } from '@/types/facility';
import { validateImageFile, convertToWebP, createImagePreview } from '@/lib/imageUtils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

import { TabSaveButton } from './TabSaveButton';
import styles from './TabContent.module.scss';
import imageStyles from './ImagesTab.module.scss';
import { PendingImage } from './types';
import { ImageDropZone } from './ImageDropZone';
import { PendingImageItem } from './PendingImageItem';

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
  // 画像タブには常にデータが存在する（空配列でも表示可能）ため、
  // 他のタブと異なり条件分岐は不要ですが、一貫性のために理由を明記しています。
  // (isEditMode || images)

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [dragOver, setDragOver] = useState<FacilityImageType | null>(null);

  // ダイアログ管理（カスタムフック）
  const { dialogConfig, showDialog, closeDialog, showError } = useConfirmDialog();

  // 保存ハンドラー（一括実行用）
  // 既存の onSave (TabSaveButtonから呼ばれる) はこの内部ロジックを使用しない（Props経由で上位から呼ばれるため）
  // ここでは上位コンポーネントがこれらのStateを受け取って処理することを想定しているが、
  // 現在の実装では onSave は親から渡される無名関数（saveHandlers.images）である。
  // そのため、pendingImages と deleteIds を親に渡すか、
  // あるいはここで saveHandlers.images の中身をオーバーライドする必要がある。
  // しかし、TabSaveButton は onSave を実行するだけ。

  // NOTE: ここでは「保存ボタンが押されたとき」に実行されるアクションとして
  // ImagesTab内部で pending 状態を解決するロジックを実装したいが、
  // TabSaveButton は単に props.onSave を呼ぶだけである。
  // "上位コンポーネントで一括保存" という要件であれば、上位で state を持つべきだが、
  // 今回は "ImagesTabの保存ボタン" で完結させるため、
  // 親から渡された onSave をラップする形にするか、
  // あるいは useFacilityImageUpload の saveAllImages をここで直接使う形にリファクタリングする。

  // しかし、ImagesTabのProps定義を変えずに実装するには、
  // 親からの onSave が呼ばれる前に、ここでの処理を割り込ませる必要がある。
  // TabSaveButton の onSave に、ここでの handleSave を渡せばよい。

  // 既存画像を取得（削除対象を除外）
  const validImages = images.filter((img) => !deleteIds.includes(img.id));

  const thumbnail = validImages.find((img) => img.imageType === 'thumbnail');
  const galleryImages = validImages
    .filter((img) => img.imageType === 'gallery')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // ファイル選択ハンドラー
  const handleFileSelect = useCallback(
    async (files: FileList | null, imageType: FacilityImageType) => {
      if (!files || files.length === 0 || !onUpload) return;

      const file = files[0];
      const validation = validateImageFile(file);

      if (!validation.isValid) {
        showError(validation.error || '無効なファイルです');
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
          showError('ギャラリー画像は最大3枚までです。');
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
    [onUpload, galleryImages, pendingImages, showError],
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
    (imageId: number) => {
      if (!onDelete) return;

      showDialog({
        title: '削除の確認',
        message: 'この画像を削除しますか？',
        isDanger: true,
        confirmLabel: '削除する',
        onConfirm: async () => {
          try {
            await onDelete(imageId);
            closeDialog();
          } catch (error) {
            closeDialog();
            showError(error instanceof Error ? error.message : '削除に失敗しました');
          }
        },
      });
    },
    [onDelete, showDialog, closeDialog, showError],
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
              <ImageDropZone
                isDragOver={dragOver === 'thumbnail'}
                onFileSelect={(files) => handleFileSelect(files, 'thumbnail')}
                onDragOver={(e) => handleDragOver(e, 'thumbnail')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'thumbnail')}
                ariaLabel="サムネイル画像を選択"
              />
            )}

            {/* サムネイルのpending表示 */}
            {pendingImages
              .filter((p) => p.imageType === 'thumbnail')
              .map((pending) => (
                <PendingImageItem
                  key={pending.id}
                  pending={pending}
                  onDelete={handlePendingDelete}
                  wrapperClassName={imageStyles.thumbnailWrapper}
                  imageClassName={imageStyles.thumbnailImage}
                />
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
                  <PendingImageItem
                    key={pending.id}
                    pending={pending}
                    onDelete={handlePendingDelete}
                    wrapperClassName={imageStyles.galleryItemWrapper}
                    imageClassName={imageStyles.galleryImage}
                    sizes="300px"
                  />
                ))}

              {/* 追加ボタン（3枚未満の場合） */}
              {galleryImages.length +
                pendingImages.filter((p) => p.imageType === 'gallery').length <
                3 && (
                <ImageDropZone
                  isDragOver={dragOver === 'gallery'}
                  onFileSelect={(files) => handleFileSelect(files, 'gallery')}
                  onDragOver={(e) => handleDragOver(e, 'gallery')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'gallery')}
                  ariaLabel="ギャラリー画像を追加"
                />
              )}
            </div>
          </section>
        </div>
      </div>
      {onSave && <TabSaveButton onSave={onSave} isSaving={isSaving} isDirty={isDirty} />}

      <ConfirmDialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        cancelLabel={dialogConfig.cancelLabel}
        isDanger={dialogConfig.isDanger}
        showCancel={dialogConfig.showCancel}
        onConfirm={dialogConfig.onConfirm!}
        onCancel={dialogConfig.onCancel || closeDialog}
      />
    </>
  );
};
