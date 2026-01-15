import { StaffInfo } from '@/types/facility';

import { EditField } from './EditField';
import { EditSection } from './EditSection';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type StaffTabProps = TabProps<StaffInfo>;

export const StaffTab = ({
  data: staffInfo,
  isEditMode = false,
  onFieldChange,
  onSave,
  isSaving = false,
  isDirty = false,
  getError = () => undefined,
}: StaffTabProps) => {
  /**
   * 編集モード表示 - 表示画面と同じセクション構造で明示的に記述
   */
  if (isEditMode) {
    return (
      <>
        <div className={styles.tabContentWrapper}>
          <div className={styles.textSection}>
            {/* 職員数セクション */}
            <EditSection title="職員数">
              <div className={styles.editRow}>
                <EditField
                  type="number"
                  id="fullTimeStaffCount"
                  label="常勤職員数"
                  value={staffInfo.fullTimeStaffCount}
                  onChange={(v) => onFieldChange?.('fullTimeStaffCount', v)}
                  suffix="名"
                  placeholder="例:16"
                  error={getError('staffInfo.fullTimeStaffCount')}
                />
                <EditField
                  type="number"
                  id="partTimeStaffCount"
                  label="非常勤職員数"
                  value={staffInfo.partTimeStaffCount}
                  onChange={(v) => onFieldChange?.('partTimeStaffCount', v)}
                  suffix="名"
                  placeholder="例:5"
                  error={getError('staffInfo.partTimeStaffCount')}
                />
              </div>
            </EditSection>

            {/* 職員の特徴・専門性 */}
            <EditSection title="職員の特徴・専門性">
              <EditField
                type="textarea"
                id="specialties"
                label="特徴・専門性"
                value={staffInfo.specialties}
                onChange={(v) => onFieldChange?.('specialties', v)}
                rows={3}
                error={getError('staffInfo.specialties')}
              />
            </EditSection>

            {/* 平均勤続年数・年齢層の傾向 */}
            <EditSection title="平均勤続年数・年齢層の傾向">
              <div className={styles.editRow}>
                <EditField
                  type="text"
                  id="averageTenure"
                  label="平均勤続年数"
                  value={staffInfo.averageTenure}
                  onChange={(v) => onFieldChange?.('averageTenure', v)}
                  placeholder="例: 8.5年"
                  error={getError('staffInfo.averageTenure')}
                />
                <EditField
                  type="text"
                  id="ageDistribution"
                  label="年齢層の傾向"
                  value={staffInfo.ageDistribution}
                  onChange={(v) => onFieldChange?.('ageDistribution', v)}
                  error={getError('staffInfo.ageDistribution')}
                />
              </div>
            </EditSection>

            {/* 働き方の特徴 */}
            <EditSection title="働き方の特徴">
              <EditField
                type="textarea"
                id="workStyle"
                label="働き方の特徴"
                value={staffInfo.workStyle}
                onChange={(v) => onFieldChange?.('workStyle', v)}
                rows={2}
                error={getError('staffInfo.workStyle')}
              />
            </EditSection>

            {/* 大学講義を担当している職員 */}
            <EditSection title="大学講義を担当している職員">
              <div className={styles.editRow}>
                <EditField
                  type="select"
                  id="hasUniversityLecturer"
                  label="担当状況"
                  value={
                    staffInfo.hasUniversityLecturer === undefined
                      ? ''
                      : staffInfo.hasUniversityLecturer
                        ? 'true'
                        : 'false'
                  }
                  onChange={(v) => {
                    const boolValue = v === '' ? undefined : v === 'true';
                    onFieldChange?.('hasUniversityLecturer', boolValue);
                  }}
                  options={[
                    { value: '', label: '未設定' },
                    { value: 'true', label: '有' },
                    { value: 'false', label: '無' },
                  ]}
                  error={getError('staffInfo.hasUniversityLecturer')}
                />
                <EditField
                  type="text"
                  id="lectureSubjects"
                  label="担当科目"
                  value={staffInfo.lectureSubjects}
                  onChange={(v) => onFieldChange?.('lectureSubjects', v)}
                  error={getError('staffInfo.lectureSubjects')}
                />
              </div>
            </EditSection>

            {/* 他機関での活動実績 */}
            <EditSection title="他機関での活動実績（外部講演・講師）">
              <EditField
                type="textarea"
                id="externalActivities"
                label="活動実績"
                value={staffInfo.externalActivities}
                onChange={(v) => onFieldChange?.('externalActivities', v)}
                rows={2}
                error={getError('staffInfo.externalActivities')}
              />
            </EditSection>

            {/* 職員個人の資格やスキル */}
            <EditSection title="職員個人の資格やスキルで活かされているもの">
              <EditField
                type="textarea"
                id="qualificationsAndSkills"
                label="資格やスキル"
                value={staffInfo.qualificationsAndSkills}
                onChange={(v) => onFieldChange?.('qualificationsAndSkills', v)}
                rows={2}
                error={getError('staffInfo.qualificationsAndSkills')}
              />
            </EditSection>

            {/* 実習生受け入れ */}
            <EditSection title="実習生受け入れについて特筆的なこと">
              <EditField
                type="textarea"
                id="internshipDetails"
                label="実習生受け入れ"
                value={staffInfo.internshipDetails}
                onChange={(v) => onFieldChange?.('internshipDetails', v)}
                rows={2}
                error={getError('staffInfo.internshipDetails')}
              />
            </EditSection>
          </div>
        </div>
      </>
    );
  }

  /**
   * 表示モード
   */
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection title="職員数">
          {staffInfo.fullTimeStaffCount !== undefined ||
          staffInfo.partTimeStaffCount !== undefined ? (
            <div className={styles.staffCountGrid}>
              {staffInfo.fullTimeStaffCount !== undefined && (
                <div className={styles.staffCountItem}>
                  <span className={styles.staffCountLabel}>常勤</span>
                  <span className={styles.staffCountValue}>{staffInfo.fullTimeStaffCount}名</span>
                </div>
              )}
              {staffInfo.partTimeStaffCount !== undefined && (
                <div className={styles.staffCountItem}>
                  <span className={styles.staffCountLabel}>非常勤</span>
                  <span className={styles.staffCountValue}>{staffInfo.partTimeStaffCount}名</span>
                </div>
              )}
            </div>
          ) : (
            <p className={styles.textContent}>-</p>
          )}
        </TabSection>

        <TabSection title="職員の特徴・専門性" content={staffInfo.specialties} />

        <TabSection title="平均勤続年数・年齢層の傾向">
          <p className={styles.textContent}>
            {staffInfo.averageTenure && (
              <>
                平均勤続年数：{staffInfo.averageTenure}
                <br />
              </>
            )}
            {staffInfo.ageDistribution && <>年齢層：{staffInfo.ageDistribution}</>}
            {!staffInfo.averageTenure && !staffInfo.ageDistribution && '-'}
          </p>
        </TabSection>

        <TabSection title="働き方の特徴" content={staffInfo.workStyle} />

        <TabSection title="大学講義を担当している職員">
          <p className={styles.textContent}>
            {staffInfo.hasUniversityLecturer !== undefined
              ? staffInfo.hasUniversityLecturer
                ? '有'
                : '無'
              : '-'}
            {staffInfo.lectureSubjects && (
              <>
                <br />
                科目：{staffInfo.lectureSubjects}
              </>
            )}
          </p>
        </TabSection>

        <TabSection
          title="他機関での活動実績（外部講演・講師）"
          content={staffInfo.externalActivities}
        />

        <TabSection
          title="職員個人の資格やスキルで活かされているもの"
          content={staffInfo.qualificationsAndSkills}
        />

        <TabSection
          title="実習生受け入れについて特筆的なこと"
          content={staffInfo.internshipDetails}
        />
      </div>
    </div>
  );
};
