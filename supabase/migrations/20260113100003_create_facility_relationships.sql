-- =============================================================================
-- 004: 施設関連テーブル（リレーションシップ）
-- =============================================================================
-- - facility_profiles: 施設とユーザーの紐づけ
-- - invitations: 施設担当者の招待情報
-- - facility_types: 施設種類マスタ（大舎・中舎・小舎等）
-- - facility_facility_types: 施設と施設種類の中間テーブル
-- =============================================================================

-- -----------------------------------------------------------------------------
-- facility_profiles テーブル
-- 施設とユーザーの紐づけを管理
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_profiles (
    facility_id BIGINT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (facility_id, user_id),
    CONSTRAINT chk_valid_assignment CHECK (facility_id > 0)
);

ALTER TABLE public.facility_profiles ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX idx_fp_facility_id ON public.facility_profiles(facility_id);
CREATE INDEX idx_fp_user_id ON public.facility_profiles(user_id);

-- -----------------------------------------------------------------------------
-- invitations テーブル
-- 施設担当者の招待情報を管理
-- -----------------------------------------------------------------------------
CREATE TABLE public.invitations (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    facility_id BIGINT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '3 days'),
    -- 1施設1ユーザ想定なのでfacility_idは主キー設定しない
    PRIMARY KEY (user_id)
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invitations_select_self" ON public.invitations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "invitations_insert_policy" ON public.invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "invitations_update_policy" ON public.invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "invitations_delete_policy" ON public.invitations
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- -----------------------------------------------------------------------------
-- facility_types テーブル
-- 施設種類（大舎・中舎・小舎等）を管理
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT facility_types_name_unique UNIQUE (name)
);

ALTER TABLE public.facility_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_types
    FOR SELECT
    USING (true);

CREATE POLICY "insert_admin_only"
    ON public.facility_types
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "update_admin_only"
    ON public.facility_types
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "delete_admin_only"
    ON public.facility_types
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE TRIGGER update_facility_types_updated_at
    BEFORE UPDATE ON public.facility_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON CONSTRAINT facility_types_name_unique ON public.facility_types IS '施設種類名の重複を防ぐ UNIQUE 制約';

-- -----------------------------------------------------------------------------
-- facility_facility_types テーブル
-- 施設と施設種類(大舎・中舎・小舎等)の紐づけを管理する中間テーブル
-- 将来的に1施設が複数の種類を持つ可能性に対応
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_facility_types (
    facility_id BIGINT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    facility_type_id BIGINT NOT NULL REFERENCES public.facility_types(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (facility_id, facility_type_id),
    CONSTRAINT chk_valid_ids CHECK (facility_id > 0 AND facility_type_id > 0)
);

ALTER TABLE public.facility_facility_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_facility_types
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_facility_types
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_facility_types.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 更新は不要(削除して再挿入で対応)のため、更新ポリシーは作成しない

CREATE POLICY "delete_facility_owner_or_admin"
    ON public.facility_facility_types
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_facility_types.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE INDEX idx_fft_facility_id ON public.facility_facility_types(facility_id);
CREATE INDEX idx_fft_facility_type_id ON public.facility_facility_types(facility_type_id);

COMMENT ON TABLE public.facility_facility_types IS '施設と施設種類の紐づけを管理する中間テーブル。大舎・中舎・小舎・グループホーム・地域小規模等の種類を管理。';
COMMENT ON COLUMN public.facility_facility_types.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_facility_types.facility_type_id IS '施設種類ID (facility_types テーブルへの外部キー)';

-- -----------------------------------------------------------------------------
-- facilities テーブルへの追加ポリシー
-- facility_profiles テーブル作成後に追加
-- -----------------------------------------------------------------------------
CREATE POLICY "update_admin_or_facility_staff"
    ON public.facilities
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.user_id = auth.uid() AND fp.facility_id = id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.user_id = auth.uid() AND fp.facility_id = id
        )
    );

CREATE POLICY "delete_admin_or_facility_staff"
    ON public.facilities
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.user_id = auth.uid() AND fp.facility_id = id
        )
    );
