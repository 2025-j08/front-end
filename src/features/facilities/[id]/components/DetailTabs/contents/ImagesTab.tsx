'use client';

import Image from 'next/image';
import {
  useState,
  useCallback,
  DragEvent,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';

import { FacilityImage, FacilityImageType } from '@/types/facility';
import { validateImageFile, convertToWebP, createImagePreview } from '@/lib/imageUtils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

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
  /** 一括保存ハンドラー（RPC使用） */
  onBatchSave?: (
    uploads: { file: File; type: FacilityImageType; displayOrder: number }[],
    deleteIds: number[],
  ) => Promise<void>;
  /** 保存中フラグ */
  isSaving?: boolean;
  /** 状態変更通知 */
  onStateChange?: (state: { isDirty: boolean; isSaving: boolean }) => void;
};

export type ImagesTabHandle = {
  save: () => Promise<void>;
  /** 未保存の変更を破棄して初期状態に戻す */
  reset: () => void;
};

/**
 * 画像タブコンポーネント
 * 施設のサムネイルとギャラリー画像を表示・管理
 *
 * 遅延保存方式:
 * - 画像選択時: プレビュー表示のみ（通信なし）
 * - 削除ボタン: UIから非表示にするのみ（通信なし）
 * - 保存ボタン: 一括でアップロード・削除を実行
 */
