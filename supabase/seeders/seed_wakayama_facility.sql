-- ============================================================================
-- 和歌山県の施設データ
-- ============================================================================

INSERT INTO public.facilities (
    id,
    name,
    corporation,
    postal_code,
    phone,
    prefecture,
    city,
    address_detail,
    established_year,
    annex_facilities
)
VALUES
    (84, '和歌山市旭学園', '社会福祉法人  和歌山社会事業協会', '640-0332', '073-479-0080', '和歌山県', ' 和歌山市', '冬野155', 1966, '[]'),
    (85, '紀南学園', '紀南学園事務組合', '647-0081', '0735-22-3004', '和歌山県', '新宮市', '新宮8018', 1951, '[]'),
    (86, 'くすのき', '社会福祉法人 真寿会', '646-1323', '0739-62-8600', '和歌山県', '田辺市 ', '向山395-1', 2010, '[]'),
    (87, 'こばと学園', '社会福祉法人 和歌山県社会施設事業会', '640-8481', '0734-61-0072', '和歌山県', '和歌山市', '直川1437', 1954, '[]'),
    (88, 'つつじが丘学舎', '社会福祉法人 虎伏学園', '640-0115', '073-480-1043', '和歌山県', '和歌山市', 'つつじが丘7丁目2-1', 1962, '[]'),
    (89, '丹生学園', '社会福祉法人  丹生学園', '649-6523', '0736-73-5840', '和歌山県', '紀ノ川市', '下丹生谷101', 1954, '[]'),
    (90, 'ひまわり寮', '社会福祉法人  和歌山県福祉事業団', '646-0217', '0739-25-3500', '和歌山県', '田辺市', '城山台5-1', 1955, '[]'),
    (91, '六地学園', '社会福祉法人 紀北和楽会', '648-0095', '0736-37-0823', '和歌山県', '橋本市', '橋谷325', 1949, '[]')
ON CONFLICT (id) DO NOTHING;

-- 奈良県 児童養護施設 詳細データ（id:84〜91）
UPDATE public.facility_access
SET
    location_address = '和歌山県和歌山市冬野155',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 84;

UPDATE public.facility_access
SET
    location_address = '和歌山県新宮市新宮8018',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 85;

UPDATE public.facility_access
SET
    location_address = '和歌山県田辺市向山395-1',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 86;

UPDATE public.facility_access
SET
    location_address = '和歌山県和歌山市直川1437 ',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 87;

UPDATE public.facility_access
SET
    location_address = '和歌山県和歌山市つつじが丘7丁目2-1',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 88;

UPDATE public.facility_access
SET
    location_address = '和歌山県紀ノ川市下丹生谷101',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 89;

UPDATE public.facility_access
SET
    location_address = '和歌山県田辺市城山台5-1',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 90;

UPDATE public.facility_access
SET
    location_address = '和歌山県橋本市橋谷325',
    lat = ,
    lng = ,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = ,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 91;