/**
 * タブ別施設編集用カスタムフック
 * 各タブが独立して編集・保存できるように状態を管理
 */
import { useState, useCallback } from 'react';

import type { FacilityDetail } from '@/types/facility';
import type { TabUpdateData } from '@/lib/supabase/mutations/facilities';

/** タブセクション名 */
export type TabSection =
  | 'basic'
  | 'access'
  | 'philosophy'
  | 'specialty'
  | 'staff'
  | 'education'
  | 'advanced'
  | 'other';

/** 編集フォームの状態（タブごと） */
type TabEditState = {
  /** 編集中のデータ */
  formData: Partial<FacilityDetail>;
  /** 変更されたか */
  isDirty: boolean;
  /** 保存中フラグ */
  isSaving: boolean;
  /** エラー */
  errors: Record<string, string>;
};

/** フックの戻り値型 */
type UseFacilityTabEditReturn = {
  /** 編集中のフォームデータ */
  formData: Partial<FacilityDetail>;
  /** 変更されたか */
  isDirty: boolean;
  /** 保存中フラグ */
  isSaving: boolean;
  /** エラー */
  errors: Record<string, string>;
  /** フィールド更新 */
  updateField: <K extends keyof FacilityDetail>(field: K, value: FacilityDetail[K]) => void;
  /** ネストしたフィールドの更新 */
  updateNestedField: <K extends keyof FacilityDetail>(
    parent: K,
    field: string,
    value: unknown,
  ) => void;
  /** タブデータを保存 */
  saveTab: (section: TabSection) => Promise<boolean>;
  /** フォームをリセット */
  resetForm: () => void;
  /** エラー取得 */
  getError: (field: string) => string | undefined;
};

/**
 * タブ別施設編集フック
 * @param initialData - 初期データ（既存の施設情報）
 * @param facilityId - 施設ID
 * @param onSaveSuccess - 保存成功時のコールバック（最新データを受け取る）
 */
