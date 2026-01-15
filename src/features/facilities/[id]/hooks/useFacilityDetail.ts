import { useState } from 'react';

export const TAB_KEYS = [
  'access',
  'philosophy',
  'specialty',
  'staff',
  'education',
  'advanced',
  'images',
  'other',
] as const;

export type TabKey = (typeof TAB_KEYS)[number];

export type Tab = {
  key: TabKey;
  label: string;
};

// O(1) でラベル取得するためのRecord構造
export const TAB_LABELS: Record<TabKey, string> = {
  access: '立地・アクセス',
  philosophy: '理念',
  specialty: '特化領域',
  staff: '職員',
  education: '教育・進路支援',
  advanced: '多機能化',
  images: '画像',
  other: 'その他',
};

// 後方互換性のためのTABS配列（既存コード用）
export const TABS: Tab[] = TAB_KEYS.map((key) => ({
  key,
  label: TAB_LABELS[key],
}));

/**
 * useFacilityDetail
 * 施設詳細ページのタブ状態管理を提供するカスタムフック
 *
 * @returns {Object} タブの状態とハンドラー
 * @returns {TabKey} activeTab - 現在アクティブなタブのキー
 * @returns {(tab: TabKey) => void} setActiveTab - アクティブタブを変更するハンドラー
 * @returns {Tab[]} tabs - 利用可能なタブの一覧
 */
export const useFacilityDetail = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('access');

  return {
    activeTab,
    setActiveTab,
    tabs: TABS,
  };
};
