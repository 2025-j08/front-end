-- ============================================================================
-- 和歌山県の児童養護施設の詳細データ更新
-- - location_address: 住所
-- - lat             : 緯度
-- - lng             : 経度
-- ============================================================================

UPDATE public.facility_access
SET
    location_address = '和歌山県和歌山市冬野155',
    lat = 34.190039,
    lng = 135.214798
WHERE facility_id = 84;

UPDATE public.facility_access
SET
    location_address = '和歌山県新宮市新宮8018',
    lat = 33.711317,
    lng = 135.99707
WHERE facility_id = 85;

UPDATE public.facility_access
SET
    location_address = '和歌山県田辺市向山395-1',
    lat = 33.749371,
    lng = 135.339386
WHERE facility_id = 86;

UPDATE public.facility_access
SET
    location_address = '和歌山県和歌山市直川1437',
    lat = 34.266812,
    lng = 135.214879
WHERE facility_id = 87;

UPDATE public.facility_access
SET
    location_address = '和歌山県和歌山市つつじが丘7-2-1',
    lat = 34.265423,
    lng = 135.09801
WHERE facility_id = 88;

UPDATE public.facility_access
SET
    location_address = '和歌山県紀の川市下丹生谷101',
    lat = 34.291337,
    lng = 135.418937
WHERE facility_id = 89;

UPDATE public.facility_access
SET
    location_address = '和歌山県田辺市城山台5-1',
    lat = 33.72465,
    lng = 135.427939
WHERE facility_id = 90;

UPDATE public.facility_access
SET
    location_address = '和歌山県橋本市橋谷325',
    lat = 34.346461,
    lng = 135.604719
WHERE facility_id = 91;