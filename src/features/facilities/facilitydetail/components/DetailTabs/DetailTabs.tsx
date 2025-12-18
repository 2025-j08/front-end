import { useTabKeyboardNav } from '@/hooks/useTabKeyboardNav';
import {
  AccessInfo,
  PhilosophyInfo,
  SpecialtyInfo,
  StaffInfo,
  EducationInfo,
  AdvancedInfo,
} from '@/types/facility';

import { AccessTab } from './contents/AccessTab';
import { PhilosophyTab } from './contents/PhilosophyTab';
import { SpecialtyTab } from './contents/SpecialtyTab';
import { StaffTab } from './contents/StaffTab';
import { EducationTab } from './contents/EducationTab';
import { AdvancedTab } from './contents/AdvancedTab';
import { OtherTab } from './contents/OtherTab';
import { TabKey, Tab, TAB_LABELS } from '../../hooks/useFacilityDetail';
import styles from './DetailTabs.module.scss';

type DetailTabsProps = {
  tabs: Tab[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  accessInfo?: AccessInfo;
  relationInfo?: string;
  facilityName?: string; // マップ表示用に名前を受け取る
  philosophyInfo?: PhilosophyInfo;
  specialtyInfo?: SpecialtyInfo;
  staffInfo?: StaffInfo;
  educationInfo?: EducationInfo;
  advancedInfo?: AdvancedInfo;
  otherInfo?: string;
};

/**
 * 施設詳細ページのタブセクション
 * タブナビゲーションとタブコンテンツを表示
 * ARIA属性によるアクセシビリティ対応済み
 * 左右矢印キーでのタブ切り替えに対応
 */
export const DetailTabs = ({
  tabs,
  activeTab,
  onTabChange,
  accessInfo,
  relationInfo,
  facilityName = '',
  philosophyInfo,
  specialtyInfo,
  staffInfo,
  educationInfo,
  advancedInfo,
  otherInfo,
}: DetailTabsProps) => {
  // タブIDの配列を生成
  const tabIds = tabs.map((tab) => tab.key);

  // キーボードナビゲーションフックを使用
  const { handleKeyDown } = useTabKeyboardNav(tabIds, onTabChange);

  return (
    <section className={styles.detailSection}>
      <h2 className={styles.sectionTitle}>施設の詳細情報</h2>
      <p className={styles.tabInstruction}>各項目をクリックして切り替える</p>

      {/* タブナビゲーション - role="tablist" でアクセシビリティ対応 */}
      <div role="tablist" className={styles.tabNav} aria-label="施設詳細タブ">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            tabIndex={activeTab === tab.key ? 0 : -1}
            className={styles.tabItem}
            onClick={() => onTabChange(tab.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツエリア - role="tabpanel" でアクセシビリティ対応 */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className={styles.tabContent}
      >
        {activeTab === 'access' && accessInfo && (
          <AccessTab
            accessInfo={accessInfo}
            facilityName={facilityName || ''}
            relationInfo={relationInfo}
          />
        )}

        {(activeTab !== 'access' &&
          (() => {
            // コンテンツのマッピングを定義して可読性を向上
            switch (activeTab) {
              case 'philosophy':
                return philosophyInfo ? <PhilosophyTab philosophyInfo={philosophyInfo} /> : null;
              case 'specialty':
                return specialtyInfo ? <SpecialtyTab specialtyInfo={specialtyInfo} /> : null;
              case 'staff':
                return staffInfo ? <StaffTab staffInfo={staffInfo} /> : null;
              case 'education':
                return educationInfo ? <EducationTab educationInfo={educationInfo} /> : null;
              case 'advanced':
                return advancedInfo ? <AdvancedTab advancedInfo={advancedInfo} /> : null;
              case 'other':
                return otherInfo ? <OtherTab otherInfo={otherInfo} /> : null;
              default:
                return (
                  <div className={styles.placeholderContent}>
                    {TAB_LABELS[activeTab]}の情報がここに表示されます。
                  </div>
                );
            }
          })()) ||
          // nullが返された場合(情報がない場合)のプレースホルダー
          (activeTab !== 'access' && (
            <div className={styles.placeholderContent}>
              {TAB_LABELS[activeTab]}の情報がここに表示されます。
            </div>
          ))}
      </div>

      {/* 地域連携セクション削除 (AccessTab内に移動) */}
    </section>
  );
};
