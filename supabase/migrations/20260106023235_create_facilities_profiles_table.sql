CREATE TABLE public.facilities_profiles (
    facility_id BIGINT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (facility_id, user_id),
    CONSTRAINT chk_valid_assignment CHECK (facility_id > 0)
);

-- RLSを有効化
ALTER TABLE public.facilities_profiles ENABLE ROW LEVEL SECURITY;

-- ユーザー自身の施設割り当てのみ閲覧可能
CREATE POLICY "select_owner"
    ON public.facilities_profiles
    FOR SELECT
    USING (user_id = auth.uid());

-- サービスロールのみ書き込み可能
CREATE POLICY "insert_service_role"
    ON public.facilities_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "delete_service_role"
    ON public.facilities_profiles
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'service_role');

-- facility_id と user_id のインデックスを作成
CREATE INDEX idx_fp_facility_id ON public.facilities_profiles(facility_id);
CREATE INDEX idx_fp_user_id ON public.facilities_profiles(user_id);