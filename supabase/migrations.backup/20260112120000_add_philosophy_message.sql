-- facility_philosophy テーブルに message カラムを追加
-- 理念メッセージを格納するフィールド

-- 1. message カラムを追加（オプショナル）
ALTER TABLE public.facility_philosophy
ADD COLUMN message TEXT;

-- 2. カラムコメントを追加
COMMENT ON COLUMN public.facility_philosophy.message IS '理念メッセージ';
