-- facility_access テーブルを正規化
-- JSONBの data カラムから個別カラムへ移行

-- 1. 新しいカラムを追加
ALTER TABLE public.facility_access
ADD COLUMN location_address TEXT,
ADD COLUMN lat NUMERIC(10, 7),
ADD COLUMN lng NUMERIC(10, 7),
ADD COLUMN station TEXT,
ADD COLUMN description TEXT,
ADD COLUMN location_appeal TEXT,
ADD COLUMN website_url TEXT,
ADD COLUMN target_age TEXT,
ADD COLUMN building TEXT,
ADD COLUMN capacity INTEGER,
ADD COLUMN provisional_capacity INTEGER,
ADD COLUMN relation_info TEXT;

-- 2. 既存の data カラムから新しいカラムへデータを移行
UPDATE public.facility_access
SET
  location_address = data->>'locationAddress',
  lat = CASE
    WHEN data->>'lat' IS NOT NULL THEN (data->>'lat')::NUMERIC(10, 7)
    ELSE NULL
  END,
  lng = CASE
    WHEN data->>'lng' IS NOT NULL THEN (data->>'lng')::NUMERIC(10, 7)
    ELSE NULL
  END,
  station = data->>'station',
  description = data->>'description',
  location_appeal = data->>'locationAppeal',
  website_url = data->>'websiteUrl',
  target_age = data->>'targetAge',
  building = data->>'building',
  capacity = CASE
    WHEN data->>'capacity' IS NOT NULL THEN (data->>'capacity')::INTEGER
    ELSE NULL
  END,
  provisional_capacity = CASE
    WHEN data->>'provisionalCapacity' IS NOT NULL THEN (data->>'provisionalCapacity')::INTEGER
    ELSE NULL
  END,
  relation_info = data->>'relationInfo';

-- 3. data カラムを削除
ALTER TABLE public.facility_access
DROP COLUMN data;

-- 4. NOT NULL 制約を追加（必須フィールド）
ALTER TABLE public.facility_access
ALTER COLUMN location_address SET NOT NULL,
ALTER COLUMN lat SET NOT NULL,
ALTER COLUMN lng SET NOT NULL,
ALTER COLUMN target_age SET NOT NULL;

-- 5. インデックスを追加（検索性能向上）
CREATE INDEX idx_facility_access_lat_lng ON public.facility_access(lat, lng);
CREATE INDEX idx_facility_access_station ON public.facility_access(station) WHERE station IS NOT NULL;

-- 6. チェック制約を追加
ALTER TABLE public.facility_access
ADD CONSTRAINT chk_access_lat_range CHECK (lat BETWEEN -90 AND 90),
ADD CONSTRAINT chk_access_lng_range CHECK (lng BETWEEN -180 AND 180),
ADD CONSTRAINT chk_access_capacity_positive CHECK (capacity > 0),
ADD CONSTRAINT chk_access_provisional_capacity_positive CHECK (provisional_capacity > 0);

-- 7. カラムコメントを追加
COMMENT ON COLUMN public.facility_access.location_address IS '施設の所在地住所';
COMMENT ON COLUMN public.facility_access.lat IS '緯度';
COMMENT ON COLUMN public.facility_access.lng IS '経度';
COMMENT ON COLUMN public.facility_access.station IS '最寄り駅・バス停名';
COMMENT ON COLUMN public.facility_access.description IS '駅からのアクセス方法';
COMMENT ON COLUMN public.facility_access.location_appeal IS '立地のアピールポイント';
COMMENT ON COLUMN public.facility_access.website_url IS '施設のウェブサイトURL';
COMMENT ON COLUMN public.facility_access.target_age IS '対象年齢';
COMMENT ON COLUMN public.facility_access.building IS '建物情報';
COMMENT ON COLUMN public.facility_access.capacity IS '施設の定員';
COMMENT ON COLUMN public.facility_access.provisional_capacity IS '暫定定員';
COMMENT ON COLUMN public.facility_access.relation_info IS '地域連携情報';
