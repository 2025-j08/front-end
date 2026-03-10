-- 施設監査に基づく文字列整備 SQL
-- 実行日: 2026-03-10
-- 対象: 監査で検出された前後空白、location_address の不整合
-- 注意: 緯度経度そのものは更新しません

BEGIN;

-- 1. facilities の city/address_detail に残っている前後空白を除去
UPDATE public.facilities
SET city = btrim(city)
WHERE id IN (74, 76, 78, 80, 84, 86, 92, 93, 94, 95, 102)
  AND city <> btrim(city);

UPDATE public.facilities
SET address_detail = btrim(address_detail)
WHERE id IN (6, 7, 11)
  AND address_detail <> btrim(address_detail);

-- 2. facility_access.location_address を facilities の正規化後住所に合わせる
UPDATE public.facility_access fa
SET location_address = concat(f.prefecture, f.city, f.address_detail)
FROM public.facilities f
WHERE fa.facility_id = f.id
  AND f.id IN (1, 6, 22, 24, 58, 88, 97)
  AND fa.location_address IS DISTINCT FROM concat(f.prefecture, f.city, f.address_detail);

COMMIT;

-- 3. 更新後確認: まだ location_address が本体住所と一致しない施設
SELECT
  f.id,
  f.name,
  concat(f.prefecture, f.city, f.address_detail) AS expected_address,
  fa.location_address AS current_location_address
FROM public.facilities f
JOIN public.facility_access fa ON fa.facility_id = f.id
WHERE fa.location_address IS DISTINCT FROM concat(f.prefecture, f.city, f.address_detail)
ORDER BY f.id;

-- 4. 確認用: 同一座標を共有する施設
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
