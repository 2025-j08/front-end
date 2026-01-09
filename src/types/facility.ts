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
  /** 周囲の環境（住宅街、山間部、都市部など） */
  environment?: string;
}

/** 理念情報 */
export interface PhilosophyInfo {
  /** 施設として大切にしている理念や価値観 */
  title: string;
  /** 日々の支援の中で重視している視点 */
  description: string;
}

/** 生活環境・特色情報 */
export interface SpecialtyInfo {
  /** 当施設が特に力を入れている取り組み */
  features: string[];
  /** 特色ある活動や独自プログラム */
  programs?: string;
}

/** 職員情報 */
export interface StaffInfo {
  /** 職員数（常勤/非常勤、職種別） */
  staffCount?: string;
  /** 職員の特徴・専門性 */
  specialties?: string;
  /** 平均勤続年数 */
  averageTenure?: string;
  /** 年齢層の傾向 */
  ageDistribution?: string;
  /** 働き方の特徴（年休、有給平均、福利厚生等） */
  workStyle?: string;
  /** 大学講義を担当している職員（有/無） */
  hasUniversityLecturer?: boolean;
  /** 担当している科目 */
  lectureSubjects?: string;
  /** 他機関での活動実績（外部講演・講師） */
  externalActivities?: string;
  /** 職員個人の資格やスキルで活かされているもの */
  qualificationsAndSkills?: string;
  /** 実習生受け入れについて特筆的なこと */
  internshipDetails?: string;
}

/** 教育・進路支援情報 */
export interface EducationInfo {
  /** 進学率（高校、専門、大学）と支援体制 */
  graduationRate?: string;
  /** 学習支援の工夫や外部連携 */
  learningSupport?: string;
  /** 特化した進路支援内容 */
  careerSupport?: string;
  /**
   * 教育方針
   * @deprecated 2026-Q2までに削除予定 - graduationRate に統合
   */
  policy?: string;
  /**
   * アフターケア
   * @deprecated 2026-Q2までに削除予定 - careerSupport に統合
   */
  afterCare?: string;
}

/** 高機能化・多機能化への取り組み */
export interface AdvancedInfo {
  /** タイトル */
  title?: string;
  /** 実施している多機能化の取り組み */
  description: string;
  /** 経緯と背景 */
  background?: string;
  /** 取り組みにあたっての苦労や課題 */
  challenges?: string;
  /** 工夫や成功要因・乗り越えた方法 */
  solutions?: string;
}

/** その他情報 */
export interface OtherInfoObject {
  title?: string;
  description?: string;
  /** 他施設とのネットワークや共同プロジェクト */
  networks?: string;
  /** 今後の展望や課題 */
  futureOutlook?: string;
  /** 自由記述欄 */
  freeText?: string;
}

/** その他情報（文字列またはオブジェクト形式に対応） */
export type OtherInfo = string | OtherInfoObject;

/** 併設施設情報 */
export interface AnnexFacility {
  name: string;
  type: string;
}

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
  /** 舎の区分（大舎・中舎・小舎・グループホーム・地域小規模） */
  dormitoryType?: '大舎' | '中舎' | '小舎' | 'グループホーム' | '地域小規模';
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

  /** 施設の定員 */
  capacity?: number;
  /** 暫定定員 */
  provisionalCapacity?: number;
  /** 併設施設 */
  annexFacilities?: AnnexFacility[];

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
  /** 高機能化・多機能化情報 */
  advancedInfo?: AdvancedInfo;
  /** その他情報 */
  otherInfo?: OtherInfo;
}

/** ID→施設詳細のマップ型 */
export type FacilityDataMap = Record<string, FacilityDetail>;
