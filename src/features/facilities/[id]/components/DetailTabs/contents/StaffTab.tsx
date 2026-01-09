import { StaffInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

export type StaffTabProps = {
  staffInfo: StaffInfo;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: unknown) => void;
};

export const StaffTab = ({ staffInfo, isEditMode = false, onFieldChange }: StaffTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <div className={styles.editGroup}>
            <label htmlFor="staffCount" className={styles.editLabel}>
              職員数
            </label>
            <input
              type="text"
              id="staffCount"
              className={styles.editInput}
              value={staffInfo.staffCount || ''}
              onChange={(e) => onFieldChange?.('staffCount', e.target.value)}
              placeholder="例: 常勤16名、非常勤6名"
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="specialties" className={styles.editLabel}>
              職員の特徴・専門性
            </label>
            <textarea
              id="specialties"
              className={styles.editTextarea}
              value={staffInfo.specialties || ''}
              onChange={(e) => onFieldChange?.('specialties', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.editRow}>
            <div className={styles.editGroup}>
              <label htmlFor="averageTenure" className={styles.editLabel}>
                平均勤続年数
              </label>
              <input
                type="text"
                id="averageTenure"
                className={styles.editInput}
                value={staffInfo.averageTenure || ''}
                onChange={(e) => onFieldChange?.('averageTenure', e.target.value)}
                placeholder="例: 6年"
              />
            </div>
            <div className={styles.editGroup}>
              <label htmlFor="ageDistribution" className={styles.editLabel}>
                年齢層の傾向
              </label>
              <input
                type="text"
                id="ageDistribution"
                className={styles.editInput}
                value={staffInfo.ageDistribution || ''}
                onChange={(e) => onFieldChange?.('ageDistribution', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="workStyle" className={styles.editLabel}>
              働き方の特徴
            </label>
            <textarea
              id="workStyle"
              className={styles.editTextarea}
              value={staffInfo.workStyle || ''}
              onChange={(e) => onFieldChange?.('workStyle', e.target.value)}
              rows={2}
            />
          </div>

          <div className={styles.editRow}>
            <div className={styles.editGroup}>
              <label htmlFor="hasUniversityLecturer" className={styles.editLabel}>
                大学講義担当
              </label>
              <select
                id="hasUniversityLecturer"
                className={styles.editInput}
                value={
                  staffInfo.hasUniversityLecturer === undefined
                    ? ''
                    : staffInfo.hasUniversityLecturer
                      ? 'true'
                      : 'false'
                }
                onChange={(e) =>
                  onFieldChange?.(
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
            <div className={styles.editGroup}>
              <label htmlFor="lectureSubjects" className={styles.editLabel}>
                担当科目
              </label>
              <input
                type="text"
                id="lectureSubjects"
                className={styles.editInput}
                value={staffInfo.lectureSubjects || ''}
                onChange={(e) => onFieldChange?.('lectureSubjects', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="externalActivities" className={styles.editLabel}>
              他機関での活動実績
            </label>
            <textarea
              id="externalActivities"
              className={styles.editTextarea}
              value={staffInfo.externalActivities || ''}
              onChange={(e) => onFieldChange?.('externalActivities', e.target.value)}
              rows={2}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="qualificationsAndSkills" className={styles.editLabel}>
              資格やスキル
            </label>
            <textarea
              id="qualificationsAndSkills"
              className={styles.editTextarea}
              value={staffInfo.qualificationsAndSkills || ''}
              onChange={(e) => onFieldChange?.('qualificationsAndSkills', e.target.value)}
              rows={2}
            />
          </div>

          <div className={styles.editGroup}>
            <label htmlFor="internshipDetails" className={styles.editLabel}>
              実習生受け入れ
            </label>
            <textarea
              id="internshipDetails"
              className={styles.editTextarea}
              value={staffInfo.internshipDetails || ''}
              onChange={(e) => onFieldChange?.('internshipDetails', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection title="職員数" content={staffInfo.staffCount} />

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
