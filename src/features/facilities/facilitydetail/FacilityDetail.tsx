'use client';

/**
 * FacilityDetail コンポーネント
 * 施設詳細ページのメインコンポーネントです。
 * ロジックは useFacilityDetail フックに分離
 */
import { FacilityDetail as FacilityDetailType } from '@/types/facility';
import facilityDataJson from '@/dummy_data/facilities_detail.json';

import { useFacilityDetail } from './hooks/useFacilityDetail';
import { FacilityHeader } from './components/FacilityHeader/FacilityHeader';
import { BasicInfoSection } from './components/BasicInfoSection/BasicInfoSection';
import { DetailTabs } from './components/DetailTabs/DetailTabs';
import styles from './FacilityDetail.module.scss';

// JSONデータに型を適用
const facilityData = facilityDataJson as FacilityDetailType;

export const FacilityDetail = () => {
  const { activeTab, setActiveTab, tabs } = useFacilityDetail();

  return (
    <div className={styles.container}>
      <FacilityHeader
        name={facilityData.name}
        corporation={facilityData.corporation}
        address={facilityData.address}
        tel={facilityData.tel}
        websiteUrl={facilityData.websiteUrl}
      />

      <BasicInfoSection
        facilityType={facilityData.facilityType}
        establishedYear={facilityData.establishedYear}
        capacity={facilityData.capacity}
        hasAnnex={facilityData.hasAnnex}
        annexDetail={facilityData.annexDetail}
      />

      <DetailTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accessInfo={facilityData.accessInfo}
        relationInfo={facilityData.relationInfo}
      />
    </div>
  );
};
