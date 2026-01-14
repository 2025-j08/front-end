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
    (92, '青葉学園', '社会福祉法人  青葉学園', '621-0031', '0771-22-0651', '京都府', ' 亀岡市ひえ田野町', '太田高星7', 1949, '[]'),
    (93, '京都大和の家', '社会福祉法人 盛和福祉会', '619-0243', '0774-98-3840', '京都府', ' 相楽郡精華町', '大字南稲八妻小字笛竹37', 2004, '[]'),
    (94, 'てらす峰夢', '社会福祉法人 みねやま福祉会', '627-0012', '0772-62-1251', '京都府', '京丹後市峰山町 ', '杉谷952-8', 1955, '[]'),
    (95, '舞鶴学園', '社会福祉法人  舞鶴学園', '625-0026', '0773-62-1315', '京都府', ' 舞鶴市 ', '大字泉源寺小字立田223', 1946, '[]'),
    (96, '舞鶴双葉寮', '社会福祉法人 舞鶴双葉寮', '625-0060', '0773-62-0122', '京都府', '舞鶴市', '桃山町7-5', 1948, '[]'),
    (97, '迦陵園', '社会福祉法人  迦陵園', '606-0802', '075-701-0250', '京都府', '京都市左京区', '下鴨宮崎町109', 1959, '[]'),
    (98, '京都聖嬰会', '社会福祉法人   聖嬰会', '603-8456', '075-462-9268', '京都府', '京都市北区', '衣笠西尊上院町22', 1986, '[]'),
    (99, '積慶園', '社会福祉法人  積慶園', '615-8145', '075-392-6351', '京都府', '京都市西京区', '樫原角田町1番地42', 1945, '[]'),
    (100, 'つばさ園', '社会福祉法人 京都社会事業財団', '615-8256', '075-381-3650', '京都府', '京都市西京区', '山田平尾町51-28', 1946, '[]'),
    (101, '平安徳義会養護園', '社会福祉法人 平安徳義会', '610-1132', '075-331-0007', '京都府', '京都市西京区', '大原野灰方町249', 1890, '[]'),
    (102, '平安養育院', '社会福祉法人 平安養育院', '605-0062', '075-561-0680', '京都府', ' 京都市東山区', '林下町400-3', 1905, '[]'),
    (103, '桃山学園', '社会福祉法人 京都府社会福祉事業団', '612-8012', '075-602-4225', '京都府', '京都市伏見区', '桃山町遠山50', 1954, '[]'),
    (104, '和敬学園', '社会福祉法人 衆善会', '602-0898', '075-241-3320', '京都府', '京都市上京区', '烏丸通寺ノ内上る東入相国寺門前町704', 1924, '[]'),
ON CONFLICT (id) DO NOTHING;

UPDATE public.facility_access
SET
    location_address = '京都府亀岡市ひえ田野町太田高星7',
    lat = 35.023064,
    lng = 135.547779,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 45,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 92;

UPDATE public.facility_access
SET
    location_address = '京都府相楽郡精華町大字南稲八妻小字笛竹37',
    lat = 34.756272,
    lng = 135.792052,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 60,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 93;

UPDATE public.facility_access
SET
    location_address = '京都府京丹後市峰山町杉谷952-8',
    lat = 35.62161,
    lng = 135.060449,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 25,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 94;

UPDATE public.facility_access
SET
    location_address = '京都府舞鶴市大字泉源寺小字立田223',
    lat = 35.487317,
    lng = 135.436513,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 45,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 95;

UPDATE public.facility_access
SET
    location_address = '京都府舞鶴市桃山町7-5',
    lat = 35.466269,
    lng = 135.390018,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 45,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 96;

UPDATE public.facility_access
SET
    location_address = '京都市左京区下鴨宮崎町109',
    lat = 35.033872,
    lng = 135.770259,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 40,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 97;

UPDATE public.facility_access
SET
    location_address = '京都府京都市北区衣笠西尊上院町22',
    lat = 35.041989,
    lng = 135.731973,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 55,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 98;

UPDATE public.facility_access
SET
    location_address = '京都府京都市西京区樫原角田町1番地42',
    lat = 34.969897,
    lng = 135.692411,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 66,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 99;

UPDATE public.facility_access
SET
    location_address = '京都府京都市西京区山田平尾町51-28',
    lat = 34.981798,
    lng = 135.684939,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 52,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 100;

UPDATE public.facility_access
SET
    location_address = '京都府京都市西京区大原野灰方町249',
    lat = 34.949544,
    lng = 135.668406,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 85,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 101;

UPDATE public.facility_access
SET
    location_address = '京都府京都市東山区林下町400-3',
    lat = 35.005534,
    lng = 135.78366,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 60,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 102;

UPDATE public.facility_access
SET
    location_address = '京都府京都市伏見区桃山町遠山50',
    lat = 34.935277,
    lng = 135.789094,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 30,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 103;

UPDATE public.facility_access
SET
    location_address = '京都府京都市上京区烏丸通寺ノ内上る東入相国寺門前町704',
    lat = 35.026795,
    lng = 135.741823,
    station = '',
    description = '',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 60,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 104;