'use client';

/**
 * 施設編集ページ
 * 施設詳細情報を編集するためのフォームを提供
 */
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useFacilityData } from '../hooks/useFacilityData';
import { useFacilityEdit } from './hooks/useFacilityEdit';
import styles from './page.module.scss';

type Props = {
  id: string;
};

export const FacilityEdit = ({ id }: Props) => {
  const router = useRouter();
  const { data: facilityData, isLoading, error } = useFacilityData(id);
  const {
    formData,
    isSaving,
    isDirty,
    updateField,
    updateNestedField,
    handleSubmit,
    resetForm,
    getError,
  } = useFacilityEdit(facilityData, id);

  const [showSuccess, setShowSuccess] = useState(false);

  // 保存処理
  const onSave = async () => {
    const success = await handleSubmit();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push(`/features/facilities/${id}`);
      }, 1500);
    }
  };

  // キャンセル処理
  const onCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('変更が保存されていません。破棄してもよろしいですか？');
      if (!confirmed) return;
    }
    router.push(`/features/facilities/${id}`);
  };

  if (isLoading) {
    return <div className={styles.loadingState}>読み込み中...</div>;
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  if (!facilityData) {
    return <div className={styles.errorState}>施設データが見つかりません</div>;
  }

  return (
    <div className={styles.editPage}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div>
          <h1>施設情報の編集</h1>
          {isDirty && <span className={styles.dirtyIndicator}>● 未保存の変更があります</span>}
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSaving}
          >
            キャンセル
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={onSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? '保存中...' : '保存する'}
          </button>
        </div>
      </header>

      {/* 成功メッセージ */}
      {showSuccess && <div className={styles.successMessage}>保存しました！</div>}

      {/* 基本情報セクション */}
      <section className={styles.formSection}>
        <h2>基本情報</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              施設名<span className={styles.requiredMark}>*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              className={getError('name') ? styles.inputError : undefined}
            />
            {getError('name') && <p className={styles.errorMessage}>{getError('name')}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="corporation">運営法人</label>
            <input
              type="text"
              id="corporation"
              value={formData.corporation || ''}
              onChange={(e) => updateField('corporation', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="fullAddress">
              住所<span className={styles.requiredMark}>*</span>
            </label>
            <input
              type="text"
              id="fullAddress"
              value={formData.fullAddress || ''}
              onChange={(e) => updateField('fullAddress', e.target.value)}
              className={getError('fullAddress') ? styles.inputError : undefined}
            />
            {getError('fullAddress') && (
              <p className={styles.errorMessage}>{getError('fullAddress')}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">
              電話番号<span className={styles.requiredMark}>*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className={getError('phone') ? styles.inputError : undefined}
            />
            {getError('phone') && <p className={styles.errorMessage}>{getError('phone')}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="websiteUrl">ウェブサイトURL</label>
            <input
              type="url"
              id="websiteUrl"
              value={formData.websiteUrl || ''}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
              placeholder="https://example.com"
              className={getError('websiteUrl') ? styles.inputError : undefined}
            />
            {getError('websiteUrl') && (
              <p className={styles.errorMessage}>{getError('websiteUrl')}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="establishedYear">設立年</label>
            <input
              type="text"
              id="establishedYear"
              value={formData.establishedYear || ''}
              onChange={(e) => updateField('establishedYear', e.target.value)}
              placeholder="例: 1955年（昭和30年）4月"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dormitoryType">舎の区分</label>
            <select
              id="dormitoryType"
              value={formData.dormitoryType || ''}
              onChange={(e) =>
                updateField(
                  'dormitoryType',
                  e.target.value as '大舎' | '中舎' | '小舎' | 'グループホーム' | '地域小規模',
                )
              }
            >
              <option value="">選択してください</option>
              <option value="大舎">大舎</option>
              <option value="中舎">中舎</option>
              <option value="小舎">小舎</option>
              <option value="グループホーム">グループホーム</option>
              <option value="地域小規模">地域小規模</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="capacity">定員</label>
            <input
              type="number"
              id="capacity"
              value={formData.capacity || ''}
              onChange={(e) =>
                updateField('capacity', e.target.value ? Number(e.target.value) : undefined)
              }
              min={0}
              className={getError('capacity') ? styles.inputError : undefined}
            />
            {getError('capacity') && <p className={styles.errorMessage}>{getError('capacity')}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="provisionalCapacity">暫定定員</label>
            <input
              type="number"
              id="provisionalCapacity"
              value={formData.provisionalCapacity || ''}
              onChange={(e) =>
                updateField(
                  'provisionalCapacity',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
              className={getError('provisionalCapacity') ? styles.inputError : undefined}
            />
            {getError('provisionalCapacity') && (
              <p className={styles.errorMessage}>{getError('provisionalCapacity')}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="targetAge">対象年齢</label>
            <input
              type="text"
              id="targetAge"
              value={formData.targetAge || ''}
              onChange={(e) => updateField('targetAge', e.target.value)}
              placeholder="例: 概ね2歳〜18歳"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="building">建物情報</label>
            <input
              type="text"
              id="building"
              value={formData.building || ''}
              onChange={(e) => updateField('building', e.target.value)}
              placeholder="例: 鉄筋コンクリート造3階建"
            />
          </div>
        </div>
      </section>

      {/* アクセス情報セクション */}
      <section className={styles.formSection}>
        <h2>アクセス情報</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="locationAddress">所在地住所</label>
            <input
              type="text"
              id="locationAddress"
              value={formData.accessInfo?.locationAddress || ''}
              onChange={(e) => updateNestedField('accessInfo', 'locationAddress', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="station">最寄り駅・アクセス方法</label>
            <input
              type="text"
              id="station"
              value={formData.accessInfo?.station || ''}
              onChange={(e) => updateNestedField('accessInfo', 'station', e.target.value)}
              placeholder="例: JR線「○○」駅より徒歩10分"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="accessDescription">ロケーション説明</label>
            <textarea
              id="accessDescription"
              value={formData.accessInfo?.description || ''}
              onChange={(e) => updateNestedField('accessInfo', 'description', e.target.value)}
              placeholder="施設周辺の環境などを説明"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lat">緯度</label>
            <input
              type="number"
              id="lat"
              step="0.000001"
              value={formData.accessInfo?.lat || ''}
              onChange={(e) => updateNestedField('accessInfo', 'lat', Number(e.target.value))}
              className={getError('accessInfo.lat') ? styles.inputError : undefined}
            />
            {getError('accessInfo.lat') && (
              <p className={styles.errorMessage}>{getError('accessInfo.lat')}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lng">経度</label>
            <input
              type="number"
              id="lng"
              step="0.000001"
              value={formData.accessInfo?.lng || ''}
              onChange={(e) => updateNestedField('accessInfo', 'lng', Number(e.target.value))}
              className={getError('accessInfo.lng') ? styles.inputError : undefined}
            />
            {getError('accessInfo.lng') && (
              <p className={styles.errorMessage}>{getError('accessInfo.lng')}</p>
            )}
          </div>
        </div>
      </section>

      {/* 理念情報セクション */}
      <section className={styles.formSection}>
        <h2>理念</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="philosophyTitle">理念タイトル</label>
            <input
              type="text"
              id="philosophyTitle"
              value={formData.philosophyInfo?.title || ''}
              onChange={(e) => updateNestedField('philosophyInfo', 'title', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="philosophyDescription">理念の説明</label>
            <textarea
              id="philosophyDescription"
              value={formData.philosophyInfo?.description || ''}
              onChange={(e) => updateNestedField('philosophyInfo', 'description', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* 地域連携情報セクション */}
      <section className={styles.formSection}>
        <h2>地域連携</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="relationInfo">地域連携情報</label>
            <textarea
              id="relationInfo"
              value={formData.relationInfo || ''}
              onChange={(e) => updateField('relationInfo', e.target.value)}
              rows={4}
              placeholder="地域との連携や交流についての情報"
            />
          </div>
        </div>
      </section>

      {/* 生活環境・特色セクション */}
      <section className={styles.formSection}>
        <h2>生活環境・特色</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="specialtyFeatures">特に力を入れている取り組み</label>
            <textarea
              id="specialtyFeatures"
              value={formData.specialtyInfo?.features?.join('\n') || ''}
              onChange={(e) =>
                updateNestedField(
                  'specialtyInfo',
                  'features',
                  e.target.value.split('\n').filter((f) => f.trim()),
                )
              }
              rows={5}
              placeholder="1行に1つずつ入力してください"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="specialtyPrograms">特色ある活動や独自プログラム</label>
            <textarea
              id="specialtyPrograms"
              value={formData.specialtyInfo?.programs || ''}
              onChange={(e) => updateNestedField('specialtyInfo', 'programs', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* 職員情報セクション */}
      <section className={styles.formSection}>
        <h2>職員情報</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="staffCount">職員数</label>
            <input
              type="text"
              id="staffCount"
              value={formData.staffInfo?.staffCount || ''}
              onChange={(e) => updateNestedField('staffInfo', 'staffCount', e.target.value)}
              placeholder="例: 常勤16名、非常勤6名"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="averageTenure">平均勤続年数</label>
            <input
              type="text"
              id="averageTenure"
              value={formData.staffInfo?.averageTenure || ''}
              onChange={(e) => updateNestedField('staffInfo', 'averageTenure', e.target.value)}
              placeholder="例: 6年"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="staffSpecialties">職員の特徴・専門性</label>
            <textarea
              id="staffSpecialties"
              value={formData.staffInfo?.specialties || ''}
              onChange={(e) => updateNestedField('staffInfo', 'specialties', e.target.value)}
              rows={2}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ageDistribution">年齢層の傾向</label>
            <input
              type="text"
              id="ageDistribution"
              value={formData.staffInfo?.ageDistribution || ''}
              onChange={(e) => updateNestedField('staffInfo', 'ageDistribution', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="hasUniversityLecturer">大学講義担当</label>
            <select
              id="hasUniversityLecturer"
              value={
                formData.staffInfo?.hasUniversityLecturer === undefined
                  ? ''
                  : formData.staffInfo.hasUniversityLecturer
                    ? 'true'
                    : 'false'
              }
              onChange={(e) =>
                updateNestedField(
                  'staffInfo',
                  'hasUniversityLecturer',
                  e.target.value === '' ? undefined : e.target.value === 'true',
                )
              }
            >
              <option value="">未設定</option>
              <option value="true">有</option>
              <option value="false">無</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="lectureSubjects">担当科目</label>
            <input
              type="text"
              id="lectureSubjects"
              value={formData.staffInfo?.lectureSubjects || ''}
              onChange={(e) => updateNestedField('staffInfo', 'lectureSubjects', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="workStyle">働き方の特徴</label>
            <textarea
              id="workStyle"
              value={formData.staffInfo?.workStyle || ''}
              onChange={(e) => updateNestedField('staffInfo', 'workStyle', e.target.value)}
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="externalActivities">他機関での活動実績</label>
            <textarea
              id="externalActivities"
              value={formData.staffInfo?.externalActivities || ''}
              onChange={(e) => updateNestedField('staffInfo', 'externalActivities', e.target.value)}
              rows={2}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="qualificationsAndSkills">資格やスキル</label>
            <textarea
              id="qualificationsAndSkills"
              value={formData.staffInfo?.qualificationsAndSkills || ''}
              onChange={(e) =>
                updateNestedField('staffInfo', 'qualificationsAndSkills', e.target.value)
              }
              rows={2}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="internshipDetails">実習生受け入れ</label>
            <textarea
              id="internshipDetails"
              value={formData.staffInfo?.internshipDetails || ''}
              onChange={(e) => updateNestedField('staffInfo', 'internshipDetails', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </section>

      {/* 教育・進路支援セクション */}
      <section className={styles.formSection}>
        <h2>教育・進路支援</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="graduationRate">進学率と支援体制</label>
            <textarea
              id="graduationRate"
              value={formData.educationInfo?.graduationRate || ''}
              onChange={(e) => updateNestedField('educationInfo', 'graduationRate', e.target.value)}
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="learningSupport">学習支援の工夫や外部連携</label>
            <textarea
              id="learningSupport"
              value={formData.educationInfo?.learningSupport || ''}
              onChange={(e) =>
                updateNestedField('educationInfo', 'learningSupport', e.target.value)
              }
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="careerSupport">特化した進路支援内容</label>
            <textarea
              id="careerSupport"
              value={formData.educationInfo?.careerSupport || ''}
              onChange={(e) => updateNestedField('educationInfo', 'careerSupport', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* 高機能化・多機能化セクション */}
      <section className={styles.formSection}>
        <h2>高機能化・多機能化への取り組み</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="advancedTitle">タイトル</label>
            <input
              type="text"
              id="advancedTitle"
              value={formData.advancedInfo?.title || ''}
              onChange={(e) => updateNestedField('advancedInfo', 'title', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="advancedDescription">取り組み内容</label>
            <textarea
              id="advancedDescription"
              value={formData.advancedInfo?.description || ''}
              onChange={(e) => updateNestedField('advancedInfo', 'description', e.target.value)}
              rows={4}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="advancedBackground">経緯と背景</label>
            <textarea
              id="advancedBackground"
              value={formData.advancedInfo?.background || ''}
              onChange={(e) => updateNestedField('advancedInfo', 'background', e.target.value)}
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="advancedChallenges">苦労や課題</label>
            <textarea
              id="advancedChallenges"
              value={formData.advancedInfo?.challenges || ''}
              onChange={(e) => updateNestedField('advancedInfo', 'challenges', e.target.value)}
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="advancedSolutions">工夫や成功要因</label>
            <textarea
              id="advancedSolutions"
              value={formData.advancedInfo?.solutions || ''}
              onChange={(e) => updateNestedField('advancedInfo', 'solutions', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* その他情報セクション */}
      <section className={styles.formSection}>
        <h2>その他</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="otherTitle">タイトル</label>
            <input
              type="text"
              id="otherTitle"
              value={typeof formData.otherInfo === 'object' ? formData.otherInfo?.title || '' : ''}
              onChange={(e) => updateNestedField('otherInfo', 'title', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="otherDescription">説明</label>
            <textarea
              id="otherDescription"
              value={
                typeof formData.otherInfo === 'object'
                  ? formData.otherInfo?.description || ''
                  : typeof formData.otherInfo === 'string'
                    ? formData.otherInfo
                    : ''
              }
              onChange={(e) => updateNestedField('otherInfo', 'description', e.target.value)}
              rows={4}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="networks">他施設とのネットワーク</label>
            <textarea
              id="networks"
              value={
                typeof formData.otherInfo === 'object' ? formData.otherInfo?.networks || '' : ''
              }
              onChange={(e) => updateNestedField('otherInfo', 'networks', e.target.value)}
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="futureOutlook">今後の展望や課題</label>
            <textarea
              id="futureOutlook"
              value={
                typeof formData.otherInfo === 'object'
                  ? formData.otherInfo?.futureOutlook || ''
                  : ''
              }
              onChange={(e) => updateNestedField('otherInfo', 'futureOutlook', e.target.value)}
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="freeText">自由記述</label>
            <textarea
              id="freeText"
              value={
                typeof formData.otherInfo === 'object' ? formData.otherInfo?.freeText || '' : ''
              }
              onChange={(e) => updateNestedField('otherInfo', 'freeText', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* フッターアクション */}
      <footer className={styles.headerActions} style={{ justifyContent: 'flex-end' }}>
        <button
          type="button"
          className={styles.backButton}
          onClick={resetForm}
          disabled={!isDirty || isSaving}
        >
          変更をリセット
        </button>
        <button
          type="button"
          className={styles.saveButton}
          onClick={onSave}
          disabled={isSaving || !isDirty}
        >
          {isSaving ? '保存中...' : '保存する'}
        </button>
      </footer>
    </div>
  );
};
