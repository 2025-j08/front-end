CREATE TABLE public.facility_profiles (
    facility_id BIGINT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (facility_id, user_id),
    CONSTRAINT chk_valid_assignment CHECK (facility_id > 0)
);

-- RLSを有効化
ALTER TABLE public.facility_profiles ENABLE ROW LEVEL SECURITY;

-- ユーザーのみ閲覧可能
CREATE POLICY "select_owner"
    ON public.facility_profiles
    FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- 挿入は管理者のみ許可
CREATE POLICY "insert_admin_only"
    ON public.facility_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- 更新は管理者のみ許可
CREATE POLICY "update_admin_only"
    ON public.facility_profiles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- 削除は管理者のみ許可
CREATE POLICY "delete_admin_only"
    ON public.facility_profiles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- facility_id と user_id のインデックスを作成
CREATE INDEX idx_fp_facility_id ON public.facility_profiles(facility_id);
CREATE INDEX idx_fp_user_id ON public.facility_profiles(user_id);