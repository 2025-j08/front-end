import { StaffInfo } from '@/types/facility';

import { EditField } from './EditField';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';

export type StaffTabProps = TabProps<StaffInfo>;

/** hasUniversityLecturer の選択オプション */
const LECTURER_OPTIONS = [
  { value: '', label: '未設定' },
  { value: 'true', label: '有' },
  { value: 'false', label: '無' },
];

export const StaffTab = ({
  data: staffInfo,
  isEditMode = false,
  onFieldChange,
  errors = {},
  getError = () => undefined,
}: StaffTabProps) => {
  if (isEditMode) {
    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          <div className={styles.editRow}>
            <EditField
              type="number"
              id="fullTimeStaffCount"
              label="常勤職員数"
              value={staffInfo.fullTimeStaffCount}
              onChange={(v) => onFieldChange?.('fullTimeStaffCount', v)}
              placeholder="例:16"
              suffix="名"
              error={getError('staffInfo.fullTimeStaffCount')}
            />
            <EditField
              type="number"
              id="partTimeStaffCount"
              label="非常勤職員数"
              value={staffInfo.partTimeStaffCount}
              onChange={(v) => onFieldChange?.('partTimeStaffCount', v)}
              placeholder="例:5"
              suffix="名"
              error={getError('staffInfo.partTimeStaffCount')}
            />
          </div>
          <EditField
            type="textarea"
            id="specialties"
            label="職員の特徴・専門性"
            value={staffInfo.specialties}
            onChange={(v) => onFieldChange?.('specialties', v)}
            rows={3}
          />
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
            />
          </div>
          <EditField
            type="textarea"
            id="workStyle"
            label="働き方の特徴"
            value={staffInfo.workStyle}
            onChange={(v) => onFieldChange?.('workStyle', v)}
            rows={2}
          />
          <div className={styles.editRow}>
            <EditField
              type="select"
              id="hasUniversityLecturer"
              label="大学講義担当"
              value={
                staffInfo.hasUniversityLecturer === undefined
                  ? ''
                  : staffInfo.hasUniversityLecturer
                    ? 'true'
                    : 'false'
              }
              onChange={(v) =>
                onFieldChange?.('hasUniversityLecturer', v === '' ? undefined : v === 'true')
              }
              options={LECTURER_OPTIONS}
            />
            <EditField
              type="text"
              id="lectureSubjects"
              label="担当科目"
              value={staffInfo.lectureSubjects}
              onChange={(v) => onFieldChange?.('lectureSubjects', v)}
            />
          </div>
          <EditField
            type="textarea"
            id="externalActivities"
            label="他機関での活動実績"
            value={staffInfo.externalActivities}
            onChange={(v) => onFieldChange?.('externalActivities', v)}
            rows={2}
          />
          <EditField
            type="textarea"
            id="qualificationsAndSkills"
            label="資格やスキル"
            value={staffInfo.qualificationsAndSkills}
            onChange={(v) => onFieldChange?.('qualificationsAndSkills', v)}
            rows={2}
          />
          <EditField
            type="textarea"
            id="internshipDetails"
            label="実習生受け入れ"
            value={staffInfo.internshipDetails}
            onChange={(v) => onFieldChange?.('internshipDetails', v)}
            rows={2}
          />
        </div>
      </div>
    );
  }

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
            <p className={styles.textContent}>{staffInfo.staffCount || '-'}</p>
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
