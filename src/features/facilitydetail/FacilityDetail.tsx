'use client';

/**
 * FacilityDetail コンポーネント
 * 施設詳細ページのメインコンポーネントです。
 * ロジックは useFacilityDetail フックに分離
 */
import { useFacilityDetail } from './hooks/useFacilityDetail';
import { FacilityHeader } from './components/FacilityHeader/FacilityHeader';
import { BasicInfoSection } from './components/BasicInfoSection/BasicInfoSection';
import { DetailTabs } from './components/DetailTabs/DetailTabs';
import styles from './FacilityDetail.module.scss';

const FacilityDetail = () => {
  const { activeTab, setActiveTab, tabs } = useFacilityDetail();

  // ダミーデータ（将来的にはAPIから取得）
  const facilityData = {
    name: '児童養護施設名称',
    corporation: '○○○○○○',
    address: '〒000-0000 ○○県○○市○○町0-000-0',
    tel: '000-000-0000',
    facilityType: 'ファミリーホーム',
    establishedYear: '2000年',
    capacity: '20名',
    hasAnnex: true,
    annexDetail: '○○○○○○（保育所）',
    accessInfo: {
      address: '○○県○○市○○○町○丁目○○○-○',
      station: '○○電鉄「○○○」駅から徒歩○分',
      description: '駅からほど近い市街地に位置するアクセス良好な施設です。',
    },
    relationInfo:
      '地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況地域社会との関係や連携状況',
  };

  return (
    <div className={styles.container}>
      <FacilityHeader
        name={facilityData.name}
        corporation={facilityData.corporation}
        address={facilityData.address}
        tel={facilityData.tel}
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

export default FacilityDetail;
