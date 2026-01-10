CREATE TABLE public.facility_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
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

-- updated_atカラムを自動更新する汎用プロシージャ
-- 他テーブルでも再利用できるよう汎用名に統一
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 更新処理に際してプロシージャを呼び出すトリガー
CREATE TRIGGER update_facility_types
    BEFORE UPDATE ON public.facility_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

