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
          alt="アップロード中"
          fill
          sizes={sizes}
          className={imageClassName}
          unoptimized
        />
        {pending.isUploading && <div className={styles.uploadingOverlay}>アップロード中...</div>}
      </div>
      {pending.error && (
        <div className={styles.errorMessage}>
          <span>{pending.error}</span>
          <button type="button" onClick={() => onDelete(pending.id)}>
            削除
          </button>
        </div>
      )}
    </div>
  );
};
