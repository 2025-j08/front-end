-- facility_education テーブルを正規化
-- JSONBの data カラムから個別カラムへ移行

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_education
ADD COLUMN graduation_rate TEXT,
ADD COLUMN learning_support TEXT,
ADD COLUMN career_support TEXT;

-- 2. 既存の data カラムから新しいカラムへデータを移行
UPDATE public.facility_education
SET
  graduation_rate = data->>'graduationRate',
  learning_support = data->>'learningSupport',
  career_support = data->>'careerSupport';

-- 3. data カラムを削除
ALTER TABLE public.facility_education
DROP COLUMN data;

-- 4. チェック制約を削除（data カラムがなくなったため）
ALTER TABLE public.facility_education
DROP CONSTRAINT IF EXISTS chk_education_data_not_empty;

-- 5. カラムコメントを追加
COMMENT ON COLUMN public.facility_education.graduation_rate IS '進学率（高校、専門、大学）と支援体制';
COMMENT ON COLUMN public.facility_education.learning_support IS '学習支援の工夫や外部連携';
COMMENT ON COLUMN public.facility_education.career_support IS '特化した進路支援内容';
