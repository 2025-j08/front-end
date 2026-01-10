'use client';

/**
 * FacilityDetail コンポーネント
 * 施設詳細ページのメインコンポーネントです。
 * 表示モードと編集モードを切り替え可能
 */
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: facilityData, isLoading, error } = useFacilityData(id);
  const { activeTab, setActiveTab, tabs } = useFacilityDetail();

  // URLクエリパラメータから編集モード判定
  const isEditMode = searchParams.get('mode') === 'edit';

  // 編集フック
  const {
    formData,
    isSaving,
    isDirty,
    updateField,
    updateNestedField,
    handleSubmit,
    resetForm,
    errors,
    getError,
  } = useFacilityEdit(facilityData, id);

  // フィールド更新ハンドラー（BasicInfoSection用）
  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      updateField(field as keyof typeof formData, value as never);
    },
    [updateField],
  );

  // 保存処理
  const handleSave = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      // 成功したら完了後に閲覧モードへ（クエリパラム削除）
      router.push(`/features/facilities/${id}`);
      router.refresh();
    }
  }, [handleSubmit, router, id]);

  // キャンセル処理
  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('変更が保存されていません。破棄してもよろしいですか？');
      if (!confirmed) return;
    }
    resetForm();
    // 閲覧モードへ戻る
    router.push(`/features/facilities/${id}`);
  }, [isDirty, resetForm, router, id]);

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
        getError={getError}
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
        errors={errors}
        getError={getError}
      />
    </div>
  );
};
