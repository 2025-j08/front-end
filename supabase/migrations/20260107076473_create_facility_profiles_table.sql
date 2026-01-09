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

-- 本人または管理者が挿入可能
CREATE POLICY "insert_owner_or_admin"
    ON public.facility_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- 本人または管理者が更新可能
CREATE POLICY "update_owner_or_admin"
    ON public.facility_profiles
    FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    )
    WITH CHECK (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- 本人または管理者が削除可能
CREATE POLICY "delete_owner_or_admin"
    ON public.facility_profiles
    FOR DELETE
    TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- facility_id と user_id のインデックスを作成
CREATE INDEX idx_fp_facility_id ON public.facility_profiles(facility_id);
CREATE INDEX idx_fp_user_id ON public.facility_profiles(user_id);