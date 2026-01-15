-- facilities テーブルの phone と established_year を NULL 許容に変更
-- 施設追加時に管理者が入力せず、後から施設担当者が入力できるようにするため

-- phone を NULL 許容に変更
ALTER TABLE public.facilities
    ALTER COLUMN phone DROP NOT NULL;

-- established_year を NULL 許容に変更（CHECKも調整）
ALTER TABLE public.facilities
    DROP CONSTRAINT IF EXISTS facilities_established_year_check;

ALTER TABLE public.facilities
    ALTER COLUMN established_year DROP NOT NULL;

ALTER TABLE public.facilities
    ADD CONSTRAINT facilities_established_year_check
    CHECK (established_year IS NULL OR established_year BETWEEN 1800 AND date_part('year', now()));

-- カラムコメント更新
COMMENT ON COLUMN public.facilities.phone IS '電話番号（施設担当者が後から入力可能）';
COMMENT ON COLUMN public.facilities.established_year IS '設立年（施設担当者が後から入力可能、1800年〜現在年）';
