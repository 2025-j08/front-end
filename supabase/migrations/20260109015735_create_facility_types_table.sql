CREATE TABLE public.facility_types (
    facility_id BIGINT NOT NULL PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    large_unit BOOLEAN NOT NULL DEFAULT FALSE,
    medium_unit BOOLEAN NOT NULL DEFAULT FALSE,
    small_unit BOOLEAN NOT NULL DEFAULT FALSE,
    group_home BOOLEAN NOT NULL DEFAULT FALSE,
    small_scale_unit BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE public.facility_types ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facility_types
    FOR SELECT
    USING (true);

-- 管理者または施設担当者が挿入可能
CREATE POLICY "insert_admin_or_facility_staff"
    ON public.facility_types
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles
            WHERE facility_profiles.user_id = auth.uid()
            AND facility_profiles.facility_id = facility_id
        )
    );

-- 管理者または施設担当者が更新可能
CREATE POLICY "update_admin_or_facility_staff"
    ON public.facility_types
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles
            WHERE facility_profiles.user_id = auth.uid()
            AND facility_profiles.facility_id = facility_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles
            WHERE facility_profiles.user_id = auth.uid()
            AND facility_profiles.facility_id = facility_id
        )
    );

-- 管理者または施設担当者が削除可能
CREATE POLICY "delete_admin_or_facility_staff"
    ON public.facility_types
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles
            WHERE facility_profiles.user_id = auth.uid()
            AND facility_profiles.facility_id = facility_id
        )
    );

-- facility_idのインデックスを作成（既にPKで作成されているが、明示的に記載）
-- CREATE INDEX IF NOT EXISTS idx_facility_types_facility_id ON public.facility_types (facility_id);

-- updated_atカラムを自動更新するプロシージャ
CREATE OR REPLACE FUNCTION public.update_facility_types_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 更新処理に際してプロシージャを呼び出すトリガー
CREATE TRIGGER update_facility_types
    BEFORE UPDATE ON public.facility_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_facility_types_timestamp();

