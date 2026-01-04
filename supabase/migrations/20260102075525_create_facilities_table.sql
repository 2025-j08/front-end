CREATE TABLE IF NOT EXISTS public.facilities (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLSを有効化
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- 閲覧ユーザのポリシーを作成
CREATE POLICY "select_public"
    ON public.facilities
    FOR SELECT
    USING (true);

-- 認証済みユーザのポリシーを作成
CREATE POLICY "insert_authenticated"
    ON public.facilities
    FOR INSERT
    TO AUTHENTICATED
    WITH CHECK (true);

-- nameカラムのインデックスを作成
CREATE INDEX IF NOT EXISTS idx_facilities_name ON public.facilities (name);

-- updated_atカラムを自動更新するプロシージャ
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = now();
    return new;
END;
$$ language plpgsql;

-- 更新処理に際してプロシージャを呼び出すトリガー
CREATE TRIGGER update_facilities
    BEFORE UPDATE ON public.facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();