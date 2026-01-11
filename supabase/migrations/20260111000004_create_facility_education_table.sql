-- facility_education テーブル
-- 教育・進路支援情報を格納
CREATE TABLE public.facility_education (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- データの妥当性チェック
    CONSTRAINT chk_education_data_not_empty CHECK (jsonb_typeof(data) = 'object' AND data != '{}'::jsonb)
);

-- RLSを有効化
ALTER TABLE public.facility_education ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facility_education
    FOR SELECT
    USING (true);

-- 挿入は施設担当者または管理者のみ許可
CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_education
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
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_education.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 更新は施設担当者または管理者のみ許可
CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_education
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
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_education.facility_id
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
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_education.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 削除は管理者のみ許可
CREATE POLICY "delete_admin_only"
    ON public.facility_education
    FOR DELETE
    TO authenticated
    USING (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- JSONB データに対する GIN インデックス
CREATE INDEX idx_facility_education_data_gin ON public.facility_education USING gin(data);

-- updated_at 自動更新トリガー
CREATE TRIGGER update_facility_education_updated_at
    BEFORE UPDATE ON public.facility_education
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- テーブルコメント
COMMENT ON TABLE public.facility_education IS '施設の教育・進路支援情報を格納するテーブル';
COMMENT ON COLUMN public.facility_education.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_education.data IS '教育・進路支援情報を含む JSONB データ';
