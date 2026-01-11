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
  errors?: Record<string, string>;
  getError?: (field: string) => string | undefined;
};

export const AccessTab = ({
  accessInfo,
  facilityName,
  relationInfo,
  isEditMode = false,
  onFieldChange,
  errors = {},
  getError = () => undefined,
}: AccessTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={`${styles.tabContentWrapper} ${styles.accessContent}`}>
          <div className={styles.accessInfo}>
            <div className={styles.marginBottom24}>
              <EditField
                type="text"
                id="locationAddress"
                label="住所（変更不可）"
                value={accessInfo.locationAddress}
                disabled={true}
                placeholder="住所は管理者が管理します"
              />
              <p className={styles.noticeText}>※住所の変更は管理者にお問い合わせください。</p>
            </div>
            <EditField
              type="text"
              id="station"
              label="最寄り駅名"
              value={accessInfo.station}
              onChange={(v) => onFieldChange?.('station', v)}
              error={getError('accessInfo.station')}
            />
            <EditField
              type="textarea"
              id="description"
              label="駅からのアクセス方法"
              value={accessInfo.description}
              onChange={(v) => onFieldChange?.('description', v)}
              rows={2}
              error={getError('accessInfo.description')}
            />
            <EditField
              type="textarea"
              id="locationAppeal"
              label="立地のアピールポイント"
              value={accessInfo.locationAppeal}
              onChange={(v) => onFieldChange?.('locationAppeal', v)}
              rows={2}
              placeholder="例:住宅街に位置し、近隣には公園や学校があります"
              error={getError('accessInfo.locationAppeal')}
            />
            <div className={styles.marginBottom24}>
              <div className={styles.editRow}>
                <EditField
                  type="number"
                  id="lat"
                  label="緯度（変更不可）"
                  value={accessInfo.lat}
                  disabled={true}
                  step="0.000001"
                />
                <EditField
                  type="number"
                  id="lng"
                  label="経度（変更不可）"
                  value={accessInfo.lng}
                  disabled={true}
                  step="0.000001"
                />
              </div>
              <p className={styles.noticeText}>
                ※緯度・経度は住所に基づくため、変更は管理者にお問い合わせください。
              </p>
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
          {accessInfo.locationAppeal && (
            <p className={styles.accessDescription}>{accessInfo.locationAppeal}</p>
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
