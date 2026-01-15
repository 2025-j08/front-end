import { useRef, useState, useCallback, useMemo } from 'react';

import { useTabKeyboardNav } from '@/hooks/useTabKeyboardNav';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog';
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
import { ImagesTab, ImagesTabHandle } from './contents/ImagesTab';
import { OtherTab } from './contents/OtherTab';
import { TabSaveButton } from './contents/TabSaveButton';
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
  /** 画像一括保存ハンドラー（RPC使用） */
  onBatchImageSave?: (
    uploads: { file: File; type: FacilityImageType; displayOrder: number }[],
    deleteIds: number[],
  ) => Promise<void>;
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
  /** セクションの編集内容をリセットする関数 */
  onResetSection?: (section: TabSection) => void;
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
  onBatchImageSave,
  isEditMode = false,
  onFieldChange,
  onNestedFieldChange,
  getError = () => undefined,
  saveHandlers,
  isSaving = false,
  isDirty,
  onResetSection,
}: DetailTabsProps) => {
  // タブIDの配列を生成
  const tabIds = tabs.map((tab) => tab.key);

  // 画像タブのRefと制御用ステート
  const imageTabRef = useRef<ImagesTabHandle>(null);
  const [imageTabState, setImageTabState] = useState({ isDirty: false, isSaving: false });

  // 確認ダイアログ制御
  const { dialogConfig, showDialog, closeDialog } = useConfirmDialog();

  // 現在が画像タブかどうか
  const isImagesTab = activeTab === 'images';

  // 現在のタブの保存ボタンの状態を計算
  const saveButtonState = useMemo(() => {
    if (isImagesTab) {
      return {
        onSave: async () => {
          await imageTabRef.current?.save();
        },
        isDirty: imageTabState.isDirty,
        isSaving: imageTabState.isSaving,
      };
    }

    // saveHandlers のキーは TabSection型 ('access', 'philosophy' etc.)だが
    // activeTab は TabKey型 ('images'含む)
    // images以外は共通処理
    const section = activeTab as TabSection;
    const handler = saveHandlers?.[section];

    return {
      onSave: handler || (async () => {}),
      isDirty: isDirty ? isDirty(section) : false,
      isSaving: isSaving,
    };
  }, [isImagesTab, activeTab, imageTabState, saveHandlers, isDirty, isSaving]);

  // タブ切り替え時の確認ロジック
  const handleTabChange = useCallback(
    (nextTab: TabKey) => {
      // 編集モードでなければ直接切り替え
      if (!isEditMode) {
        onTabChange(nextTab);
        return;
      }
      // 未保存の変更がある場合は確認ダイアログを表示
      if (saveButtonState.isDirty) {
        showDialog({
          title: '編集内容の破棄',
          message:
            '編集中のデータは保存されていません。移動すると入力内容は破棄されますがよろしいですか？',
          confirmLabel: '破棄して移動',
          cancelLabel: '編集を続ける',
          isDanger: true,
          onConfirm: () => {
            // セクションの編集内容を破棄（リセット）
            if (isImagesTab) {
              imageTabRef.current?.reset();
            } else {
              onResetSection?.(activeTab as TabSection);
            }
            onTabChange(nextTab);
            closeDialog();
          },
        });
      } else {
        onTabChange(nextTab);
      }
    },
    [
      isEditMode,
      saveButtonState.isDirty,
      isImagesTab,
      activeTab,
      onTabChange,
      onResetSection,
      showDialog,
      closeDialog,
    ],
  );

  // キーボードナビゲーション（インターセプト版）
  const { handleKeyDown } = useTabKeyboardNav(tabIds, handleTabChange);

  return (
    <section className={styles.detailSection}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerTitleArea}>
          <h2 className={styles.sectionTitle}>施設の詳細情報</h2>
          <p className={styles.tabInstruction}>各項目をクリックして切り替える</p>
        </div>

        {isEditMode && (
          <div className={styles.headerActionArea}>
            <TabSaveButton
              onSave={saveButtonState.onSave}
              isDirty={saveButtonState.isDirty}
              isSaving={saveButtonState.isSaving}
            />
          </div>
        )}
      </div>

      {/* モバイル用セレクトボックス */}
      <div className={styles.tabSelectContainer}>
        <select
          value={activeTab}
          onChange={(e) => handleTabChange(e.target.value as TabKey)}
          className={styles.tabSelect}
          aria-label="表示する項目を選択"
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
        {/* カスタム矢印用アイコン（CSSで実装するため要素は不要） */}
      </div>

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
            onClick={() => handleTabChange(tab.key)}
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
                />
              ) : null;
            case 'staff':
              return isEditMode || staffInfo ? (
                <StaffTab
                  data={staffInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('staffInfo', field, value)}
                  getError={getError}
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
                />
              ) : null;
            case 'images':
              return (
                <ImagesTab
                  ref={imageTabRef}
                  images={images}
                  isEditMode={isEditMode}
                  onBatchSave={onBatchImageSave}
                  onStateChange={setImageTabState}
                />
              );
            case 'other':
              return isEditMode || otherInfo ? (
                <OtherTab
                  data={otherInfo || {}}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => onNestedFieldChange?.('otherInfo', field, value)}
                  getError={getError}
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

      {/* 未保存変更確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        cancelLabel={dialogConfig.cancelLabel}
        isDanger={dialogConfig.isDanger}
        showCancel={dialogConfig.showCancel}
        onConfirm={dialogConfig.onConfirm ?? closeDialog}
        onCancel={dialogConfig.onCancel ?? closeDialog}
      />
    </section>
  );
};
