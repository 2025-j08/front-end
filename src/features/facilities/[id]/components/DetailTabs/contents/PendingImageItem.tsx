'use client';

import Image from 'next/image';

import styles from './ImagesTab.module.scss';
import { PendingImage } from './types';

type PendingImageItemProps = {
  pending: PendingImage;
  onDelete: (id: string) => void;
  wrapperClassName?: string;
  imageClassName?: string;
  sizes?: string;
};

export const PendingImageItem = ({
  pending,
  onDelete,
  wrapperClassName = styles.thumbnailWrapper,
  imageClassName = styles.thumbnailImage,
  sizes = '400px',
}: PendingImageItemProps) => {
  return (
    <div className={styles.pendingItem}>
      <div className={wrapperClassName}>
        <Image
          src={pending.previewUrl}
          alt="追加予定の画像"
          fill
          sizes={sizes}
          className={imageClassName}
        />
        {pending.isUploading && <div className={styles.uploadingOverlay}>アップロード中...</div>}
      </div>
      {pending.error ? (
        <div className={styles.errorMessage}>
          <span>{pending.error}</span>
          <button type="button" onClick={() => onDelete(pending.id)}>
            削除
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(pending.id)}
          aria-label="追加予定の画像を取り消し"
        >
          追加を取り消す
        </button>
      )}
    </div>
  );
};
