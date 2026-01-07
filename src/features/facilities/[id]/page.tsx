'use client';

/**
 * FacilityDetail コンポーネント
 * 施設詳細ページのメインコンポーネントです。
 * ロジックは useFacilityDetail フックに分離
 */
import { useFacilityData } from './hooks/useFacilityData';
import { useFacilityDetail } from './hooks/useFacilityDetail';
import { FacilityHeader } from './components/FacilityHeader/FacilityHeader';
import { BasicInfoSection } from './components/BasicInfoSection/BasicInfoSection';
import { DetailTabs } from './components/DetailTabs/DetailTabs';
import styles from './page.module.scss';

type Props = {
  id: string;
};

export const FacilityDetail = ({ id }: Props) => {
  const { data: facilityData, isLoading, error } = useFacilityData(id);
  const { activeTab, setActiveTab, tabs } = useFacilityDetail();

  if (isLoading) return <div className={styles.container}>読み込み中...</div>;
  if (error || !facilityData)
    return <div className={styles.container}>データの取得に失敗しました</div>;

  return (
    <div className={styles.container}>
      <FacilityHeader
        name={facilityData.name}
        corporation={facilityData.corporation}
        fullAddress={facilityData.fullAddress}
        phone={facilityData.phone}
        websiteUrl={facilityData.websiteUrl}
      />

      <BasicInfoSection
        establishedYear={facilityData.establishedYear}
        dormitoryType={facilityData.dormitoryType}
      />

      <DetailTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accessInfo={facilityData.accessInfo}
        relationInfo={facilityData.relationInfo}
        facilityName={facilityData.name}
        philosophyInfo={facilityData.philosophyInfo}
        specialtyInfo={facilityData.specialtyInfo}
        staffInfo={facilityData.staffInfo}
        educationInfo={facilityData.educationInfo}
        advancedInfo={facilityData.advancedInfo}
        otherInfo={facilityData.otherInfo}
      />
    </div>
  );
};
