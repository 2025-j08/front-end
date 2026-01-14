import { useTabKeyboardNav } from '@/hooks/useTabKeyboardNav';
import {
  AccessInfo,
  PhilosophyInfo,
  SpecialtyInfo,
  StaffInfo,
  EducationInfo,
  AdvancedInfo,
  OtherInfo,
  FacilityImage,
  FacilityImageType,
} from '@/types/facility';

import type { TabSection } from '../../edit/hooks/useFacilityTabEdit';
import { AccessTab } from './contents/AccessTab';
import { PhilosophyTab } from './contents/PhilosophyTab';
import { SpecialtyTab } from './contents/SpecialtyTab';
import { StaffTab } from './contents/StaffTab';
import { EducationTab } from './contents/EducationTab';
import { AdvancedTab } from './contents/AdvancedTab';
import { ImagesTab } from './contents/ImagesTab';
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
  /** 施設画像 */
  images?: FacilityImage[];
  /** 画像アップロードハンドラー */
  onImageUpload?: (imageType: FacilityImageType, file: File, displayOrder: number) => Promise<void>;
  /** 画像削除ハンドラー */
  onImageDelete?: (imageId: number) => Promise<void>;
  /** 編集モードかどうか */
  isEditMode?: boolean;
  /** トップレベルフィールドの更新ハンドラー */
  onFieldChange?: <K extends keyof import('@/types/facility').FacilityDetail>(
    field: K,
    value: import('@/types/facility').FacilityDetail[K],
  ) => void;
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
  saveHandlers?: Record<TabSection, () => Promise<void>>;
  /** 保存中フラグ */
  isSaving?: boolean;
  /** セクション別の変更状態を取得する関数 */
  isDirty?: (section: TabSection) => boolean;
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
  images,
  onImageUpload,
  onImageDelete,
  isEditMode = false,
  onFieldChange,
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

  // 編集モードでない場合のデフォルトハンドラー
  const noop = async () => {};
  const noopIsDirty = () => false;

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
                  onRelationInfoChange={(value) => onFieldChange?.('relationInfo', value)}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('accessInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers?.access ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('access')}
                />
              ) : null;
            case 'philosophy':
              return isEditMode || philosophyInfo ? (
                <PhilosophyTab
                  data={philosophyInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('philosophyInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers?.philosophy ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('philosophy')}
                />
              ) : null;
            case 'specialty':
              return isEditMode || specialtyInfo ? (
                <SpecialtyTab
                  data={specialtyInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('specialtyInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers?.specialty ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('specialty')}
                />
              ) : null;
            case 'staff':
              return isEditMode || staffInfo ? (
                <StaffTab
                  data={staffInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('staffInfo', field, value)}
                  getError={getError}
                  onSave={saveHandlers?.staff ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('staff')}
                />
              ) : null;
            case 'education':
              return isEditMode || educationInfo ? (
                <EducationTab
                  data={educationInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('educationInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers?.education ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('education')}
                />
              ) : null;
            case 'advanced':
              return isEditMode || advancedInfo ? (
                <AdvancedTab
                  data={advancedInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) =>
                    onNestedFieldChange?.('advancedInfo', field, value)
                  }
                  getError={getError}
                  onSave={saveHandlers?.advanced ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('advanced')}
                />
              ) : null;
            case 'images':
              return (
                <ImagesTab
                  images={images}
                  isEditMode={isEditMode}
                  onUpload={onImageUpload}
                  onDelete={onImageDelete}
                  onSave={saveHandlers?.images ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('images')}
                />
              );
            case 'other':
              return isEditMode || otherInfo ? (
                <OtherTab
                  data={otherInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('otherInfo', field, value)}
                  getError={getError}
                  onSave={saveHandlers?.other ?? noop}
                  isSaving={isSaving}
                  isDirty={(isDirty ?? noopIsDirty)('other')}
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
