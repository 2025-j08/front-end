-- ============================================================================
-- 滋賀県の児童養護施設の詳細データ更新
-- - location_address: 住所
-- - lat             : 緯度
-- - lng             : 経度
-- ============================================================================

UPDATE public.facility_access
SET
    location_address = '滋賀県守山市笠原町1257-1',
    lat = 35.092369,
    lng = 135.986107
WHERE facility_id = 74;

UPDATE public.facility_access
SET
    location_address = '滋賀県甲賀市甲賀町小佐治3571',
    lat = 34.941561,
    lng = 136.213064
WHERE facility_id = 75;

UPDATE public.facility_access
SET
    location_address = '滋賀県大津市錦織1-10-21',
    lat = 35.030322,
    lng = 135.854079
WHERE facility_id = 76;

UPDATE public.facility_access
SET
    location_address = '滋賀県大津市平津2-4-9',
    lat = 34.952609,
    lng = 135.90389
WHERE facility_id = 77;