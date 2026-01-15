/**
 * タブ別施設編集用カスタムフック
 * 各タブが独立して編集・保存できるように状態を管理
 */
import { useState, useCallback, useEffect } from 'react';

import type { FacilityDetail } from '@/types/facility';

import { buildUpdateData, TAB_SECTIONS, type TabSection } from '../utils/fieldMapping';

// 型とTAB_SECTIONSを再エクスポート
export { TAB_SECTIONS, type TabSection };

/**
 * ネストしたオブジェクトをマージするヘルパー関数
 * 両方undefinedの場合はundefinedを返す
 */
function mergeNested<T>(base: T | undefined, override: Partial<T> | undefined): T | undefined {
  if (!base && !override) return undefined;
  return { ...base, ...override } as T;
}

/**
 * セクションからフィールド一覧を取得するマッピング
 * resetSection や getSectionFromField で共有することで一貫性を保証
 */
const SECTION_FIELDS: Record<TabSection, ReadonlyArray<keyof FacilityDetail>> = {
  basic: ['name', 'phone', 'corporation', 'establishedYear', 'annexFacilities'],
  access: ['accessInfo', 'websiteUrl', 'capacity', 'provisionalCapacity', 'relationInfo'],
  philosophy: ['philosophyInfo'],
  specialty: ['specialtyInfo'],
  staff: ['staffInfo'],
  education: ['educationInfo'],
  advanced: ['advancedInfo'],
  images: ['images'],
  other: ['otherInfo'],
};

/**
 * フィールド名からセクション名を取得するヘルパー
 * SECTION_FIELDS を逆引きして取得
 */
function getSectionFromField<K extends keyof FacilityDetail>(field: K): TabSection {
  const section = (Object.keys(SECTION_FIELDS) as TabSection[]).find((key) =>
    SECTION_FIELDS[key].includes(field),
  );
  return section || 'basic'; // デフォルト
}

/** 編集フォームの状態（タブごと） */
type TabEditState = {
  /** 編集中のデータ */
  formData: Partial<FacilityDetail>;
  /** セクション別の変更フラグ */
  dirtyMap: Map<TabSection, boolean>;
  /** 保存中フラグ */
  isSaving: boolean;
  /** エラー */
  errors: Record<string, string>;
};

