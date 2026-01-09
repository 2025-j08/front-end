'use client';

/**
 * FacilityDetail コンポーネント
 * 施設詳細ページのメインコンポーネントです。
 * 表示モードと編集モードを切り替え可能
 */
import { useState, useCallback } from 'react';

import { useFacilityData } from './hooks/useFacilityData';
import { useFacilityDetail } from './hooks/useFacilityDetail';
import { useFacilityEdit } from './edit/hooks/useFacilityEdit';
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

  // 編集モード状態
  const [isEditMode, setIsEditMode] = useState(false);

  // 編集フック
  const { formData, isSaving, isDirty, updateField, updateNestedField, handleSubmit, resetForm } =
    useFacilityEdit(facilityData, id);

  // フィールド更新ハンドラー（BasicInfoSection用）
  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      updateField(field as keyof typeof formData, value as never);
    },
    [updateField],
  );

  // 編集モード切り替え
  const handleEditModeToggle = useCallback(() => {
    setIsEditMode(true);
  }, []);

  // 保存処理
  const handleSave = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      setIsEditMode(false);
    }
  }, [handleSubmit]);

  // キャンセル処理
  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('変更が保存されていません。破棄してもよろしいですか？');
      if (!confirmed) return;
    }
    resetForm();
    setIsEditMode(false);
  }, [isDirty, resetForm]);

  if (isLoading) return <div className={styles.container}>読み込み中...</div>;
  if (error) return <div className={styles.container}>{error}</div>;
  if (!facilityData) return <div className={styles.container}>施設データが見つかりません</div>;

  // 表示用データ（編集モード時はformData、表示モード時はfacilityData）
  const displayData = isEditMode ? { ...facilityData, ...formData } : facilityData;

  return (
    <div className={styles.container}>
      <FacilityHeader
        name={displayData.name}
        corporation={displayData.corporation}
        fullAddress={displayData.fullAddress}
        phone={displayData.phone}
        websiteUrl={displayData.websiteUrl}
        isEditMode={isEditMode}
        onEditModeToggle={handleEditModeToggle}
        isSaving={isSaving}
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <BasicInfoSection
        dormitoryType={displayData.dormitoryType}
        establishedYear={displayData.establishedYear}
        capacity={displayData.capacity}
        provisionalCapacity={displayData.provisionalCapacity}
        annexFacilities={displayData.annexFacilities}
        isEditMode={isEditMode}
        onFieldChange={handleFieldChange}
      />

      <DetailTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accessInfo={displayData.accessInfo}
        relationInfo={displayData.relationInfo}
        facilityName={displayData.name}
        philosophyInfo={displayData.philosophyInfo}
        specialtyInfo={displayData.specialtyInfo}
        staffInfo={displayData.staffInfo}
        educationInfo={displayData.educationInfo}
        advancedInfo={displayData.advancedInfo}
        otherInfo={displayData.otherInfo}
        isEditMode={isEditMode}
        onNestedFieldChange={updateNestedField}
      />
    </div>
  );
};
