/**
 * 施設編集用カスタムフック
 * API連携を考慮した設計
 */
import { useState, useCallback, useRef, useEffect } from 'react';

import { FacilityDetail } from '@/types/facility';

/** 編集フォームの状態 */
type EditFormState = {
  /** 編集中のデータ */
  formData: Partial<FacilityDetail>;
  /** 変更されたフィールド（差分検出用） */
  changedFields: Set<string>;
  /** 保存中フラグ */
  isSaving: boolean;
  /** フォームが変更されたか */
  isDirty: boolean;
  /** バリデーションエラー */
  errors: Record<string, string>;
};

/** フックの戻り値型 */
type UseFacilityEditReturn = {
  formData: Partial<FacilityDetail>;
  isSaving: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
  /** 単一フィールドの更新 */
  updateField: <K extends keyof FacilityDetail>(field: K, value: FacilityDetail[K]) => void;
  /** ネストしたフィールドの更新 */
  updateNestedField: <K extends keyof FacilityDetail>(
    parent: K,
    field: string,
    value: unknown,
  ) => void;
  /** フォーム送信 */
  handleSubmit: () => Promise<boolean>;
  /** 変更をリセット */
  resetForm: () => void;
  /** 特定フィールドのエラー取得 */
  getError: (field: string) => string | undefined;
};

/**
 * 施設編集フック
 * @param initialData 初期データ（既存の施設情報）
 * @param facilityId 施設ID
 */
// バリデーションヘルパー関数（純粋関数）
const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^0\d{1,4}[-]?\d{1,4}[-]?\d{3,4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const isValidUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidLatitude = (lat: number | undefined): boolean => {
  if (lat === undefined) return true;
  return lat >= -90 && lat <= 90;
};

const isValidLongitude = (lng: number | undefined): boolean => {
  if (lng === undefined) return true;
  return lng >= -180 && lng <= 180;
};

// バリデーションロジック（純粋関数）
const validateFacilityData = (formData: Partial<FacilityDetail>): Record<string, string> => {
  const errors: Record<string, string> = {};

  // 必須フィールドのチェック
  if (!formData.name?.trim()) {
    errors.name = '施設名は必須です';
  }
  if (!formData.fullAddress?.trim()) {
    errors.fullAddress = '住所は必須です';
  }
  if (!formData.phone?.trim()) {
    errors.phone = '電話番号は必須です';
  } else if (!isValidPhoneNumber(formData.phone)) {
    errors.phone = '電話番号の形式が正しくありません（例: 03-1234-5678）';
  }

  // URLフォーマットチェック
  if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
    errors.websiteUrl = 'URLの形式が正しくありません（https://で始めてください）';
  }

  // 緯度・経度の範囲チェック
  if (!isValidLatitude(formData.accessInfo?.lat)) {
    errors['accessInfo.lat'] = '緯度は-90〜90の範囲で入力してください';
  }
  if (!isValidLongitude(formData.accessInfo?.lng)) {
    errors['accessInfo.lng'] = '経度は-180〜180の範囲で入力してください';
  }

  // 定員の正の数チェック
  if (formData.capacity !== undefined && formData.capacity < 0) {
    errors.capacity = '定員は0以上の数値を入力してください';
  }
  if (formData.provisionalCapacity !== undefined && formData.provisionalCapacity < 0) {
    errors.provisionalCapacity = '暫定定員は0以上の数値を入力してください';
  }

  return errors;
};

// 初期状態を生成するヘルパー関数（純粋関数）
const createInitialState = (data: FacilityDetail | null): EditFormState => ({
  formData: data ? { ...data } : {},
  changedFields: new Set(),
  isSaving: false,
  isDirty: false,
  errors: {},
});

export const useFacilityEdit = (
  initialData: FacilityDetail | null,
  facilityId: string,
): UseFacilityEditReturn => {
  const [state, setState] = useState<EditFormState>(() => createInitialState(initialData));

  // handleSubmitで最新のstateを参照するためのref
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const [lastInitialDataId, setLastInitialDataId] = useState<number | null>(
    initialData?.id ?? null,
  );

  if (initialData && initialData.id !== lastInitialDataId) {
    setLastInitialDataId(initialData.id);
    setState(createInitialState(initialData));
  }

  // ... (updateField, updateNestedField は変更なし、ただし元の位置にあると仮定)

  const updateField = useCallback(
    <K extends keyof FacilityDetail>(field: K, value: FacilityDetail[K]) => {
      setState((prev) => {
        const newChangedFields = new Set(prev.changedFields);
        newChangedFields.add(field);

        return {
          ...prev,
          formData: {
            ...prev.formData,
            [field]: value,
          },
          changedFields: newChangedFields,
          isDirty: true,
          errors: {
            ...prev.errors,
            [field]: '',
          },
        };
      });
    },
    [],
  );

  const updateNestedField = useCallback(
    <K extends keyof FacilityDetail>(parent: K, field: string, value: unknown) => {
      setState((prev) => {
        const parentObj = prev.formData[parent];
        const newChangedFields = new Set(prev.changedFields);
        newChangedFields.add(`${String(parent)}.${field}`);

        return {
          ...prev,
          formData: {
            ...prev.formData,
            [parent]: {
              ...(typeof parentObj === 'object' && parentObj !== null ? parentObj : {}),
              [field]: value,
            },
          },
          changedFields: newChangedFields,
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

  // フォーム送信（API連携用の準備）
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    // refから最新のstateを取得（依存配列からstate.formData, state.changedFieldsを除外するため）
    const { formData, changedFields } = stateRef.current;

    // バリデーション実行（純粋関数を使用）
    const errors = validateFacilityData(formData);

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, errors }));
      return false;
    }

    setState((prev) => ({ ...prev, isSaving: true }));

    try {
      // ... (送信処理は変更なし)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Facility update payload:', {
        facilityId,
        data: formData,
        changedFields: Array.from(changedFields),
      });

      setState((prev) => ({
        ...prev,
        isSaving: false,
        isDirty: false,
        changedFields: new Set(),
      }));

      return true;
    } catch (error) {
      console.error('Failed to save facility:', error);
      setState((prev) => ({
        ...prev,
        isSaving: false,
        errors: {
          ...prev.errors,
          _form: '保存に失敗しました。もう一度お試しください。',
        },
      }));
      return false;
    }
  }, [facilityId]);

  // フォームリセット
  const resetForm = useCallback(() => {
    if (initialData) {
      setState({
        formData: { ...initialData },
        changedFields: new Set(),
        isSaving: false,
        isDirty: false,
        errors: {},
      });
    }
  }, [initialData]);

  // エラー取得ヘルパー
  const getError = useCallback(
    (field: string): string | undefined => {
      return state.errors[field] || undefined;
    },
    [state.errors],
  );

  return {
    formData: state.formData,
    isSaving: state.isSaving,
    isDirty: state.isDirty,
    errors: state.errors,
    updateField,
    updateNestedField,
    handleSubmit,
    resetForm,
    getError,
  };
};
