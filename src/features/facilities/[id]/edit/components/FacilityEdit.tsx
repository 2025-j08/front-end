'use client';

/**
 * FacilityEdit コンポーネント
 * 施設編集ページのメインコンポーネント（編集専用）です。
 * タブごとに独立して編集・保存が可能
 */
import { useCallback, useState, useMemo } from 'react';

import type { FacilityDetail as FacilityDetailType, FacilityImageType } from '@/types/facility';

import { useFacilityData } from '../../hooks/useFacilityData';
import { useFacilityDetail } from '../../hooks/useFacilityDetail';
import { useFacilityTabEdit, TAB_SECTIONS, type TabSection } from '../hooks/useFacilityTabEdit';
import { useFacilityImageUpload } from '../hooks/useFacilityImageUpload';
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning';
import { FacilityHeader } from '../../components/FacilityHeader/FacilityHeader';
import { BasicInfoSection } from '../../components/BasicInfoSection/BasicInfoSection';
import { DetailTabs } from '../../components/DetailTabs/DetailTabs';
import styles from './FacilityEdit.module.scss';


type Props = {
  id: string;
};

export const FacilityEdit = ({ id }: Props) => {
  const { data: facilityData, isLoading, error } = useFacilityData(id);
  const { activeTab, setActiveTab, tabs } = useFacilityDetail();

  // データ再取得後のコールバック（保存成功時に最新データを反映）
  const [latestData, setLatestData] = useState<FacilityDetailType | null>(null);
  const displayData = latestData || facilityData;

  const handleSaveSuccess = useCallback((updatedData: FacilityDetailType) => {
    setLatestData(updatedData);
  }, []);

  // タブ別編集フック
  const {
    formData,
    isSaving,
    isDirty,
    hasUnsavedChanges,
    updateField,
    updateNestedField,
    saveTab,
    errors,
    getError,
  } = useFacilityTabEdit(displayData, id, handleSaveSuccess);

  // 画像アップロードフック
  const { uploadImage, deleteImage, fetchImages } = useFacilityImageUpload(id);

  // 画像アップロードハンドラー
  const handleImageUpload = useCallback(
    async (imageType: FacilityImageType, file: File, displayOrder: number) => {
      await uploadImage(file, imageType, displayOrder);
      // 画像リストを再取得して表示を更新
      const newImages = await fetchImages();
      setLatestData((prev) => {
        const baseData = prev || facilityData;
        if (!baseData) return null;
        return {
          ...baseData,
          images: newImages,
        };
      });
    },
    [uploadImage, fetchImages, facilityData],
  );

  // 画像削除ハンドラー
  const handleImageDelete = useCallback(
    async (imageId: number) => {
      await deleteImage(imageId);
      // 画像リストを再取得して表示を更新
      const newImages = await fetchImages();
      setLatestData((prev) => {
        const baseData = prev || facilityData;
        if (!baseData) return null;
        return {
          ...baseData,
          images: newImages,
        };
      });
    },
    [deleteImage, fetchImages, facilityData],
  );

  // 未保存の変更がある場合の離脱警告
  useUnsavedChangesWarning(hasUnsavedChanges);

  // フィールド更新ハンドラー（BasicInfoSection用）
  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      updateField(field as keyof FacilityDetailType, value as never);
    },
    [updateField],
  );

  // セクション別の保存ハンドラーをRecord型で動的生成（useMemoでメモ化）
  const saveHandlers = useMemo(() => {
    const handlers = {} as Record<TabSection, () => Promise<void>>;
    for (const section of TAB_SECTIONS) {
      handlers[section] = async () => {
        await saveTab(section);
      };
    }
    return handlers;
  }, [saveTab]);


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
  // 注意: images は formData ではなく displayData から取得（画像は別途管理されるため）
  const mergedData = { ...displayData, ...formData, images: displayData.images };

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
        phone={mergedData.phone}
        corporation={mergedData.corporation}
        isEditMode={true}
        onFieldChange={handleFieldChange}
        getError={getError}
        onSave={saveHandlers.basic}
        isSaving={isSaving}
        isDirty={isDirty('basic')}
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
        images={mergedData.images}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
        isEditMode={true}
        onFieldChange={updateField}
        onNestedFieldChange={updateNestedField}
        errors={errors}
        getError={getError}
        saveHandlers={saveHandlers}
        isSaving={isSaving}
        isDirty={isDirty}
      />
    </div>
  );
};
