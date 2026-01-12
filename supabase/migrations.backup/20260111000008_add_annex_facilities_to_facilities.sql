-- facilities テーブルに併設施設カラムを追加
-- 併設施設情報を JSONB 配列として格納
-- 例: [{"name": "ショートステイ", "type": "短期入所"}, ...]

ALTER TABLE public.facilities
ADD COLUMN annex_facilities JSONB DEFAULT '[]'::jsonb NOT NULL;

-- JSONB データに対する GIN インデックス（検索性能向上のため）
CREATE INDEX idx_facilities_annex_facilities_gin ON public.facilities USING gin(annex_facilities);

-- カラムコメント
COMMENT ON COLUMN public.facilities.annex_facilities IS '併設施設情報を格納する JSONB 配列。各要素は {name: string, type: string} の形式';

-- データの妥当性チェック（配列型であることを確認）
ALTER TABLE public.facilities
ADD CONSTRAINT chk_annex_facilities_is_array
CHECK (jsonb_typeof(annex_facilities) = 'array');
