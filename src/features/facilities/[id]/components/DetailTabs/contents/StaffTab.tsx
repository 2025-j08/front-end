import { StaffInfo } from '@/types/facility';

import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

type StaffTabProps = {
  staffInfo: StaffInfo;
};

export const StaffTab = ({ staffInfo }: StaffTabProps) => {
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
