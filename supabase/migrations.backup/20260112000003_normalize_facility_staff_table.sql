-- facility_staff テーブルを正規化
-- JSONBの data カラムから個別カラムへ移行

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_staff
ADD COLUMN full_time_staff_count INTEGER,
ADD COLUMN part_time_staff_count INTEGER,
ADD COLUMN specialties TEXT,
ADD COLUMN average_tenure TEXT,
ADD COLUMN age_distribution TEXT,
ADD COLUMN work_style TEXT,
ADD COLUMN has_university_lecturer BOOLEAN,
ADD COLUMN lecture_subjects TEXT,
ADD COLUMN external_activities TEXT,
ADD COLUMN qualifications_and_skills TEXT,
ADD COLUMN internship_details TEXT;

-- 2. 既存の data カラムから新しいカラムへデータを移行
UPDATE public.facility_staff
SET
  full_time_staff_count = CASE
    WHEN data->>'fullTimeStaffCount' IS NOT NULL THEN (data->>'fullTimeStaffCount')::INTEGER
    ELSE NULL
  END,
  part_time_staff_count = CASE
    WHEN data->>'partTimeStaffCount' IS NOT NULL THEN (data->>'partTimeStaffCount')::INTEGER
    ELSE NULL
  END,
  specialties = data->>'specialties',
  average_tenure = data->>'averageTenure',
  age_distribution = data->>'ageDistribution',
  work_style = data->>'workStyle',
  has_university_lecturer = CASE
    WHEN data->>'hasUniversityLecturer' IS NOT NULL THEN (data->>'hasUniversityLecturer')::BOOLEAN
    ELSE NULL
  END,
  lecture_subjects = data->>'lectureSubjects',
  external_activities = data->>'externalActivities',
  qualifications_and_skills = data->>'qualificationsAndSkills',
  internship_details = data->>'internshipDetails';

-- 3. data カラムを削除
ALTER TABLE public.facility_staff
DROP COLUMN data;

-- 4. チェック制約を削除（data カラムがなくなったため）
ALTER TABLE public.facility_staff
DROP CONSTRAINT IF EXISTS chk_staff_data_not_empty;

-- 5. チェック制約を追加
ALTER TABLE public.facility_staff
ADD CONSTRAINT chk_staff_full_time_staff_count_positive CHECK (full_time_staff_count > 0),
ADD CONSTRAINT chk_staff_part_time_staff_count_positive CHECK (part_time_staff_count >= 0);

-- 6. カラムコメントを追加
COMMENT ON COLUMN public.facility_staff.full_time_staff_count IS '常勤職員数';
COMMENT ON COLUMN public.facility_staff.part_time_staff_count IS '非常勤職員数';
COMMENT ON COLUMN public.facility_staff.specialties IS '職員の特徴・専門性';
COMMENT ON COLUMN public.facility_staff.average_tenure IS '平均勤続年数';
COMMENT ON COLUMN public.facility_staff.age_distribution IS '年齢層の傾向';
COMMENT ON COLUMN public.facility_staff.work_style IS '働き方の特徴（年休、有給平均、福利厚生等）';
COMMENT ON COLUMN public.facility_staff.has_university_lecturer IS '大学講義を担当している職員の有無';
COMMENT ON COLUMN public.facility_staff.lecture_subjects IS '担当している科目';
COMMENT ON COLUMN public.facility_staff.external_activities IS '他機関での活動実績（外部講演・講師）';
COMMENT ON COLUMN public.facility_staff.qualifications_and_skills IS '職員個人の資格やスキルで活かされているもの';
COMMENT ON COLUMN public.facility_staff.internship_details IS '実習生受け入れについて特筆的なこと';