export const ImagesTab = forwardRef<ImagesTabHandle, ImagesTabProps>(
  ({ images = [], isEditMode = false, onBatchSave, onStateChange }, ref) => {
    // 画像タブには常にデータが存在する（空配列でも表示可能）ため、
    // 他のタブと異なり条件分岐は不要

    // 保存待ちの新規画像
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    // 削除待ちの画像ID
    const [deleteIds, setDeleteIds] = useState<number[]>([]);
    // ドラッグ状態
    const [dragOver, setDragOver] = useState<FacilityImageType | null>(null);
    // 保存中フラグ
    const [isBatchSaving, setIsBatchSaving] = useState(false);

    // ダイアログ管理
    const { dialogConfig, closeDialog, showError } = useConfirmDialog();

    // 削除対象を除外した有効な画像
    const validImages = images.filter((img) => !deleteIds.includes(img.id));
    const thumbnail = validImages.find((img) => img.imageType === 'thumbnail');
    const galleryImages = validImages
      .filter((img) => img.imageType === 'gallery')
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // 変更があるかどうか
    const hasChanges = pendingImages.length > 0 || deleteIds.length > 0;

    // 状態変更を親に通知
    useEffect(() => {
      onStateChange?.({ isDirty: hasChanges, isSaving: isBatchSaving });
    }, [hasChanges, isBatchSaving, onStateChange]);

    // ファイル選択ハンドラー（プレビュー追加のみ、アップロードしない）
    const handleFileSelect = useCallback(
      async (files: FileList | null, imageType: FacilityImageType) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const newPendings: PendingImage[] = [];

        for (const file of fileArray) {
          const validation = validateImageFile(file);
          if (!validation.isValid) {
            showError(validation.error || '無効なファイルです');
            continue;
          }

          // サムネイルの場合、既存またはpendingがあればスキップ
          if (imageType === 'thumbnail') {
            const hasThumbnail =
              thumbnail ||
              pendingImages.some((p) => p.imageType === 'thumbnail') ||
              newPendings.some((p) => p.imageType === 'thumbnail');
            if (hasThumbnail) {
              showError('サムネイルは1枚のみです。既存を削除してから追加してください。');
              continue;
            }
          }

          // ギャラリーの場合、表示順序を決定
          let displayOrder = 0;
          if (imageType === 'gallery') {
            const usedOrders = new Set([
              ...galleryImages.map((img) => img.displayOrder),
              ...pendingImages.filter((p) => p.imageType === 'gallery').map((p) => p.displayOrder),
              ...newPendings.filter((p) => p.imageType === 'gallery').map((p) => p.displayOrder),
            ]);

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
              continue;
            }
          }

          const pendingId = `pending-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
          const previewUrl = await createImagePreview(file);

          newPendings.push({
            id: pendingId,
            imageType,
            displayOrder,
            previewUrl,
            file,
            isUploading: false, // まだアップロードしない
          });
        }

        if (newPendings.length > 0) {
          setPendingImages((prev) => [...prev, ...newPendings]);
        }
      },
      [thumbnail, galleryImages, pendingImages, showError],
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

    // 既存画像の削除予約（UIから非表示にするだけ）
    const handleDelete = useCallback((imageId: number) => {
      setDeleteIds((prev) => [...prev, imageId]);
    }, []);

    // pending画像の削除（まだアップロードしていないので単純に削除）
    const handlePendingDelete = useCallback((pendingId: string) => {
      setPendingImages((prev) => prev.filter((p) => p.id !== pendingId));
    }, []);

    // 削除のキャンセル（復元）
    const handleRestoreDelete = useCallback((imageId: number) => {
      setDeleteIds((prev) => prev.filter((id) => id !== imageId));
    }, []);

    // 一括保存処理（RPC使用）
    const handleBatchSave = useCallback(async () => {
      if (!hasChanges) {
        // 変更がなければ何もしない
        return;
      }

      if (!onBatchSave) {
        showError('保存機能が利用できません');
        return;
      }

      setIsBatchSaving(true);

      try {
        // アップロード中表示
        if (pendingImages.length > 0) {
          setPendingImages((prev) => prev.map((p) => ({ ...p, isUploading: true })));
        }

        // WebP変換してアップロード用データを準備
        const uploads: { file: File; type: FacilityImageType; displayOrder: number }[] = [];
        for (let i = 0; i < pendingImages.length; i++) {
          const pending = pendingImages[i];
          const webpBlob = await convertToWebP(pending.file, pending.imageType);
          // ファイル名に日本語が含まれていると上流サーバーで502エラーになる場合があるため、
          // 安全なASCIIファイル名に置換する。インデックスとランダム文字列で一意性を担保。
          const safeFileName = `image_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 11)}.webp`;
          const webpFile = new File([webpBlob], safeFileName, {
            type: 'image/webp',
          });
          uploads.push({
            file: webpFile,
            type: pending.imageType,
            displayOrder: pending.displayOrder,
          });
        }

        // 一括保存実行（RPC: 全成功 or 全失敗）
        await onBatchSave(uploads, deleteIds);

        // 成功したらステートをクリア
        setDeleteIds([]);
        setPendingImages([]);
      } catch (error) {
        showError(error instanceof Error ? error.message : '保存処理中にエラーが発生しました');
        // エラー時はアップロード中フラグを戻す
        setPendingImages((prev) => prev.map((p) => ({ ...p, isUploading: false })));
      } finally {
        setIsBatchSaving(false);
      }
    }, [hasChanges, deleteIds, pendingImages, onBatchSave, showError]);

    // 親コンポーネントから save / reset を呼び出せるようにする
    useImperativeHandle(ref, () => ({
      save: handleBatchSave,
      reset: () => {
        setPendingImages([]);
        setDeleteIds([]);
      },
    }));

    // 閲覧モード
    if (!isEditMode) {
      return (
        <div className={styles.tabContentWrapper}>
          <div className={imageStyles.imagesContainer}>
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
            {/* サムネイルセクション */}
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
                    />
                  </div>
                  <button
                    type="button"
                    className={imageStyles.deleteButton}
                    onClick={() => handleDelete(thumbnail.id)}
                    aria-label="サムネイル画像を削除予約"
                  >
                    削除（保存時に反映）
                  </button>
                </div>
              ) : pendingImages.some((p) => p.imageType === 'thumbnail') ? null : (
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

              {/* 削除予約中のサムネイル（復元可能） */}
              {images
                .filter((img) => img.imageType === 'thumbnail' && deleteIds.includes(img.id))
                .map((img) => (
                  <div
                    key={img.id}
                    className={`${imageStyles.uploadedItem} ${imageStyles.deletePending}`}
                  >
                    <div className={imageStyles.thumbnailWrapper}>
                      <Image
                        src={img.imageUrl}
                        alt="削除予定: 施設サムネイル"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className={imageStyles.thumbnailImage}
                        style={{ opacity: 0.5 }}
                      />
                    </div>
                    <button
                      type="button"
                      className={imageStyles.restoreButton}
                      onClick={() => handleRestoreDelete(img.id)}
                      aria-label="サムネイル画像の削除を取り消し"
                    >
                      削除を取り消す
                    </button>
                  </div>
                ))}
            </section>

            {/* ギャラリーセクション */}
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
                      />
                    </div>
                    <button
                      type="button"
                      className={imageStyles.deleteButton}
                      onClick={() => handleDelete(img.id)}
                      aria-label={`ギャラリー画像${img.displayOrder + 1}を削除予約`}
                    >
                      削除（保存時に反映）
                    </button>
                  </div>
                ))}

                {/* 削除予約の画像（復元可能） */}
                {images
                  .filter((img) => img.imageType === 'gallery' && deleteIds.includes(img.id))
                  .map((img) => (
                    <div
                      key={img.id}
                      className={`${imageStyles.uploadedItem} ${imageStyles.deletePending}`}
                    >
                      <div className={imageStyles.galleryItemWrapper}>
                        <Image
                          src={img.imageUrl}
                          alt={`削除予定: 施設画像 ${img.displayOrder + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className={imageStyles.galleryImage}
                          style={{ opacity: 0.5 }}
                        />
                      </div>
                      <button
                        type="button"
                        className={imageStyles.restoreButton}
                        onClick={() => handleRestoreDelete(img.id)}
                        aria-label={`ギャラリー画像${img.displayOrder + 1}の削除を取り消し`}
                      >
                        削除を取り消す
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
                    multiple
                  />
                )}
              </div>
            </section>
          </div>
        </div>

        <ConfirmDialog
          isOpen={dialogConfig.isOpen}
          title={dialogConfig.title}
          message={dialogConfig.message}
          confirmLabel={dialogConfig.confirmLabel}
          cancelLabel={dialogConfig.cancelLabel}
          isDanger={dialogConfig.isDanger}
          showCancel={dialogConfig.showCancel}
          onConfirm={dialogConfig.onConfirm || (() => {})}
          onCancel={dialogConfig.onCancel || closeDialog}
        />
      </>
    );
  },
);

ImagesTab.displayName = 'ImagesTab';
