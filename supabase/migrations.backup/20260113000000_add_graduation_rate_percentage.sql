-- facility_education テーブルに進学率の割合カラムを追加
-- 進学率と支援体制の説明文とは別に、数値としての進学率を格納

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_education
ADD COLUMN graduation_rate_percentage TEXT;

-- 2. カラムコメントを追加
COMMENT ON COLUMN public.facility_education.graduation_rate_percentage IS '進学率の割合（例: 100%）';
