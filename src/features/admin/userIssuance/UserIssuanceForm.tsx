'use client';

import { useState, useMemo } from 'react';

import { FormField, FormButton, LoadingOverlay, SuccessOverlay } from '@/components/form';
import searchMapData from '@/dummy_data/searchmap_data.json';

import { useUserIssuanceForm } from './hooks/useUserIssuanceForm';
import styles from './UserIssuanceForm.module.scss';

export const UserIssuanceForm = () => {
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
  } = useUserIssuanceForm();

  // 検索・絞り込み用のローカルState
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // JSONデータから選択肢リストを生成（IDを文字列に変換）
  const facilitiesList = useMemo(() => {
    return searchMapData.map((item) => ({
      id: String(item.id),
      name: item.name,
    }));
  }, []);

  // 文字列正規化用ユーティリティ（大文字小文字や全角半角の揺らぎを吸収）
  const normalizeText = (text: string): string => text.toLowerCase().normalize('NFKC');

  // 正規化済みの検索ワード
  const normalizedSearchTerm = useMemo(() => normalizeText(searchTerm), [searchTerm]);

  // フィルタリングされた施設リスト（正規化済み文字列同士で部分一致判定）
  const filteredFacilities = facilitiesList.filter((facility) =>
    normalizeText(facility.name).includes(normalizedSearchTerm),
  );

  // テキスト入力時のハンドラー
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    // 入力値が変わった場合、IDはいったんクリアする
    // updateFormData を使用して直接更新
    updateFormData('facilityId', '');
  };

  // リストから選択した時のハンドラー
  const handleSelectFacility = (facility: { id: string; name: string }) => {
    setSearchTerm(facility.name);
    setIsDropdownOpen(false);

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
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={handleBlur}
              autoComplete="off"
              required={!formData.facilityId}
            />
            {/* 隠しフィールド：実際のフォーム送信データ用 */}
            <input type="hidden" name="facilityId" value={formData.facilityId} />

            {/* 絞り込み結果リスト */}
            {isDropdownOpen && (
              <ul className={styles.dropdownList}>
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((facility) => (
                    <li
                      key={facility.id}
                      className={styles.dropdownItem}
                      onClick={() => handleSelectFacility(facility)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {facility.name}
                    </li>
                  ))
                ) : (
                  <li className={styles.noResult}>一致する施設がありません</li>
                )}
              </ul>
            )}

            {/* 施設選択のエラーメッセージ表示 */}
            {errors.facilityId && <p className={styles.facilityError}>{errors.facilityId}</p>}
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
