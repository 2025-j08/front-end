'use client';

/**
 * FacilityDetail コンポーネント
 * 施設詳細ページのメインコンポーネントです。
 * タブごとに独立して編集・保存が可能
 */
import { useCallback, useState } from 'react';

import type { FacilityDetail as FacilityDetailType } from '@/types/facility';

import { useFacilityData } from './hooks/useFacilityData';
import { useFacilityDetail } from './hooks/useFacilityDetail';
import { useFacilityTabEdit, type TabSection } from './edit/hooks/useFacilityTabEdit';
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

  // データ再取得後のコールバック（保存成功時に最新データを反映）
  const [latestData, setLatestData] = useState<FacilityDetailType | null>(null);
  const displayData = latestData || facilityData;

  const handleSaveSuccess = useCallback((updatedData: FacilityDetailType) => {
    setLatestData(updatedData);
  }, []);

  // タブ別編集フック
  const { formData, isSaving, isDirty, updateField, updateNestedField, saveTab, errors, getError } =
    useFacilityTabEdit(displayData, id, handleSaveSuccess);

  // フィールド更新ハンドラー（BasicInfoSection用）
  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      updateField(field as keyof typeof formData, value as never);
    },
    [updateField, formData],
  );

  // ネストしたフィールド更新ハンドラー（タブ用）
  const handleNestedFieldChange = useCallback(
    (field: string, value: unknown) => {
      // フィールド名を解析して親と子に分割
      const parts = field.split('.');
      if (parts.length === 2) {
        updateNestedField(parts[0] as keyof FacilityDetailType, parts[1], value);
      }
    },
    [updateNestedField],
  );

  // セクション別の保存ハンドラーを生成
  const createSaveHandler = useCallback(
    (section: TabSection) => async () => {
      await saveTab(section);
    },
    [saveTab],
  );

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
  if (!displayData)
    return (
      <div className={styles.container} role="alert">
        施設データが見つかりません
      </div>
    );

  // 編集中のデータとマージ
  const mergedData = { ...displayData, ...formData };

  return (
    <div className={styles.container}>
      <FacilityHeader
        name={mergedData.name}
        corporation={mergedData.corporation}
        fullAddress={mergedData.fullAddress}
        phone={mergedData.phone}
        websiteUrl={mergedData.websiteUrl}
        isEditMode={false}
        isSaving={false}
        isDirty={false}
      />

      <BasicInfoSection
        dormitoryType={mergedData.dormitoryType}
        establishedYear={mergedData.establishedYear}
        capacity={mergedData.capacity}
        provisionalCapacity={mergedData.provisionalCapacity}
        annexFacilities={mergedData.annexFacilities}
        isEditMode={true}
        onFieldChange={handleFieldChange}
        getError={getError}
        onSave={createSaveHandler('basic')}
        isSaving={isSaving}
        isDirty={isDirty}
      />

      <DetailTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accessInfo={mergedData.accessInfo}
        relationInfo={mergedData.relationInfo}
        facilityName={mergedData.name}
        philosophyInfo={mergedData.philosophyInfo}
        specialtyInfo={mergedData.specialtyInfo}
        staffInfo={mergedData.staffInfo}
        educationInfo={mergedData.educationInfo}
        advancedInfo={mergedData.advancedInfo}
        otherInfo={mergedData.otherInfo}
        isEditMode={true}
        onNestedFieldChange={handleNestedFieldChange}
        errors={errors}
        getError={getError}
        onSaveAccess={createSaveHandler('access')}
        onSavePhilosophy={createSaveHandler('philosophy')}
        onSaveSpecialty={createSaveHandler('specialty')}
        onSaveStaff={createSaveHandler('staff')}
        onSaveEducation={createSaveHandler('education')}
        onSaveAdvanced={createSaveHandler('advanced')}
        onSaveOther={createSaveHandler('other')}
        isSaving={isSaving}
        isDirty={isDirty}
      />
    </div>
  );
};
