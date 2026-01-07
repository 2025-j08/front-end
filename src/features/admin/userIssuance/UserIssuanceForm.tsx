'use client';

import { useState } from 'react';

import { FormField, FormButton, LoadingOverlay, SuccessOverlay } from '@/components/form';

import { useUserIssuanceForm } from './hooks/useUserIssuanceForm';
import styles from './UserIssuanceForm.module.scss';

// 開発用ダミーデータ
const FACILITIES = [
  { id: '1', name: 'あおば児童養護施設' },
  { id: '2', name: '双葉学園' },
  { id: '3', name: 'みどりの里' },
  { id: '4', name: 'つばさ福祉ホーム' },
  { id: '5', name: 'こども未来園' },
];

export const UserIssuanceForm = () => {
  // カスタムフックからロジックと状態を取得
  const { formData, isLoading, isSuccess, handleChange, handleSubmit } = useUserIssuanceForm();

  // 検索・絞り込み用のローカルState
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // フィルタリングされた施設リスト
  const filteredFacilities = FACILITIES.filter((facility) => facility.name.includes(searchTerm));

  // テキスト入力時のハンドラー
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    // 入力値が変わった場合、IDはいったんクリアする（選択解除扱い）
    // 型定義に合わせて疑似的なイベントオブジェクトを作成して渡す
    handleChange({
      target: { name: 'facilityId', value: '' },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // リストから選択した時のハンドラー
  const handleSelectFacility = (facility: { id: string; name: string }) => {
    setSearchTerm(facility.name);
    setIsDropdownOpen(false);

    // 選択された施設のIDをformDataにセット
    handleChange({
      target: { name: 'facilityId', value: facility.id },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // フォーカスアウト時の処理（クリックイベントを完了させるために遅延）
  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  return (
    <div className={styles.container}>
      {/* ローディング・成功オーバーレイ */}
      <LoadingOverlay isVisible={isLoading} text="登録処理中..." />
      <SuccessOverlay isVisible={isSuccess} text="ユーザー発行が完了しました" />

      <h2 className={styles.title}>ユーザー発行</h2>

      <form onSubmit={handleSubmit}>
        {/* メールアドレス入力 */}
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
              required={!formData.facilityId} // IDが空なら必須扱い
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
                      onMouseDown={(e) => e.preventDefault()} // フォーカス外れ防止
                    >
                      {facility.name}
                    </li>
                  ))
                ) : (
                  <li className={styles.noResult}>一致する施設がありません</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <div className={styles.submitButton}>
          <FormButton
            label="登録"
            isLoading={isLoading}
            // IDが選択されていない場合はボタンを押せないようにするなどの制御も可能
          />
        </div>
      </form>
    </div>
  );
};