/** フックの戻り値型 */
type UseFacilityTabEditReturn = {
  /** 編集中のフォームデータ */
  formData: Partial<FacilityDetail>;
  /** セクション別の変更状態を取得 */
  isDirty: (section: TabSection) => boolean;
  /** いずれかのセクションに未保存の変更があるか */
  hasUnsavedChanges: boolean;
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
  /** 特定セクションをリセット */
  resetSection: (section: TabSection) => void;
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
    formData: initialData
      ? (() => {
        const { images, ...rest } = initialData;
        return rest;
      })()
      : {},
    dirtyMap: new Map(),
    isSaving: false,
    errors: {},
  });

  // initialDataが変わったらstateを更新（useEffectで副作用として処理）
  useEffect(() => {
    if (initialData) {
      setState({
        formData: (() => {
          const { images, ...rest } = initialData;
          return rest;
        })(),
        dirtyMap: new Map(),
        isSaving: false,
        errors: {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]); // idが変わった時のみ更新（initialData全体を含めると無限ループになる）

  /** 単一フィールドの更新 */
  const updateField = useCallback(
    <K extends keyof FacilityDetail>(field: K, value: FacilityDetail[K]) => {
      const section = getSectionFromField(field);
      setState((prev) => {
        const newDirtyMap = new Map(prev.dirtyMap);
        newDirtyMap.set(section, true);
        return {
          ...prev,
          formData: {
            ...prev.formData,
            [field]: value,
          },
          dirtyMap: newDirtyMap,
          errors: {
            ...prev.errors,
            [field]: '',
          },
        };
      });
    },
    [],
  );

  /** ネストしたフィールドの更新 */
  const updateNestedField = useCallback(
    <K extends keyof FacilityDetail>(parent: K, field: string, value: unknown) => {
      const section = getSectionFromField(parent);
      setState((prev) => {
        const parentObj = prev.formData[parent];
        const newDirtyMap = new Map(prev.dirtyMap);
        newDirtyMap.set(section, true);
        return {
          ...prev,
          formData: {
            ...prev.formData,
            [parent]: {
              ...(typeof parentObj === 'object' && parentObj !== null ? parentObj : {}),
              [field]: value,
            },
          },
          dirtyMap: newDirtyMap,
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
        // initialDataとformDataをマージして完全なデータを構築
        const mergedFormData: Partial<FacilityDetail> = initialData
          ? {
            ...initialData,
            ...state.formData,
            // ネストしたオブジェクトもマージ（mergeNestedで統一）
            accessInfo: mergeNested(initialData.accessInfo, state.formData.accessInfo),
            philosophyInfo: mergeNested(
              initialData.philosophyInfo,
              state.formData.philosophyInfo,
            ),
            specialtyInfo: mergeNested(initialData.specialtyInfo, state.formData.specialtyInfo),
            staffInfo: mergeNested(initialData.staffInfo, state.formData.staffInfo),
            educationInfo: mergeNested(initialData.educationInfo, state.formData.educationInfo),
            advancedInfo: mergeNested(initialData.advancedInfo, state.formData.advancedInfo),
            otherInfo: mergeNested(initialData.otherInfo, state.formData.otherInfo),
          }
          : state.formData;

        // セクション別に更新データを構築
        const updateData = buildUpdateData(section, mergedFormData);

        console.log(`[saveTab] Section: ${section}`, {
          updateData,
          hasData: updateData !== null,
          dataKeys: updateData?.data ? Object.keys(updateData.data) : [],
        });

        if (!updateData) {
          setState((prev) => ({
            ...prev,
            isSaving: false,
            errors: { _form: '更新するデータがありません' },
          }));
          return false;
        }

        if (Object.keys(updateData.data).length === 0) {
          console.warn(`[saveTab] データが空です:`, updateData);
          setState((prev) => ({
            ...prev,
            isSaving: false,
            errors: { _form: '更新するデータが空です' },
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

        // 成功時の処理 - 保存したセクションのdirtyフラグをクリア
        setState((prev) => {
          const newDirtyMap = new Map(prev.dirtyMap);
          newDirtyMap.set(section, false);
          return {
            ...prev,
            isSaving: false,
            dirtyMap: newDirtyMap,
            formData: result.data || prev.formData,
          };
        });

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
    [facilityId, state.formData, onSaveSuccess, initialData],
  );

  /** フォームをリセット */
  const resetForm = useCallback(() => {
    if (initialData) {
      setState({
        formData: { ...initialData },
        dirtyMap: new Map(),
        isSaving: false,
        errors: {},
      });
    }
  }, [initialData]);

  /** 特定セクションをリセット */
  const resetSection = useCallback(
    (section: TabSection) => {
      if (!initialData) return;
      // images は ImagesTab.reset() で別管理のためスキップ
      if (section === 'images') return;

      setState((prev) => {
        const newDirtyMap = new Map(prev.dirtyMap);
        newDirtyMap.set(section, false);

        // セクションに対応するフィールドを初期値に戻す
        const newFormData = { ...prev.formData };
        const fields = SECTION_FIELDS[section];

        for (const field of fields) {
          (newFormData as Record<string, unknown>)[field] = initialData[field];
        }

        return {
          ...prev,
          formData: newFormData,
          dirtyMap: newDirtyMap,
        };
      });
    },
    [initialData],
  );

  /** エラー取得 */
  const getError = useCallback(
    (field: string): string | undefined => {
      return state.errors[field] || undefined;
    },
    [state.errors],
  );

  /** セクション別のisDirty状態を取得 */
  const isDirty = useCallback(
    (section: TabSection): boolean => {
      return state.dirtyMap.get(section) ?? false;
    },
    [state.dirtyMap],
  );

  // いずれかのセクションに未保存の変更があるかチェック
  const hasUnsavedChanges = Array.from(state.dirtyMap.values()).some((dirty) => dirty);

  return {
    formData: state.formData,
    isDirty,
    hasUnsavedChanges,
    isSaving: state.isSaving,
    errors: state.errors,
    updateField,
    updateNestedField,
    saveTab,
    resetForm,
    resetSection,
    getError,
  };
};