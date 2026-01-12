-- facility_other テーブルを正規化
-- JSONBの data カラムから個別カラムへ移行

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_other
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN networks TEXT,
ADD COLUMN future_outlook TEXT,
ADD COLUMN free_text TEXT;

-- 2. 既存の data カラムから新しいカラムへデータを移行
UPDATE public.facility_other
SET
  title = data->>'title',
  description = data->>'description',
  networks = data->>'networks',
  future_outlook = data->>'futureOutlook',
  free_text = data->>'freeText';

-- 3. data カラムを削除
ALTER TABLE public.facility_other
DROP COLUMN data;

-- 4. チェック制約を削除（data カラムがなくなったため）
ALTER TABLE public.facility_other
DROP CONSTRAINT IF EXISTS chk_other_data_not_empty;

-- 5. カラムコメントを追加
COMMENT ON COLUMN public.facility_other.title IS 'タイトル';
COMMENT ON COLUMN public.facility_other.description IS '説明・その他情報';
COMMENT ON COLUMN public.facility_other.networks IS '他施設とのネットワークや共同プロジェクト';
COMMENT ON COLUMN public.facility_other.future_outlook IS '今後の展望や課題';
COMMENT ON COLUMN public.facility_other.free_text IS '自由記述欄';
