CREATE TABLE public.facilities (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    corporation TEXT NOT NULL,
    established_year INTEGER NOT NULL CHECK (established_year BETWEEN 1800 AND date_part('year', now())),
    prefecture TEXT NOT NULL,
    city TEXT NOT NULL,
    address_detail TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facilities
    FOR SELECT
    USING (true);

-- 管理者のみ挿入可能（新規施設は担当者紐付け前のため）
CREATE POLICY "insert_admin_only"
    ON public.facilities
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- 管理者または担当施設の職員が更新可能
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

-- 管理者または担当施設の職員が削除可能
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

-- nameカラムのインデックスを作成
CREATE INDEX IF NOT EXISTS idx_facilities_name ON public.facilities (name);

-- updated_atカラムを自動更新するプロシージャ
CREATE OR REPLACE FUNCTION public.update_facilities_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
-- 意図しないスキーマの参照防止
SET search_path = ''

AS $$
BEGIN
    new.updated_at = now();
    RETURN new;
END;
$$;

-- 更新処理に際してプロシージャを呼び出すトリガー
CREATE TRIGGER update_facilities
    BEFORE UPDATE ON public.facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_facilities_timestamp();