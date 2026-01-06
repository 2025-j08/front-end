CREATE TABLE public.facilities (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    kind TEXT NOT NULL,
    corporation TEXT NOT NULL,
    established_year INTEGER NOT NULL CHECK (established_year BETWEEN 1800 AND date_part('year', now())),
    capacity INTEGER NOT NULL CHECK (capacity >= 0),
    address TEXT NOT NULL,
    has_annex BOOLEAN NOT NULL,
    annex_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT annex_consistency CHECK (
        (has_annex = false AND annex_name IS NULL)
        OR (has_annex = true AND annex_name IS NOT NULL)
    )
);

-- RLSを有効化
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- 閲覧ユーザのポリシーを作成
CREATE POLICY "select_public"
    ON public.facilities
    FOR SELECT
    USING (true);

-- サービスロールのみ書き込み可能にするポリシーを作成
CREATE POLICY "insert_service_role"
    ON public.facilities
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "update_service_role"
    ON public.facilities
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "delete_service_role"
    ON public.facilities
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'service_role');

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
    return new;
END;
$$;

-- 更新処理に際してプロシージャを呼び出すトリガー
CREATE TRIGGER update_facilities
    BEFORE UPDATE ON public.facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_facilities_timestamp();