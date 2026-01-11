-- facility_types テーブルの name カラムに UNIQUE 制約を追加
-- 施設種類名の重複を防ぐため

ALTER TABLE public.facility_types
ADD CONSTRAINT facility_types_name_unique UNIQUE (name);

-- 制約コメント
COMMENT ON CONSTRAINT facility_types_name_unique ON public.facility_types IS '施設種類名の重複を防ぐ UNIQUE 制約';
