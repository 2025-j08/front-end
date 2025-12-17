import { TabKey, Tab } from '../../hooks/useFacilityDetail';
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
 */
export const DetailTabs = ({
  tabs,
  activeTab,
  onTabChange,
  accessInfo,
  relationInfo,
}: DetailTabsProps) => {
  return (
    <section className={styles.detailSection}>
      <h2 className={styles.sectionTitle}>施設の詳細情報</h2>
      <p className={styles.tabInstruction}>各項目をクリックして切り替える</p>

      {/* タブナビゲーション */}
      <nav className={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* タブコンテンツエリア */}
      <div className={styles.tabContent}>
        {activeTab === 'access' && accessInfo && (
          <div className={styles.accessContent}>
            <div className={styles.accessInfo}>
              <p className={styles.accessText}>{accessInfo.address}</p>
              <p className={styles.accessText}>{accessInfo.station}</p>
              <p className={styles.accessDescription}>{accessInfo.description}</p>
            </div>
            <div className={styles.mapPlaceholder}>
              <div className={styles.pin}></div>
            </div>
          </div>
        )}

        {activeTab !== 'access' && (
          <div className={styles.placeholderContent}>
            {tabs.find((t) => t.key === activeTab)?.label}の情報がここに表示されます。
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