export const useFacilityTabEdit = (
  initialData: FacilityDetail | null,
  facilityId: string,
  onSaveSuccess?: (updatedData: FacilityDetail) => void,
): UseFacilityTabEditReturn => {
  const [state, setState] = useState<TabEditState>({
    formData: initialData ? { ...initialData } : {},
    isDirty: false,
    isSaving: false,
    errors: {},
  });

  // initialDataが変わったらstateを更新
  const [lastInitialDataId, setLastInitialDataId] = useState<number | null>(
    initialData?.id ?? null,
  );

  if (initialData && initialData.id !== lastInitialDataId) {
    setLastInitialDataId(initialData.id);
    setState({
      formData: { ...initialData },
      isDirty: false,
      isSaving: false,
      errors: {},
    });
  }

  /** 単一フィールドの更新 */
  const updateField = useCallback(
    <K extends keyof FacilityDetail>(field: K, value: FacilityDetail[K]) => {
      setState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          [field]: value,
        },
        isDirty: true,
        errors: {
          ...prev.errors,
          [field]: '',
        },
      }));
    },
    [],
  );

  /** ネストしたフィールドの更新 */
  const updateNestedField = useCallback(
    <K extends keyof FacilityDetail>(parent: K, field: string, value: unknown) => {
      setState((prev) => {
        const parentObj = prev.formData[parent];
        return {
          ...prev,
          formData: {
            ...prev.formData,
            [parent]: {
              ...(typeof parentObj === 'object' && parentObj !== null ? parentObj : {}),
              [field]: value,
            },
          },
          isDirty: true,
          errors: {
            ...prev.errors,
            [`${String(parent)}.${field}`]: '',
          },
        };
      });
    },
    [],
  );

  /** タブデータを保存 */
  const saveTab = useCallback(
    async (section: TabSection): Promise<boolean> => {
      setState((prev) => ({ ...prev, isSaving: true, errors: {} }));

      try {
        // セクション別に更新データを構築
        const updateData = buildUpdateData(section, state.formData);

        if (!updateData) {
          setState((prev) => ({
            ...prev,
            isSaving: false,
            errors: { _form: '更新するデータがありません' },
          }));
          return false;
        }

        // APIリクエスト
        const response = await fetch(`/api/facilities/${facilityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '保存に失敗しました');
        }

        // 成功時の処理
        setState((prev) => ({
          ...prev,
          isSaving: false,
          isDirty: false,
          formData: result.data || prev.formData,
        }));

        // コールバック実行
        if (onSaveSuccess && result.data) {
          onSaveSuccess(result.data);
        }

        return true;
      } catch (error) {
        console.error('施設情報の保存に失敗しました:', error);
        setState((prev) => ({
          ...prev,
          isSaving: false,
          errors: {
            _form: error instanceof Error ? error.message : '保存に失敗しました',
          },
        }));
        return false;
      }
    },
    [facilityId, state.formData, onSaveSuccess],
  );

  /** フォームをリセット */
  const resetForm = useCallback(() => {
    if (initialData) {
      setState({
        formData: { ...initialData },
        isDirty: false,
        isSaving: false,
        errors: {},
      });
    }
  }, [initialData]);

  /** エラー取得 */
  const getError = useCallback(
    (field: string): string | undefined => {
      return state.errors[field] || undefined;
    },
    [state.errors],
  );

  return {
    formData: state.formData,
    isDirty: state.isDirty,
    isSaving: state.isSaving,
    errors: state.errors,
    updateField,
    updateNestedField,
    saveTab,
    resetForm,
    getError,
  };
};

/**
 * セクション別に更新データを構築するヘルパー関数
 */
function buildUpdateData(
  section: TabSection,
  formData: Partial<FacilityDetail>,
): TabUpdateData | null {
  switch (section) {
    case 'basic':
      return {
        section: 'basic',
        data: {
          name: formData.name,
          phone: formData.phone,
          corporation: formData.corporation,
          established_year: formData.establishedYear
            ? parseInt(formData.establishedYear, 10)
            : undefined,
          annex_facilities: formData.annexFacilities,
        },
      };

    case 'access':
      return {
        section: 'access',
        data: {
          station: formData.accessInfo?.station,
          description: formData.accessInfo?.description,
          locationAppeal: formData.accessInfo?.locationAppeal,
          websiteUrl: formData.websiteUrl,
          capacity: formData.capacity,
          provisionalCapacity: formData.provisionalCapacity,
          relationInfo: formData.relationInfo,
        },
      };

    case 'philosophy':
      if (!formData.philosophyInfo) return null;
      return {
        section: 'philosophy',
        data: {
          description: formData.philosophyInfo.description,
        },
      };

    case 'specialty':
      if (!formData.specialtyInfo) return null;
      return {
        section: 'specialty',
        data: {
          features: formData.specialtyInfo.features,
          programs: formData.specialtyInfo.programs,
        },
      };

    case 'staff':
      if (!formData.staffInfo) return null;
      return {
        section: 'staff',
        data: {
          fullTimeStaffCount: formData.staffInfo.fullTimeStaffCount,
          partTimeStaffCount: formData.staffInfo.partTimeStaffCount,
          specialties: formData.staffInfo.specialties,
          averageTenure: formData.staffInfo.averageTenure,
          ageDistribution: formData.staffInfo.ageDistribution,
          workStyle: formData.staffInfo.workStyle,
          hasUniversityLecturer: formData.staffInfo.hasUniversityLecturer,
          lectureSubjects: formData.staffInfo.lectureSubjects,
          externalActivities: formData.staffInfo.externalActivities,
          qualificationsAndSkills: formData.staffInfo.qualificationsAndSkills,
          internshipDetails: formData.staffInfo.internshipDetails,
        },
      };

    case 'education':
      if (!formData.educationInfo) return null;
      return {
        section: 'education',
        data: {
          graduationRate: formData.educationInfo.graduationRate,
          learningSupport: formData.educationInfo.learningSupport,
          careerSupport: formData.educationInfo.careerSupport,
        },
      };

    case 'advanced':
      if (!formData.advancedInfo) return null;
      return {
        section: 'advanced',
        data: {
          title: formData.advancedInfo.title,
          description: formData.advancedInfo.description,
          background: formData.advancedInfo.background,
          challenges: formData.advancedInfo.challenges,
          solutions: formData.advancedInfo.solutions,
        },
      };

    case 'other':
      if (!formData.otherInfo) return null;
      return {
        section: 'other',
        data: {
          title: formData.otherInfo.title,
          description: formData.otherInfo.description,
          networks: formData.otherInfo.networks,
          futureOutlook: formData.otherInfo.futureOutlook,
          freeText: formData.otherInfo.freeText,
        },
      };

    default:
      return null;
  }
}
