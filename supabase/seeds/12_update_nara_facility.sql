-- ============================================================================
-- 奈良県の児童養護施設の詳細データ更新
-- - location_address: 住所
-- - lat             : 緯度
-- - lng             : 経度
-- ============================================================================

UPDATE public.facility_access
SET
    location_address = '奈良県生駒市元町2-14-8',
    lat = 34.689125,
    lng = 135.690348
WHERE facility_id = 78;

UPDATE public.facility_access
SET
    location_address = '奈良県桜井市谷480',
    lat = 34.507766,
    lng = 135.843249
WHERE facility_id = 79;

UPDATE public.facility_access
SET
    location_address = '奈良県生駒郡斑鳩町法隆寺2-12-8',
    lat = 34.609803,
    lng = 135.742641
WHERE facility_id = 80;

UPDATE public.facility_access
SET
    location_address = '奈良県天理市別所町715-3',
    lat = 34.60882,
    lng = 135.837577
WHERE facility_id = 81;

UPDATE public.facility_access
SET
    location_address = '奈良県宇陀市榛原萩原1758',
    lat = 34.533259,
    lng = 135.955844
WHERE facility_id = 82;

UPDATE public.facility_access
SET
    location_address = '奈良県五條市島野町745',
    lat = 34.448278,
    lng = 135.741104
WHERE facility_id = 83;