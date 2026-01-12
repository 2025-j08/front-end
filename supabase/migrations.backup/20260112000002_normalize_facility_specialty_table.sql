-- facility_specialty テーブルを正規化
-- JSONBの data カラムから個別カラムへ移行

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_specialty
ADD COLUMN features TEXT[],
ADD COLUMN programs TEXT;

-- 2. 既存の data カラムから新しいカラムへデータを移行
UPDATE public.facility_specialty
SET
  features = CASE
    WHEN jsonb_typeof(data->'features') = 'array' THEN
      ARRAY(SELECT jsonb_array_elements_text(data->'features'))
    ELSE ARRAY[]::TEXT[]
  END,
  programs = data->>'programs';

-- 3. data カラムを削除
ALTER TABLE public.facility_specialty
DROP COLUMN data;

-- 4. NOT NULL 制約を追加（必須フィールド）
ALTER TABLE public.facility_specialty
ALTER COLUMN features SET NOT NULL;

-- 5. チェック制約を削除（data カラムがなくなったため）
ALTER TABLE public.facility_specialty
DROP CONSTRAINT IF EXISTS chk_specialty_data_not_empty;

-- 6. チェック制約を追加
ALTER TABLE public.facility_specialty
ADD CONSTRAINT chk_specialty_features_not_empty CHECK (array_length(features, 1) > 0);

-- 7. カラムコメントを追加
COMMENT ON COLUMN public.facility_specialty.features IS '当施設が特に力を入れている取り組み（配列）';
COMMENT ON COLUMN public.facility_specialty.programs IS '特色ある活動や独自プログラム';
