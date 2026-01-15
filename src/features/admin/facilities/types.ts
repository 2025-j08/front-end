/**
 * 施設管理機能で使用する型定義
 */

import type { KinkiPrefecture } from '@/types/facility';

/**
 * 施設追加フォームのデータ型
 */
export interface AddFacilityFormData {
  name: string;
  corporation: string;
  postalCode1: string;
  postalCode2: string;
  prefecture: KinkiPrefecture;
  city: string;
  addressDetail: string;
}

/**
 * 施設追加フォームのエラー型
 */
export interface AddFacilityFormErrors {
  name?: string;
  corporation?: string;
  postalCode1?: string;
  postalCode2?: string;
  prefecture?: string;
  city?: string;
  addressDetail?: string;
}

/**
 * 施設管理テーブルのバリデーションエラー型
 */
export interface FacilityTableValidationErrors {
  name?: string;
  postalCode?: string;
  city?: string;
}

/**
 * 施設更新データの型
 */
export interface FacilityUpdateData {
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressDetail: string;
}
