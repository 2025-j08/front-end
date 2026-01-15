'use client';

/**
 * FacilityDetail コンポーネント
 * 施設詳細ページのメインコンポーネント（閲覧専用）です。
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

  if (isLoading)
    return (
      <div className={styles.container} role="status" aria-live="polite" aria-busy="true">
        読み込み中...
      </div>
    );
  if (error)
    return (
      <div className={styles.container} role="alert">
        {error}
      </div>
    );
  if (!facilityData)
    return (
      <div className={styles.container} role="alert">
        施設データが見つかりません
      </div>
    );

  return (
    <div className={styles.container}>
      <FacilityHeader
        name={facilityData.name}
        corporation={facilityData.corporation}
        fullAddress={facilityData.fullAddress}
        phone={facilityData.phone}
        websiteUrl={facilityData.websiteUrl}
        isEditMode={false}
      />

      <BasicInfoSection
        dormitoryType={facilityData.dormitoryType}
        establishedYear={facilityData.establishedYear}
        capacity={facilityData.capacity}
        provisionalCapacity={facilityData.provisionalCapacity}
        annexFacilities={facilityData.annexFacilities}
        isEditMode={false}
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
        images={facilityData.images}
        isEditMode={false}
      />
    </div>
  );
};
