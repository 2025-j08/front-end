'use client';

import { useState, useMemo, useRef, useEffect } from 'react';

import { FormField, FormButton, LoadingOverlay, SuccessOverlay } from '@/components/form';

import { useUserIssuanceForm } from './hooks/useUserIssuanceForm';
import styles from './UserIssuanceForm.module.scss';

/**
 * 施設情報の型定義
 */
export interface Facility {
  id: number;
  name: string;
}

/**
 * UserIssuanceFormコンポーネントのプロップス
 */
export interface UserIssuanceFormProps {
  /** データベースから取得した施設一覧 */
  facilities: Facility[];
}

/**
 * 管理画面でユーザーを発行（作成）するためのフォームコンポーネントです。
 *
 * - データベースから取得した施設マスタを元にした施設検索・絞り込み・選択機能を提供します。
 * - `useUserIssuanceForm` フックを利用して、入力値の状態管理・バリデーション・送信処理を行います。
 * - 送信中はローディングオーバーレイ、成功時はサクセスオーバーレイを表示します。
 *
 * 使用例:
 * ```tsx
 * import { UserIssuanceForm } from '@/features/admin/userIssuance/UserIssuanceForm';
 *
 * const Page = async () => {
 *   const facilities = await fetchFacilities();
 *   return <UserIssuanceForm facilities={facilities} />;
 * };
 * ```
 *
 * @component
 */
/**
 * 文字列正規化用ユーティリティ（大文字小文字や全角半角の揺らぎを吸収）
 *
 * NFKC正規化により全角・半角文字を統一し、toLowerCase()で大小文字を統一します。
 * これにより、ユーザーの入力揺れに対応した柔軟な検索が可能になります。
 *
 * NOTE: 現在はこのコンポーネント内でのみ使用していますが、
 * 将来的に他のコンポーネントでも同様の文字列正規化が必要になった場合は、
 * src/lib/utils.ts などの共通ユーティリティファイルへの移動を検討してください。
 *
 * @param text - 正規化対象の文字列
 * @returns 正規化された文字列（小文字 + NFKC正規化）
 */
const normalizeText = (text: string): string => text.toLowerCase().normalize('NFKC');

export const UserIssuanceForm = ({ facilities }: UserIssuanceFormProps) => {
  // 検索・絞り込み用のローカルState
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // キーボードナビゲーション用のフォーカス管理
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // updateFormData をフックから取得
  const {
    formData,
    errors,
    submitError,
    isLoading,
    isSuccess,
    handleChange,
    updateFormData,
    handleSubmit,
  } = useUserIssuanceForm({
    onSuccess: () => setSearchTerm(''),
  });

  // データベースから取得した施設データから選択肢リストを生成（IDを文字列に変換）
  // 依存配列にfacilities: Server Componentから渡されるpropsのため、ビルド時に確定
  const facilitiesList = useMemo(() => {
    return facilities.map((item) => ({
      id: String(item.id),
      name: item.name,
    }));
  }, [facilities]);

  // 正規化済みの検索ワード
  const normalizedSearchTerm = useMemo(() => normalizeText(searchTerm), [searchTerm]);

  // フィルタリングされた施設リスト（正規化済み文字列同士で部分一致判定）
  const filteredFacilities = useMemo(() => {
    // 検索ワードが空の場合は正規化処理をスキップして全施設を返す
    if (normalizedSearchTerm === '') {
      return facilitiesList;
    }
    return facilitiesList.filter((facility) =>
      normalizeText(facility.name).includes(normalizedSearchTerm),
    );
  }, [facilitiesList, normalizedSearchTerm]);

  // フォーカスされた項目をスクロール表示
  useEffect(() => {
    if (focusedIndex >= 0 && listItemRefs.current[focusedIndex]) {
      listItemRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex]);

  // テキスト入力時のハンドラー
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
    setFocusedIndex(-1); // 検索時はフォーカスをリセット

    // 入力値が変わった場合、IDはいったんクリアする
    // updateFormData を使用して直接更新
    updateFormData('facilityId', '');
  };

  // キーボードナビゲーション: WAI-ARIAコンボボックスパターンに準拠
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || filteredFacilities.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < filteredFacilities.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredFacilities[focusedIndex]) {
          handleSelectFacility(filteredFacilities[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // リストから選択した時のハンドラー
  const handleSelectFacility = (facility: { id: string; name: string }) => {
    setSearchTerm(facility.name);
    setIsDropdownOpen(false);
    setFocusedIndex(-1); // 選択後はフォーカスをリセット

    // 選択された施設のIDをformDataにセット
    updateFormData('facilityId', facility.id);
  };

  // フォーカスアウト時の処理
  const handleBlur = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* ローディング・成功オーバーレイ */}
      <LoadingOverlay isVisible={isLoading} text="登録処理中..." />
      <SuccessOverlay isVisible={isSuccess} text="ユーザー発行が完了しました" />

      <h2 className={styles.title}>ユーザー発行</h2>

      {/* ブラウザのデフォルト検証を無効化 (noValidate) */}
      <form onSubmit={handleSubmit} noValidate>
        {/* メールアドレス入力部分を変更 */}
        <div className={styles.emailSection}>
          <FormField
            label="メールアドレス"
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
          {/* エラーメッセージ表示 */}
          {errors.email && (
            /* クラス適用に変更 */
            <p className={styles.errorMessage}>{errors.email}</p>
          )}
        </div>

        {/* 施設選択（検索機能付き） */}
        <div className={styles.selectWrapper}>
          <label htmlFor="facilitySearch">施設名</label>
          <div className={styles.comboboxContainer}>
            <input
              type="text"
              id="facilitySearch"
              className={styles.searchInput}
              placeholder="施設名を検索..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={handleBlur}
              autoComplete="off"
              required={!formData.facilityId}
              aria-describedby={errors.facilityId ? 'facilityId-error' : undefined}
              aria-invalid={!!errors.facilityId}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isDropdownOpen}
              aria-controls="facility-listbox"
              aria-activedescendant={
                focusedIndex >= 0 ? `facility-option-${focusedIndex}` : undefined
              }
            />
            {/* 隠しフィールド：実際のフォーム送信データ用 */}
            <input type="hidden" name="facilityId" value={formData.facilityId} />

            {/* 絞り込み結果リスト */}
            {isDropdownOpen && (
              <ul className={styles.dropdownList} id="facility-listbox" role="listbox">
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((facility, index) => (
                    <li
                      key={facility.id}
                      id={`facility-option-${index}`}
                      ref={(el) => {
                        listItemRefs.current[index] = el;
                      }}
                      className={styles.dropdownItem}
                      onClick={() => handleSelectFacility(facility)}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setFocusedIndex(index)}
                      role="option"
                      aria-selected={formData.facilityId === facility.id}
                      data-focused={focusedIndex === index}
                    >
                      {facility.name}
                    </li>
                  ))
                ) : (
                  <li className={styles.noResult} role="status" aria-live="polite">
                    一致する施設がありません
                  </li>
                )}
              </ul>
            )}

            {/* 施設選択のエラーメッセージ表示 */}
            {errors.facilityId && (
              <p id="facilityId-error" className={styles.facilityError}>
                {errors.facilityId}
              </p>
            )}
          </div>
        </div>

        {/* 送信エラーメッセージの表示 */}
        {submitError && (
          <div role="alert" className={styles.submitErrorMessage}>
            {submitError}
          </div>
        )}

        {/* 送信ボタン */}
        <div className={styles.submitButton}>
          <FormButton label="登録" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};
