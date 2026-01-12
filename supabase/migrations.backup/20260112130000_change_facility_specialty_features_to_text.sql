-- facility_specialty テーブルの features カラムを TEXT[] から TEXT に変更
-- 特化領域タブのデザイン変更に伴い、配列ではなく長文テキストで保存する

-- 1. 既存のデータをバックアップ用の一時カラムに保存
ALTER TABLE public.facility_specialty
ADD COLUMN features_backup TEXT[];

UPDATE public.facility_specialty
SET features_backup = features;

-- 2. features カラムを削除
ALTER TABLE public.facility_specialty
DROP COLUMN features;

-- 3. features カラムを TEXT 型で再作成
ALTER TABLE public.facility_specialty
ADD COLUMN features TEXT NOT NULL DEFAULT '';

-- 4. バックアップデータを新しい形式に変換（配列を改行なしの連結文字列に）
UPDATE public.facility_specialty
SET features = array_to_string(features_backup, '');

-- 5. バックアップカラムを削除
ALTER TABLE public.facility_specialty
DROP COLUMN features_backup;

-- 6. チェック制約を削除（配列ベースの制約）
ALTER TABLE public.facility_specialty
DROP CONSTRAINT IF EXISTS chk_specialty_features_not_empty;

-- 7. 新しいチェック制約を追加（テキストベースの制約）
ALTER TABLE public.facility_specialty
ADD CONSTRAINT chk_specialty_features_not_empty CHECK (length(features) > 0);

-- 8. カラムコメントを更新
COMMENT ON COLUMN public.facility_specialty.features IS '特に力を入れている取り組み/支援領域（長文テキスト）';
