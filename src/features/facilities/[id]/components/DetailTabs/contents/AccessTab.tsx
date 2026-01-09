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
            <div className={styles.editGroup}>
              <label htmlFor="locationAddress" className={styles.editLabel}>
                住所
              </label>
              <input
                type="text"
                id="locationAddress"
                className={styles.editInput}
                value={accessInfo.locationAddress || ''}
                onChange={(e) => onFieldChange?.('locationAddress', e.target.value)}
              />
            </div>
            <div className={styles.editGroup}>
              <label htmlFor="station" className={styles.editLabel}>
                最寄り駅
              </label>
              <input
                type="text"
                id="station"
                className={styles.editInput}
                value={accessInfo.station || ''}
                onChange={(e) => onFieldChange?.('station', e.target.value)}
              />
            </div>
            <div className={styles.editGroup}>
              <label htmlFor="description" className={styles.editLabel}>
                アクセス詳細
              </label>
              <textarea
                id="description"
                className={styles.editTextarea}
                value={accessInfo.description || ''}
                onChange={(e) => onFieldChange?.('description', e.target.value)}
                rows={3}
              />
            </div>
            <div className={styles.editRow}>
              <div className={styles.editGroup}>
                <label htmlFor="lat" className={styles.editLabel}>
                  緯度
                </label>
                <input
                  type="number"
                  id="lat"
                  className={styles.editInput}
                  step="0.000001"
                  value={accessInfo.lat || ''}
                  onChange={(e) => onFieldChange?.('lat', Number(e.target.value))}
                />
              </div>
              <div className={styles.editGroup}>
                <label htmlFor="lng" className={styles.editLabel}>
                  経度
                </label>
                <input
                  type="number"
                  id="lng"
                  className={styles.editInput}
                  step="0.000001"
                  value={accessInfo.lng || ''}
                  onChange={(e) => onFieldChange?.('lng', Number(e.target.value))}
                />
              </div>
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
