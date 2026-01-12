-- facility_advanced テーブルを正規化
-- JSONBの data カラムから個別カラムへ移行

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_advanced
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN background TEXT,
ADD COLUMN challenges TEXT,
ADD COLUMN solutions TEXT;

-- 2. 既存の data カラムから新しいカラムへデータを移行
UPDATE public.facility_advanced
SET
  title = data->>'title',
  description = data->>'description',
  background = data->>'background',
  challenges = data->>'challenges',
  solutions = data->>'solutions';

-- 3. data カラムを削除
ALTER TABLE public.facility_advanced
DROP COLUMN data;

-- 4. NOT NULL 制約を追加（必須フィールド）
ALTER TABLE public.facility_advanced
ALTER COLUMN description SET NOT NULL;

-- 5. チェック制約を削除（data カラムがなくなったため）
ALTER TABLE public.facility_advanced
DROP CONSTRAINT IF EXISTS chk_advanced_data_not_empty;

-- 6. カラムコメントを追加
COMMENT ON COLUMN public.facility_advanced.title IS 'タイトル';
COMMENT ON COLUMN public.facility_advanced.description IS '実施している多機能化の取り組み';
COMMENT ON COLUMN public.facility_advanced.background IS '経緯と背景';
COMMENT ON COLUMN public.facility_advanced.challenges IS '取り組みにあたっての苦労や課題';
COMMENT ON COLUMN public.facility_advanced.solutions IS '工夫や成功要因・乗り越えた方法';
