import { FacilityImageType } from '@/types/facility';

/** アップロード中の画像プレビュー */
export type PendingImage = {
  id: string;
  imageType: FacilityImageType;
  displayOrder: number;
  previewUrl: string;
  file: File;
  isUploading: boolean;
  error?: string;
};
