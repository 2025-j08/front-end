import dynamic from 'next/dynamic';

import { AccessInfo } from '@/types/facility';

import { CommunityRelation } from './CommunityRelation';
import { EditField } from './EditField';
import styles from './TabContent.module.scss';

// FacilityMapを動的インポート（SSR無効化）
const FacilityMap = dynamic(
  () => import('../../FacilityMap/FacilityMap').then((mod) => mod.FacilityMap),
  {
    ssr: false,
    loading: () => <div className={styles.mapPlaceholder}>地図を読み込み中...</div>,
  },
);

export type AccessTabProps = {
  accessInfo: AccessInfo;
  facilityName: string;
  relationInfo?: string;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const AccessTab = ({
  accessInfo,
  facilityName,
  relationInfo,
  isEditMode = false,
  onFieldChange,
}: AccessTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={`${styles.tabContentWrapper} ${styles.accessContent}`}>
          <div className={styles.accessInfo}>
            <EditField
              type="text"
              id="locationAddress"
              label="住所"
              value={accessInfo.locationAddress}
              onChange={(v) => onFieldChange?.('locationAddress', v)}
            />
            <EditField
              type="text"
              id="station"
              label="最寄り駅"
              value={accessInfo.station}
              onChange={(v) => onFieldChange?.('station', v)}
            />
            <EditField
              type="textarea"
              id="description"
              label="アクセス詳細"
              value={accessInfo.description}
              onChange={(v) => onFieldChange?.('description', v)}
              rows={3}
            />
            <div className={styles.editRow}>
              <EditField
                type="number"
                id="lat"
                label="緯度"
                value={accessInfo.lat}
                onChange={(v) => onFieldChange?.('lat', v)}
                step="0.000001"
              />
              <EditField
                type="number"
                id="lng"
                label="経度"
                value={accessInfo.lng}
                onChange={(v) => onFieldChange?.('lng', v)}
                step="0.000001"
              />
            </div>
          </div>
          <div className={styles.mapWrapper}>
            <FacilityMap
              lat={accessInfo.lat}
              lng={accessInfo.lng}
              name={facilityName}
              address={accessInfo.locationAddress}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`${styles.tabContentWrapper} ${styles.accessContent}`}>
        <div className={styles.accessInfo}>
          <p className={styles.accessText}>{accessInfo.locationAddress}</p>
          {accessInfo.station && <p className={styles.accessText}>{accessInfo.station}</p>}
          {accessInfo.description && (
            <p className={styles.accessDescription}>{accessInfo.description}</p>
          )}
        </div>
        <div className={styles.mapWrapper}>
          <FacilityMap
            lat={accessInfo.lat}
            lng={accessInfo.lng}
            name={facilityName}
            address={accessInfo.locationAddress}
          />
        </div>
      </div>

      {relationInfo && <CommunityRelation relationInfo={relationInfo} />}
    </>
  );
};
