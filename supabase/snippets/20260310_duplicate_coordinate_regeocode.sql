-- 重複座標のうち、住所が異なる施設を個別住所から再ジオコーディングして更新
-- 取得元: geocoding.jp
-- 実行日: 2026-03-10

BEGIN;

UPDATE public.facility_access
SET lat = 34.452318,
    lng = 135.432724,
    location_address = '大阪府岸和田市三田町614-1'
WHERE facility_id = 34;

UPDATE public.facility_access
SET lat = 34.450612,
    lng = 135.430737,
    location_address = '大阪府岸和田市三田町810-1'
WHERE facility_id = 35;

UPDATE public.facility_access
SET lat = 34.452768,
    lng = 135.427041,
    location_address = '大阪府岸和田市三田町911'
WHERE facility_id = 40;

UPDATE public.facility_access
SET lat = 34.670648,
    lng = 135.523973,
    location_address = '大阪府大阪市天王寺区城南寺町1-10'
WHERE facility_id IN (66, 73);

UPDATE public.facility_access
SET lat = 34.652363,
    lng = 135.510066,
    location_address = '大阪府大阪市天王寺区逢阪2-8-41'
WHERE facility_id = 67;

UPDATE public.facility_access
SET lat = 34.653353,
    lng = 135.511218,
    location_address = '大阪府大阪市天王寺区逢阪2-8-43'
WHERE facility_id = 68;

COMMIT;

-- 確認用: 同一座標を共有する施設
SELECT
  fa.lat,
  fa.lng,
  array_agg(f.id ORDER BY f.id) AS facility_ids,
  array_agg(f.name ORDER BY f.id) AS facility_names,
  array_agg(concat(f.prefecture, f.city, f.address_detail) ORDER BY f.id) AS full_addresses
FROM public.facility_access fa
JOIN public.facilities f ON f.id = fa.facility_id
WHERE fa.lat <> 0 AND fa.lng <> 0
GROUP BY fa.lat, fa.lng
HAVING count(*) > 1
ORDER BY count(*) DESC, fa.lat, fa.lng;
