-- ============================================================================
-- 奈良県の施設データ
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
    (78, '愛染寮', '社会福祉法人 宝山寺福祉事業団', '630-0257', '0743-74-1172', '奈良県', ' 生駒市', '元町2-14-8', 1946, '[]'),
    (79, '飛鳥学院', '社会福祉法人   飛鳥学院', '633-0053', '0744-42-2831', '奈良県', '桜井市', '谷480', 1946, '[]'),
    (80, 'いかるが園', '社会福祉法人 いかるが園', '636-0116', '0745-74-2152', '奈良県', '生駒郡斑鳩町 ', '法隆寺2-12-8', 1953, '[]'),
    (81, '天理養徳院', '社会福祉法人 天理', '632-0018', '0743-62-0371', '奈良県', '天理市', '別所町715-3', 1910, '[]'),
    (82, '大和育成園', '社会福祉法人 大和育成園', '633-0253', '0745-82-0107', '奈良県', '宇陀市', '榛原萩原1758', 1948, '[]'),
    (83, '嚶鳴学院', '社会福祉法人  嚶鳴学院', '637-0027', '0747-22-7115', '奈良県', '五條市', '島野町745', 1976, '[]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 施設詳細データの更新
-- ============================================================================

-- 奈良県 児童養護施設 詳細データ（id:78〜83）
UPDATE public.facility_access
SET
    location_address = '奈良県生駒市元町2-14-8',
    lat = 34.689125,
    lng = 135.690348,
    station = '線生駒駅(近鉄奈良)',
    description = '近鉄奈良「線生駒」駅から徒歩で15分',
    location_appeal = '',
    website_url = 'https://aizenryo.hozanji-wel.org/',
    target_age = '2～18歳',
    building = '',
    capacity = 51,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 78;

UPDATE public.facility_access
SET
    location_address = '奈良県桜井市谷480',
    lat = 34.507766,
    lng = 135.843249,
    station = '桜井駅(近鉄・JR)',
    description = '近鉄・JR「桜井駅」より徒歩13分',
    location_appeal = '',
    website_url = 'https://asukagakuin.or.jp/index.html',
    target_age = '2～18歳',
    building = '',
    capacity = 68,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 79;

UPDATE public.facility_access
SET
    location_address = '奈良県生駒郡斑鳩町法隆寺2-12-8',
    lat = 34.609803,
    lng = 135.742641,
    station = '法隆寺駅(JR関西本線)',
    description = '法隆寺駅北口から徒歩14分',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 43,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 80;

UPDATE public.facility_access
SET
    location_address = '奈良県天理市別所町715-3',
    lat = 34.60882,
    lng = 135.837577,
    station = '近鉄天理線天理駅・JR桜井線天理駅下車',
    description = '近鉄天理線天理駅またはJR桜井線天理駅下車 北東へ徒歩30分',
    location_appeal = '',
    website_url = 'https://tenriyoutokuin.com/index.html',
    target_age = '2～18歳',
    building = '',
    capacity = 57,
    provisional_capacity = NULL,
    relation_info = '地域の子ども会活動への参加や、各種団体（JCI、NPO法人）との交流なども行っています。'
WHERE facility_id = 81;

UPDATE public.facility_access
SET
    location_address = '奈良県宇陀市榛原萩原1758',
    lat = 34.533259,
    lng = 135.955844,
    station = '榛原駅(近鉄)',
    description = '近鉄「榛原駅」より徒歩15分',
    location_appeal = '',
    website_url = 'http://www.yamato-ikuseien.or.jp/',
    target_age = '2～18歳',
    building = '',
    capacity = 40,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 82;

UPDATE public.facility_access
SET
    location_address = '奈良県五條市島野町745',
    lat = 34.448278,
    lng = 135.741104,
    station = '五条駅(JR和歌山線)',
    description = 'JR和歌山線「五条駅」から車で8分',
    location_appeal = '',
    website_url = '',
    target_age = '2～18歳',
    building = '',
    capacity = 40,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 83;