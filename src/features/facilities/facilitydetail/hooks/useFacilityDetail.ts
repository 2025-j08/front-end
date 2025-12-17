import { useState } from 'react';

// タブの定義
export type TabKey =
  | 'access'
  | 'philosophy'
  | 'specialty'
  | 'staff'
  | 'education'
  | 'advanced'
  | 'other';

export type Tab = {
  key: TabKey;
  label: string;
};

export const TABS: Tab[] = [
  { key: 'access', label: '立地・アクセス' },
  { key: 'philosophy', label: '理念' },
  { key: 'specialty', label: '特化領域' },
  { key: 'staff', label: '職員' },
  { key: 'education', label: '教育・進路支援' },
  { key: 'advanced', label: '高機能化' },
  { key: 'other', label: 'その他' },
];

/**
 * 施設詳細ページのタブ状態管理フック
 */
export const useFacilityDetail = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('access');

  return {
    activeTab,
    setActiveTab,
    tabs: TABS,
  };
};
