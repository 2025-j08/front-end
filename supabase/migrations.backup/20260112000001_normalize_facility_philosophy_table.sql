-- facility_philosophy テーブルを正規化
-- JSONBの data カラムから個別カラムへ移行

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_philosophy
ADD COLUMN description TEXT;

-- 2. 既存の data カラムから新しいカラムへデータを移行
UPDATE public.facility_philosophy
SET description = data->>'description';

-- 3. data カラムを削除
ALTER TABLE public.facility_philosophy
DROP COLUMN data;

-- 4. NOT NULL 制約を追加（必須フィールド）
ALTER TABLE public.facility_philosophy
ALTER COLUMN description SET NOT NULL;

-- 5. チェック制約を削除（data カラムがなくなったため）
ALTER TABLE public.facility_philosophy
DROP CONSTRAINT IF EXISTS chk_philosophy_data_not_empty;

-- 6. カラムコメントを追加
COMMENT ON COLUMN public.facility_philosophy.description IS '日々の支援の中で重視している視点・理念';
