export type Facility = {
  id: number;
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  imagePath: string | null;
};

export type FacilitiesData = {
  totalCount: number;
  limit: number;
  pages: {
    [key: string]: Facility[];
  };
};

// 施設詳細ページ用の型定義
export type AccessInfo = {
  locationAddress: string;
  station: string;
  description: string;
  lat?: number;
  lng?: number;
};

export type PhilosophyInfo = {
  title: string;
  description: string;
};

export type SpecialtyInfo = {
  features: string[];
};

export type StaffInfo = {
  message: string;
  staffDetails: {
    role: string;
    description: string;
  }[];
};

export type EducationInfo = {
  policy: string;
  afterCare: string;
};

export type AdvancedInfo = {
  description: string;
};

export type FacilityDetail = {
  name: string;
  corporation: string;
  fullAddress: string;
  phone: string;
  websiteUrl: string | null;
  facilityType: string;
  establishedYear: string;
  capacity: string;
  hasAnnex: boolean;
  annexDetail?: string;
  accessInfo: AccessInfo;
  relationInfo: string;
  // 新規追加
  philosophyInfo?: PhilosophyInfo;
  specialtyInfo?: SpecialtyInfo;
  staffInfo?: StaffInfo;
  educationInfo?: EducationInfo;
  advancedInfo?: AdvancedInfo;
  otherInfo?: string;
};
