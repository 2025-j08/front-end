import dynamic from 'next/dynamic';

import { AccessInfo } from '@/types/facility';

import { CommunityRelation } from './CommunityRelation';
import styles from './TabContent.module.scss';

// FacilityMapを動的インポート（SSR無効化）
const FacilityMap = dynamic(
  () => import('../../FacilityMap/FacilityMap').then((mod) => mod.FacilityMap),
  {
    ssr: false,
    loading: () => <div className={styles.mapPlaceholder}>地図を読み込み中...</div>,
  },
);

type AccessTabProps = {
  accessInfo: AccessInfo;
  facilityName: string;
  relationInfo?: string;
};

export const AccessTab = ({ accessInfo, facilityName, relationInfo }: AccessTabProps) => {
  return (
    <>
      <div className={`${styles.tabContentWrapper} ${styles.accessContent}`}>
        {accessInfo ? (
          <>
            <div className={styles.accessInfo}>
              <p className={styles.accessText}>{accessInfo.locationAddress}</p>
              {accessInfo.station && <p className={styles.accessText}>{accessInfo.station}</p>}
              {accessInfo.description && (
                <p className={styles.accessDescription}>{accessInfo.description}</p>
              )}
            </div>
            {accessInfo.lat && accessInfo.lng ? (
              <div className={styles.mapWrapper}>
                <FacilityMap
                  lat={accessInfo.lat}
                  lng={accessInfo.lng}
                  name={facilityName}
                  address={accessInfo.locationAddress}
                />
              </div>
            ) : (
              <div className={styles.mapPlaceholder} aria-hidden="true">
                <div className={styles.pin}></div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.placeholderContent}>アクセス情報がありません</div>
        )}
      </div>

      {relationInfo && <CommunityRelation relationInfo={relationInfo} />}
    </>
  );
};
