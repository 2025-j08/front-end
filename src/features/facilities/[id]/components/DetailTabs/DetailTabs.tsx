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
  /** 各タブの保存ハンドラー */
  onSaveAccess?: () => Promise<void>;
  onSavePhilosophy?: () => Promise<void>;
  onSaveSpecialty?: () => Promise<void>;
  onSaveStaff?: () => Promise<void>;
  onSaveEducation?: () => Promise<void>;
  onSaveAdvanced?: () => Promise<void>;
  onSaveOther?: () => Promise<void>;
  /** 保存中フラグ */
  isSaving?: boolean;
  /** 変更されたか */
  isDirty?: boolean;
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
  errors = {},
  getError = () => undefined,
  onSaveAccess,
  onSavePhilosophy,
  onSaveSpecialty,
  onSaveStaff,
  onSaveEducation,
  onSaveAdvanced,
  onSaveOther,
  isSaving = false,
  isDirty = false,
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
                  onSave={onSaveAccess}
                  isSaving={isSaving}
                  isDirty={isDirty}
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
                  onSave={onSavePhilosophy}
                  isSaving={isSaving}
                  isDirty={isDirty}
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
                  onSave={onSaveSpecialty}
                  isSaving={isSaving}
                  isDirty={isDirty}
                />
              ) : null;
            case 'staff':
              return staffInfo ? (
                <StaffTab
                  data={staffInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('staffInfo', field, value)}
                  getError={getError}
                  onSave={onSaveStaff}
                  isSaving={isSaving}
                  isDirty={isDirty}
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
                  onSave={onSaveEducation}
                  isSaving={isSaving}
                  isDirty={isDirty}
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
                  onSave={onSaveAdvanced}
                  isSaving={isSaving}
                  isDirty={isDirty}
                />
              ) : null;
            case 'other':
              return otherInfo ? (
                <OtherTab
                  data={otherInfo}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('otherInfo', field, value)}
                  getError={getError}
                  onSave={onSaveOther}
                  isSaving={isSaving}
                  isDirty={isDirty}
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
