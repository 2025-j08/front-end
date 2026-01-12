-- facility_facility_types テーブル
-- 施設と施設種類(大舎・中舎・小舎等)の紐づけを管理する中間テーブル
-- 将来的に1施設が複数の種類を持つ可能性に対応
CREATE TABLE public.facility_facility_types (
    facility_id BIGINT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    facility_type_id BIGINT NOT NULL REFERENCES public.facility_types(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- 1施設に同じ種類を重複登録できないように複合主キーで制約
    PRIMARY KEY (facility_id, facility_type_id),

    -- IDが正の整数であることを保証
    CONSTRAINT chk_valid_ids CHECK (facility_id > 0 AND facility_type_id > 0)
);

-- RLSを有効化
ALTER TABLE public.facility_facility_types ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facility_facility_types
    FOR SELECT
    USING (true);

-- 挿入は施設担当者または管理者のみ許可
CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_facility_types
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
            WHERE fp.facility_id = facility_facility_types.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 更新は不要(削除して再挿入で対応)のため、更新ポリシーは作成しない

-- 削除は施設担当者または管理者のみ許可
CREATE POLICY "delete_facility_owner_or_admin"
    ON public.facility_facility_types
    FOR DELETE
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
            WHERE fp.facility_id = facility_facility_types.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- facility_id のインデックス (JOINで頻繁に使用されるため)
CREATE INDEX idx_fft_facility_id ON public.facility_facility_types(facility_id);

-- facility_type_id のインデックス (種類別の検索に使用)
CREATE INDEX idx_fft_facility_type_id ON public.facility_facility_types(facility_type_id);

-- テーブルコメント
COMMENT ON TABLE public.facility_facility_types IS '施設と施設種類の紐づけを管理する中間テーブル。大舎・中舎・小舎・グループホーム・地域小規模等の種類を管理。';
COMMENT ON COLUMN public.facility_facility_types.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_facility_types.facility_type_id IS '施設種類ID (facility_types テーブルへの外部キー)';
