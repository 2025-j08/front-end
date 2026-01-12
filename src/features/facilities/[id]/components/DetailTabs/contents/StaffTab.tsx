import { StaffInfo } from '@/types/facility';

import { EditField } from './EditField';
import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';
import { TabProps } from '../types/tabProps';
import { STAFF_FIELDS } from './staffFieldsConfig';

export type StaffTabProps = TabProps<StaffInfo>;

export const StaffTab = ({
  data: staffInfo,
  isEditMode = false,
  onFieldChange,
  errors = {},
  getError = () => undefined,
}: StaffTabProps) => {
  /**
   * フィールド値を取得（hasUniversityLecturerの特殊処理含む）
   */
  const getFieldValue = (fieldId: keyof StaffInfo): string | number | undefined => {
    const value = staffInfo[fieldId];

    // hasUniversityLecturer は boolean → string 変換が必要
    if (fieldId === 'hasUniversityLecturer') {
      return value === undefined ? '' : value ? 'true' : 'false';
    }

    return value as string | number | undefined;
  };

  /**
   * フィールド変更ハンドラー（hasUniversityLecturerの特殊処理含む）
   */
  const handleFieldChange = (fieldId: keyof StaffInfo, value: unknown) => {
    // hasUniversityLecturer は string → boolean 変換が必要
    if (fieldId === 'hasUniversityLecturer') {
      const boolValue = value === '' ? undefined : value === 'true';
      onFieldChange?.(fieldId, boolValue);
      return;
    }

    onFieldChange?.(fieldId, value);
  };

  /**
   * メタデータからEditFieldのpropsを生成
   */
  const renderEditField = (field: (typeof STAFF_FIELDS)[number]) => {
    const baseProps = {
      key: field.id,
      id: field.id,
      label: field.label,
      error: getError(`staffInfo.${field.id}`),
    };

    switch (field.type) {
      case 'text':
        return (
          <EditField
            {...baseProps}
            type="text"
            value={getFieldValue(field.id) as string | undefined}
            onChange={(v: string) => handleFieldChange(field.id, v)}
            placeholder={field.placeholder}
          />
        );

      case 'number':
        return (
          <EditField
            {...baseProps}
            type="number"
            value={getFieldValue(field.id) as number | undefined}
            onChange={(v: number | undefined) => handleFieldChange(field.id, v)}
            placeholder={field.placeholder}
            suffix={field.suffix}
          />
        );

      case 'textarea':
        return (
          <EditField
            {...baseProps}
            type="textarea"
            value={getFieldValue(field.id) as string | undefined}
            onChange={(v: string) => handleFieldChange(field.id, v)}
            rows={field.rows}
          />
        );

      case 'select':
        return (
          <EditField
            {...baseProps}
            type="select"
            value={getFieldValue(field.id) as string | undefined}
            onChange={(v: string | undefined) => handleFieldChange(field.id, v)}
            options={field.options}
          />
        );
    }
  };

  /**
   * 編集モード表示
   */
  if (isEditMode) {
    // rowGroup でフィールドをグループ化
    const groupedFields = STAFF_FIELDS.reduce(
      (acc, field) => {
        const group = field.rowGroup || 0;
        if (!acc[group]) acc[group] = [];
        acc[group].push(field);
        return acc;
      },
      {} as Record<number, (typeof STAFF_FIELDS)[number][]>,
    );

    return (
      <div className={styles.tabContentWrapper}>
        <div className={styles.textSection}>
          {Object.entries(groupedFields).map(([groupId, fields]) => {
            const isRow = fields.length > 1;
            const containerClass = isRow ? styles.editRow : '';

            return (
              <div key={groupId} className={containerClass}>
                {fields.map((field) => renderEditField(field))}
              </div>
            );
          })}
        </div>
      </div>
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
