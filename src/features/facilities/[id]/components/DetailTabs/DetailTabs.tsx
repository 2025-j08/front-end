import { useTabKeyboardNav } from '@/hooks/useTabKeyboardNav';
import {
  AccessInfo,
  PhilosophyInfo,
  SpecialtyInfo,
  StaffInfo,
  EducationInfo,
  AdvancedInfo,
  OtherInfo,
} from '@/types/facility';

import type { TabSection } from '../../edit/hooks/useFacilityTabEdit';
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
  otherInfo?: OtherInfo;
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** ネストしたフィールドの更新ハンドラー */
  onNestedFieldChange?: <K extends keyof import('@/types/facility').FacilityDetail>(
    parent: K,
    field: string,
    value: unknown,
  ) => void;
  /** エラー情報 */
  errors?: Record<string, string>;
  /** エラー取得関数 */
  getError?: (field: string) => string | undefined;
  /** タブセクション別の保存ハンドラー */
  saveHandlers: Record<TabSection, () => Promise<void>>;
  /** 保存中フラグ */
  isSaving?: boolean;
  /** セクション別の変更状態を取得する関数 */
  isDirty: (section: TabSection) => boolean;
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
  isEditMode = false,
  onNestedFieldChange,
  getError = () => undefined,
  saveHandlers,
  isSaving = false,
  isDirty,
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
        {(() => {
          switch (activeTab) {
            case 'access':
              return accessInfo ? (
                <AccessTab
                  data={accessInfo}
                  facilityName={facilityName || ''}
                  relationInfo={relationInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('accessInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers.access}
                  isSaving={isSaving}
                  isDirty={isDirty('access')}
                />
              ) : null;
            case 'philosophy':
              return philosophyInfo ? (
                <PhilosophyTab
                  data={philosophyInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('philosophyInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers.philosophy}
                  isSaving={isSaving}
                  isDirty={isDirty('philosophy')}
                />
              ) : null;
            case 'specialty':
              return specialtyInfo ? (
                <SpecialtyTab
                  data={specialtyInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('specialtyInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers.specialty}
                  isSaving={isSaving}
                  isDirty={isDirty('specialty')}
                />
              ) : null;
            case 'staff':
              return staffInfo ? (
                <StaffTab
                  data={staffInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('staffInfo', field, value)}
                  getError={getError}
                  onSave={saveHandlers.staff}
                  isSaving={isSaving}
                  isDirty={isDirty('staff')}
                />
              ) : null;
            case 'education':
              return educationInfo ? (
                <EducationTab
                  data={educationInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('educationInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers.education}
                  isSaving={isSaving}
                  isDirty={isDirty('education')}
                />
              ) : null;
            case 'advanced':
              return advancedInfo ? (
                <AdvancedTab
                  data={advancedInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('advancedInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers.advanced}
                  isSaving={isSaving}
                  isDirty={isDirty('advanced')}
                />
              ) : null;
            case 'other':
              return otherInfo ? (
                <OtherTab
                  data={otherInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('otherInfo', field, value)}
                  getError={getError}
                  onSave={saveHandlers.other}
                  isSaving={isSaving}
                  isDirty={isDirty('other')}
                />
              ) : null;
            default:
              return null;
          }
        })() || (
          <div className={styles.placeholderContent}>
            {TAB_LABELS[activeTab]}の情報がここに表示されます。
          </div>
        )}
      </div>

      {/* 地域連携セクション削除 (AccessTab内に移動) */}
    </section>
  );
};
