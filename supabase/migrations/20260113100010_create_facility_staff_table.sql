-- facility_staff テーブル
-- 職員情報を格納
CREATE TABLE public.facility_staff (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    full_time_staff_count INTEGER,
    part_time_staff_count INTEGER,
    specialties TEXT,
    average_tenure TEXT,
    age_distribution TEXT,
    work_style TEXT,
    has_university_lecturer BOOLEAN,
    lecture_subjects TEXT,
    external_activities TEXT,
    qualifications_and_skills TEXT,
    internship_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- チェック制約
    CONSTRAINT chk_staff_full_time_staff_count_positive CHECK (full_time_staff_count > 0),
    CONSTRAINT chk_staff_part_time_staff_count_positive CHECK (part_time_staff_count >= 0)
);

-- RLSを有効化
ALTER TABLE public.facility_staff ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facility_staff
    FOR SELECT
    USING (true);

-- 挿入は施設担当者または管理者のみ許可
CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_staff
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        -- 施設担当者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_staff.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 更新は施設担当者または管理者のみ許可
CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_staff
    FOR UPDATE
    TO authenticated
    USING (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        -- 施設担当者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_staff.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        -- 施設担当者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_staff.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 削除は管理者のみ許可
CREATE POLICY "delete_admin_only"
    ON public.facility_staff
    FOR DELETE
    TO authenticated
    USING (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- updated_at 自動更新トリガー
CREATE TRIGGER update_facility_staff_updated_at
    BEFORE UPDATE ON public.facility_staff
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- テーブルコメント
COMMENT ON TABLE public.facility_staff IS '施設の職員情報を格納するテーブル';
COMMENT ON COLUMN public.facility_staff.facility_id IS '施設ID (facilities テーブルへの外部キー)';
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
