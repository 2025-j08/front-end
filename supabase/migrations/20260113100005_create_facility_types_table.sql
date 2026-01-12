-- facility_types テーブル
-- 施設種類（大舎・中舎・小舎等）を管理
CREATE TABLE public.facility_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- 施設種類名の重複を防ぐ UNIQUE 制約
    CONSTRAINT facility_types_name_unique UNIQUE (name)
);

-- RLSを有効化
ALTER TABLE public.facility_types ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facility_types
    FOR SELECT
    USING (true);

-- 管理者のみが挿入可能
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

-- 管理者のみが更新可能
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

-- 管理者のみが削除可能
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

-- updated_at 自動更新（汎用関数を使用）
CREATE TRIGGER update_facility_types_updated_at
    BEFORE UPDATE ON public.facility_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 制約コメント
COMMENT ON CONSTRAINT facility_types_name_unique ON public.facility_types IS '施設種類名の重複を防ぐ UNIQUE 制約';
