-- 不要なカラムを削除するマイグレーション

-- facility_access テーブルから station カラムを削除
-- インデックスも自動的に削除される
DROP INDEX IF EXISTS idx_facility_access_station;
ALTER TABLE public.facility_access DROP COLUMN IF EXISTS station;

-- facility_advanced テーブルから title カラムを削除
ALTER TABLE public.facility_advanced DROP COLUMN IF EXISTS title;

-- コメント更新
COMMENT ON COLUMN public.facility_access.description IS '交通アクセス';
