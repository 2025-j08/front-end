import dynamic from 'next/dynamic';

import { AccessInfo } from '@/types/facility';

import { EditField } from './EditField';
import styles from './TabContent.module.scss';
import { TabProps } from '../types/tabProps';

// FacilityMapを動的インポート（SSR無効化）
const FacilityMap = dynamic(
  () => import('../../FacilityMap/FacilityMap').then((mod) => mod.FacilityMap),
  {
    ssr: false,
    loading: () => <div className={styles.mapPlaceholder}>地図を読み込み中...</div>,
  },
);

export type AccessTabProps = TabProps<AccessInfo> & {
  facilityName: string;
  relationInfo?: string;
  onRelationInfoChange?: (value: string) => void;
};

export const AccessTab = ({
  data: accessInfo,
  facilityName,
  relationInfo,
  onRelationInfoChange,
  isEditMode = false,
  onFieldChange,
  getError = () => undefined,
  onSave,
  isSaving = false,
  isDirty = false,
}: AccessTabProps) => {
  if (isEditMode) {
    return (
      <>
        <div className={styles.accessTabContainer}>
          <div className={`${styles.tabContentWrapper} ${styles.accessContent}`}>
            <div className={styles.accessInfo}>
              <div className={styles.infoSection}>
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
              </div>

              {/* アクセスセクション: 表示画面と同じ構造 */}
              <div className={styles.infoSection}>
                <EditField
                  type="text"
                  id="station"
                  label="アクセス - 最寄り駅"
                  value={accessInfo.station}
                  onChange={(v) => onFieldChange?.('station', v)}
                  error={getError('accessInfo.station')}
                  placeholder="最寄り駅名を入力"
                />
                <EditField
                  type="textarea"
                  id="description"
                  label="駅からのアクセス方法"
                  value={accessInfo.description}
                  onChange={(v) => onFieldChange?.('description', v)}
                  rows={2}
                  error={getError('accessInfo.description')}
                  placeholder="駅からの行き方を入力"
                />
              </div>

              {/* 立地のアピールポイント */}
              <div className={styles.infoSection}>
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
              </div>

              {/* 緯度経度 */}
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

          {/* 地域社会との関係 - 編集画面では編集可能 */}
          <div className={styles.relationSection}>
            <EditField
              type="textarea"
              id="relationInfo"
              label="地域社会との関係や連携状況"
              value={relationInfo}
              onChange={(v) => onRelationInfoChange?.(v)}
              rows={4}
              error={getError('relationInfo')}
              placeholder="地域社会との関係や連携状況を入力してください"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.accessTabContainer}>
      <div className={`${styles.tabContentWrapper} ${styles.accessContent}`}>
        <div className={styles.accessInfo}>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>住所</h3>
            <p className={styles.accessText}>{accessInfo.locationAddress}</p>
          </div>

          {accessInfo.station && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>アクセス</h3>
              <p className={styles.accessText}>{accessInfo.station}</p>
              {accessInfo.description && (
                <p className={styles.accessDescription}>{accessInfo.description}</p>
              )}
            </div>
          )}

          {accessInfo.locationAppeal && (
            <div className={styles.infoSection}>
              <p className={styles.accessText}>{accessInfo.locationAppeal}</p>
            </div>
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

      {relationInfo && (
        <div className={styles.relationSection}>
          <h3 className={styles.relationTitle}>地域社会との関係や連携状況</h3>
          <p className={styles.relationText}>{relationInfo}</p>
        </div>
      )}
    </div>
  );
};
