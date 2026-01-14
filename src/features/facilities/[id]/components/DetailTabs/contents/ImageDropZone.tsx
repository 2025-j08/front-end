'use client';

import { ChangeEvent, DragEvent, useRef } from 'react';

import styles from './ImagesTab.module.scss';

type ImageDropZoneProps = {
  isDragOver: boolean;
  onFileSelect: (files: FileList | null) => void;
  onDragOver: (e: DragEvent) => void; // Parent should handle currying if needed
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  ariaLabel: string;
  className?: string;
};

export const ImageDropZone = ({
  isDragOver,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  ariaLabel,
  className = '',
}: ImageDropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''} ${className}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e: ChangeEvent<HTMLInputElement>) => onFileSelect(e.target.files)}
        className={styles.hiddenInput}
        aria-label={ariaLabel}
      />
      <div className={styles.dropZoneContent}>
        <span className={styles.dropIcon}>📷</span>
        <span>クリックまたはドラッグ&ドロップで画像を選択</span>
      </div>
    </div>
  );
};
