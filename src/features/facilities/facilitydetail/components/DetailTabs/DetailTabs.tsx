import { useTabKeyboardNav } from '@/hooks/useTabKeyboardNav';

import { TabKey, Tab, TAB_LABELS } from '../../hooks/useFacilityDetail';
import styles from './DetailTabs.module.scss';

type DetailTabsProps = {
  tabs: Tab[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  accessInfo?: {
    address: string;
    station: string;
    description: string;
  };
  relationInfo?: string;
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
        tabIndex={0}
        className={styles.tabContent}
      >
        {activeTab === 'access' && (
          <div className={styles.accessContent}>
            {accessInfo ? (
              <>
                <div className={styles.accessInfo}>
                  <p className={styles.accessText}>{accessInfo.address}</p>
                  <p className={styles.accessText}>{accessInfo.station}</p>
                  <p className={styles.accessDescription}>{accessInfo.description}</p>
                </div>
                <div className={styles.mapPlaceholder} role="img" aria-label="地図プレースホルダー">
                  <div className={styles.pin} aria-hidden="true"></div>
                </div>
              </>
            ) : (
              <div className={styles.placeholderContent}>アクセス情報がありません</div>
            )}
          </div>
        )}

        {activeTab !== 'access' && (
          <div className={styles.placeholderContent}>
            {TAB_LABELS[activeTab]}の情報がここに表示されます。
          </div>
        )}
      </div>

      {/* 地域連携セクション */}
      {relationInfo && (
        <div className={styles.relationSection}>
          <h3 className={styles.subTitle}>地域社会との関係や連携状況</h3>
          <p className={styles.relationText}>{relationInfo}</p>
        </div>
      )}
    </section>
  );
};
