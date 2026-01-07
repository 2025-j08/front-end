/**
 * 施設関連の型定義
 * 施設一覧と施設詳細で使用する型を定義
 */

// ============================================
// 施設一覧用の型
// ============================================

/** 施設一覧カード用の基本情報 */
export interface Facility {
  id: number;
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  imagePath: string | null;
}

/** ページネーション対応の施設リストデータ */
export interface FacilitiesData {
  totalCount: number;
  limit: number;
  pages: Record<string, Facility[]>;
}

// ============================================
// 施設詳細用の型
// ============================================

/** アクセス情報 */
export interface AccessInfo {
  locationAddress: string;
  lat: number;
  lng: number;
  /** 最寄り駅・バス停からのアクセス方法（オプショナル） */
  station?: string;
  /** ロケーションの詳細説明（オプショナル） */
  description?: string;
}

/** 理念情報 */
export interface PhilosophyInfo {
  title: string;
  description: string;
}

/** 生活環境・特色情報 */
export interface SpecialtyInfo {
  features: string[];
}

/** 職員詳細 */
export interface StaffDetail {
  role: string;
  description: string;
}

/** 職員情報 */
export interface StaffInfo {
  message: string;
  staffDetails: StaffDetail[];
}

/** 教育・進路支援情報 */
export interface EducationInfo {
  policy: string;
  afterCare: string;
}

/** 特色情報（タイトル付き） */
export interface AdvancedInfo {
  title?: string;
  description: string;
}

/** その他情報（文字列またはオブジェクト形式に対応） */
export type OtherInfo =
  | string
  | {
      title: string;
      description: string;
    };

/** 施設詳細情報 */
export interface FacilityDetail {
  /** 施設ID */
  id: number;
  /** 施設名（必須） */
  name: string;
  /** 完全住所（必須） */
  fullAddress: string;
  /** 電話番号（必須） */
  phone: string;
  /** 舎の区分（大舎・中舎・小舎） */
  dormitoryType?: '大舎' | '中舎' | '小舎';
  /** 対象年齢（必須） */
  targetAge: string;
  /** アクセス情報（必須） */
  accessInfo: AccessInfo;

  // --- 以下はオプショナルフィールド ---

  /** 運営法人名 */
  corporation?: string;
  /** ウェブサイトURL */
  websiteUrl?: string;
  /** 設立年 */
  establishedYear?: string;

  /** 建物情報 */
  building?: string;

  /** 地域連携情報 */
  relationInfo?: string;
  /** 理念情報 */
  philosophyInfo?: PhilosophyInfo;
  /** 生活環境情報 */
  specialtyInfo?: SpecialtyInfo;
  /** 職員情報 */
  staffInfo?: StaffInfo;
  /** 教育・進路支援情報 */
  educationInfo?: EducationInfo;
  /** 特色情報 */
  advancedInfo?: AdvancedInfo;
  /** その他情報 */
  otherInfo?: OtherInfo;
}

/** ID→施設詳細のマップ型 */
export type FacilityDataMap = Record<string, FacilityDetail>;
