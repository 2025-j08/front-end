CREATE TABLE public.facilities (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    corporation TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT NOT NULL,
    prefecture TEXT NOT NULL,
    city TEXT NOT NULL,
    address_detail TEXT NOT NULL,
    established_year INTEGER NOT NULL CHECK (established_year BETWEEN 1800 AND date_part('year', now())),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLSを有効化
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facilities
    FOR SELECT
    USING (true);

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
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 更新処理に際してプロシージャを呼び出すトリガー
CREATE TRIGGER update_facilities
    BEFORE UPDATE ON public.facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_facilities_timestamp();