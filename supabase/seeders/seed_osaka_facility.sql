-- ============================================================================
-- 5. 大阪府の施設データ
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
    (34, 'あおぞら', '社会福祉法人 阪南福祉事業会', '596-0808', '072-444-0100', '大阪府', '岸和田市', '三田町614-1', NULL, '[]'),
    (35, 'あんだんて', '社会福祉法人 阪南福祉事業会', '596-0808', '072-440-0300', '大阪府', '岸和田市', '三田町810-1', NULL, '[]'),
    (36, '生駒学園', '社会福祉法人 生駒学院', '579-8014', '0729-81-1005', '大阪府', '東大阪市', '中石切町2-5-5', NULL, '[]'),
    (37, '和泉幼児院', '社会福祉法人 和泉幼児院', '595-0071', '0725-33-2227', '大阪府', '泉大津市', '助松町3-8-7', NULL, '[]'),
    (38, '大阪西本願寺常照園', '社会福祉法人 大阪西本願寺常照園', '564-0063', '06-6384-0867', '大阪府', '吹田市', '江坂町3-40-24', NULL, '[]'),
    (39, 'ガーデンロイ', '社会福祉法人 イエス団', '579-8052', '072-985-4773', '大阪府', '東大阪市', '上四条町24-23', NULL, '[]'),
    (40, '岸和田学園', '社会福祉法人 阪南福祉事業会', '596-0808', '0724-45-0710', '大阪府', '岸和田市', '三田町911', NULL, '[]'),
    (41, '救世軍希望館', '社会福祉法人 救世軍社会事業団', '567-0034', '0726-23-3758', '大阪府', '茨木市', '中穂積2-16-11', NULL, '[]'),
    (42, '公徳学園', '社会福祉法人 公徳会', '577-0025', '06-6781-0236', '大阪府', '東大阪市', '新家3-7-8', NULL, '[]'),
    (43, '子どもの家', '社会福祉法人 慶徳会', '567-0048', '072-622-5030', '大阪府', '茨木市', '北春日丘1-3-38', NULL, '[]'),
    (44, '信太学園', '社会福祉法人 高津学園', '594-0003', '0725-41-0559', '大阪府', '和泉市', '太町376', NULL, '[]'),
    (45, '松柏学園', '社会福祉法人 松柏会', '564-0063', '06-6368-6010', '大阪府', '吹田市', '江坂町4-20-1', NULL, '[]'),
    (46, '女子慈教寮', '社会福祉法人 女子慈教寮', '594-0083', '0725-41-1009', '大阪府', '和泉市', '池上町3-6-62', NULL, '[]'),
    (47, '聖ヨハネ学園', '社会福祉法人 聖ヨハネ学園', '569-1032', '0726-87-0541', '大阪府', '高槻市', '宮之川原2-9-1', NULL, '[]'),
    (48, '高鷲学園', '社会福祉法人 大阪福祉事業財団', '583-0885', '0729-53-3881', '大阪府', '羽曳野市', '南恵我之荘2-6-20', NULL, '[]'),
    (49, '武田塾', '社会福祉法人 武田塾', '582-0015', '0729-77-3861', '大阪府', '柏原市', '大字高井田1020-59', NULL, '[]'),
    (50, '翼', '社会福祉法人 大阪水上隣保館', '561-0893', '06-6210-6661', '大阪府', '豊中市', '宝山町16-8', NULL, '[]'),
    (51, '奈佐原寮', '社会福祉法人 奈佐原寮', '569-1043', '0726-96-0214', '大阪府', '高槻市', '奈佐原元町17-23', NULL, '[]'),
    (52, '南河学園', '社会福祉法人 南河学園', '582-0021', '0729-75-2200', '大阪府', '柏原市', '国分本町7-6-14', NULL, '[]'),
    (53, '花園精舎', '社会福祉法人 花園精舎', '578-0924', '0729-62-2132', '大阪府', '東大阪市', '吉田5-15-14', NULL, '[]'),
    (54, '羽曳野荘', '社会福祉法人 羽曳野荘', '583-0868', '072-956-2102', '大阪府', '羽曳野市', '学園前1-1-3', NULL, '[]'),
    (55, '遙学園', '社会福祉法人 大阪水上隣保館', '618-0001', '075-961-0041', '大阪府', '三島郡', '島本町山崎5-3-18', NULL, '[]'),
    (56, '三ケ山学園', '社会福祉法人 三ケ山学園', '597-0046', '072-447-0611', '大阪府', '貝塚市', '東山2-1-1', NULL, '[]'),
    (57, 'レバノンホーム', '社会福祉法人 レバノンホーム', '567-0001', '072-643-5145', '大阪府', '茨木市', '安威1-7-21', NULL, '[]'),
    (58, '若江学院', '社会福祉法人 若福会', '578-0947', '072-962-1808', '大阪府', '東大阪市', '西岩田1-2-8', NULL, '[]'),
    (59, '愛育社', '社会福祉法人 愛育社', '599-8263', '072-278-5856', '大阪府', '堺市中区', '八田南之町219', NULL, '[]'),
    (60, '泉ヶ丘学院', '社会福祉法人 南湖会', '599-8251', '072-278-0374', '大阪府', '堺市中区', '平井482', NULL, '[]'),
    (61, '清心寮', '社会福祉法人 大阪児童福祉事業協会', '591-8035', '072-252-2794', '大阪府', '堺市北区', '東上野芝町2-499', NULL, '[]'),
    (62, '東光学園', '社会福祉法人 東光学園', '599-8234', '072-237-6161', '大阪府', '堺市中区', '土塔町2028', NULL, '[]'),
    (63, '池島寮', '社会福祉法人 海の子学園', '552-0015', '06-6571-0200', '大阪府', '大阪市港区', '池島2-5-52', NULL, '[]'),
    (64, '入舟寮', '社会福祉法人 海の子学園', '552-0015', '06-6571-1000', '大阪府', '大阪市港区', '池島3-7-18', NULL, '[]'),
    (65, '弘済みらい園', '社会福祉法人 みおつくし福祉会', '565-0874', '06-6871-8011', '大阪府', '吹田市', '古江台6-2-1', NULL, '[]'),
    (66, '高津学園', '社会福祉法人 高津学園', '543-0017', '06-6761-1663', '大阪府', '大阪市天王寺区', '城南寺町1-10', NULL, '[]'),
    (67, '四恩学園', '社会福祉法人 四恩学園', '543-0062', '06-6771-9360', '大阪府', '大阪市天王寺区', '逢阪2-8-41', 1948, '[]'),
    (68, '四恩たまみず園', '社会福祉法人 四恩学園', '543-0062', '06-6771-9360', '大阪府', '大阪市天王寺区', '逢阪2-8-43', 2015, '[]'),
    (69, '助松寮', '社会福祉法人 みおつくし福祉会', '595-0072', '0725-22-5956', '大阪府', '泉大津市', '松之浜町1-3-24', NULL, '[]'),
    (70, '聖家族の家', '社会福祉法人 聖家族の家', '546-0033', '06-6699-7221', '大阪府', '大阪市東住吉区', '南田辺4-5-2', NULL, '[]'),
    (71, '田島童園', '社会福祉法人 田島童園', '544-0023', '06-6731-2321', '大阪府', '大阪市生野区', '林寺5-11-24', NULL, '[]'),
    (72, '博愛社', '社会福祉法人 博愛社', '532-0028', '06-6301-0367', '大阪府', '大阪市淀川区', '十三元今里3-1-72', NULL, '[]'),
    (73, '報恩寮', '社会福祉法人 高津学園', '543-0017', '06-6761-1663', '大阪府', '大阪市天王寺区', '城南寺町1-10', NULL, '[]')
ON CONFLICT (id) DO NOTHING;
    

-- ============================================================================
-- 6. 施設詳細データの更新
-- ============================================================================

-- 大阪府 児童養護施設 詳細データ（id:34〜73）
UPDATE public.facility_access
SET
    location_address = '大阪府岸和田市三田町614-1',
    lat = 34.466919,
    lng = 135.410301,
    station = '山直市民センター前(南海バス)',
    description = '山直市民センター前から徒歩2分',
    location_appeal = '',
    website_url = 'https://aozora-kids.net/',
    target_age = '2～18歳',
    building = '',
    capacity = 58,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 34;

UPDATE public.facility_access
SET
    location_address = '大阪府岸和田市三田町810-1',
    lat = 34.466919,
    lng = 135.410301,
    station = '山直市民センター前(南海バス)',
    description = '山直市民センター前から徒歩2分',
    location_appeal = '',
    website_url = 'https://hannan-fukushi.net/andante/',
    target_age = '2～18歳',
    building = '',
    capacity = 32,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 35;

UPDATE public.facility_access
SET
    location_address = '大阪府東大阪市中石切町2-5-5',
    lat = 34.685406,
    lng = 135.645396,
    station = '石切駅(近鉄奈良線)',
    description = '石切駅から徒歩15分',
    location_appeal = '石切駅生駒山の麓で自然に恵まれている',
    website_url = 'https://ikoma-gakuen.com/',
    target_age = '2～18歳',
    building = '',
    capacity = 100,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 36;

UPDATE public.facility_access
SET
    location_address = '大阪府泉大津市助松町3-8-7',
    lat = 34.513842,
    lng = 135.417937,
    station = '北助松駅・松ノ浜駅(南海本線)',
    description = '南海本線「北助松」駅「松ノ浜」駅より徒歩10分',
    location_appeal = '',
    website_url = 'https://www.nyuyouji.or.jp/youjiin/',
    target_age = '2～18歳',
    building = '',
    capacity = 56,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 37;

UPDATE public.facility_access
SET
    location_address = '大阪府吹田市江坂町3-40-24',
    lat = 34.765704,
    lng = 135.488898,
    station = '江坂駅(地下鉄御堂筋線)',
    description = '地下鉄御堂筋線「江坂駅」下車 徒歩15分',
    location_appeal = '',
    website_url = 'https://jyoshoen.org/',
    target_age = '2～18歳',
    building = '',
    capacity = 60,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 38;

UPDATE public.facility_access
SET
    location_address = '大阪府東大阪市上四条町24-23',
    lat = 34.696859,
    lng = 135.638237,
    station = '瓢箪山駅(近鉄奈良線)',
    description = '近鉄奈良線「瓢箪山駅」より徒歩25分',
    location_appeal = '',
    website_url = 'https://www.el-roi.jp/roi/index.html',
    target_age = '2～18歳',
    building = '',
    capacity = 30,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 39;

UPDATE public.facility_access
SET
    location_address = '大阪府岸和田市三田町911',
    lat = 34.466919,
    lng = 135.410301,
    station = '岸和田駅',
    description = '南海「岸和田」駅より南海バス「小倉」バス停下車 徒歩3分',
    location_appeal = '',
    website_url = 'https://hannan-fukushi.net/kishiwada-gakuen/',
    target_age = '2～18歳',
    building = '',
    capacity = 42,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 40;

UPDATE public.facility_access 
SET 
    location_address = '大阪府茨木市中穂積2-16-11', 
    lat = 34.819435, 
    lng = 135.552404, 
    station = 'JR茨木駅', 
    description = 'JR茨木駅から徒歩約15分', 
    location_appeal = '', 
    website_url = 'https://kibokan.salvationarmy.or.jp/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 65, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 41;

UPDATE public.facility_access 
SET 
    location_address = '大阪府東大阪市新家3-7-8', 
    lat = 34.672398, 
    lng = 135.595485, 
    station = '長田駅(大阪メトロ中央線)', 
    description = '大阪メトロ中央線「長田」駅より徒歩15分', 
    location_appeal = '', 
    website_url = 'https://koutokugakuen.org/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 45, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 42;

UPDATE public.facility_access 
SET 
    location_address = '大阪府茨木市北春日丘1-3-38', 
    lat = 34.818079, 
    lng = 135.549506, 
    station = '茨木駅(JR京都線)', 
    description = '茨木駅から近鉄バス「松沢池・春日丘行き」乗車「北春日丘」下車から徒歩約5分', 
    location_appeal = '', 
    website_url = 'https://www.keitokukai.or.jp/kodomonoie/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 51, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 43;

UPDATE public.facility_access 
SET 
    location_address = '大阪府和泉市太町376', 
    lat = 34.505416, 
    lng = 135.445542, 
    station = '北信太駅(JR阪和線)', 
    description = 'JR阪和線「北信太」駅から徒歩10分', 
    location_appeal = '', 
    website_url = 'http://www.kozu-gakuen.jp/shinoda/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 44, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 44;

UPDATE public.facility_access 
SET
    location_address = '大阪府吹田市江坂町4-20-1', 
    lat = 34.770466, 
    lng = 135.494011, 
    station = '緑地公園駅(北大阪急行)', 
    description = '北大阪急行「緑地公園」駅から徒歩10分', 
    location_appeal = '', 
    website_url = 'https://www.shohakugakuen.org/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 35, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 45;

UPDATE public.facility_access 
SET 
    location_address = '大阪府和泉市池上町3-6-62', 
    lat = 34.500252, 
    lng = 135.428306, 
    station = '信太山駅(JR阪和線)', 
    description = 'JR阪和線「信太山」駅から徒歩7分', 
    location_appeal = '', 
    website_url = 'https://jyoshijikyoryo.wixsite.com/1926', 
    target_age = '2～18歳',
    building = '', 
    capacity = 40, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 46;

UPDATE public.facility_access 
SET 
    location_address = '大阪府高槻市宮之川原2-9-1', 
    lat = 34.871172, 
    lng = 135.600351, 
    station = 'JR高槻駅', 
    description = 'JR「高槻」駅北バス停1番乗り場乗車、「服部」バス停で降車 徒歩5分', 
    location_appeal = '', 
    website_url = 'https://yohanegakuen.jp/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 80, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 47;

UPDATE public.facility_access 
SET 
    location_address = '大阪府羽曳野市南恵我之荘2-6-20', 
    lat = 34.569969, 
    lng = 135.57191, 
    station = '近鉄恵我ノ荘駅', 
    description = '近鉄恵我ノ荘駅より徒歩5分', 
    location_appeal = '', 
    website_url = 'https://takawashigakuen.com/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 78, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 48;

UPDATE public.facility_access 
SET 
    location_address = '大阪府柏原市大字高井田1020-59', 
    lat = 34.57447, 
    lng = 135.644312, 
    station = '高井田駅(JR関西本線)', 
    description = 'JR関西本線「高井田」駅から徒歩20分', 
    location_appeal = '', 
    website_url = 'https://takedajuku.or.jp/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 55, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 49;

UPDATE public.facility_access 
SET 
    location_address = '大阪府豊中市宝山町16-8', 
    lat = 34.777695, 
    lng = 135.458926, 
    station = '岡町駅(阪急宝塚線)', 
    description = '阪急宝塚線「岡町」駅から徒歩10分', 
    location_appeal = '', 
    website_url = 'https://osakasuijorinpokan.org/tsubasa/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 24, 
    provisional_capacity = NULL, 
    relation_info = '地域交流や地域貢献など、⼦どもたちが安⼼で安全な環境や、関係性を築くことに⼒を⼊れています。' 
WHERE facility_id = 50;

UPDATE public.facility_access 
SET 
    location_address = '大阪府高槻市奈佐原元町17-23', 
    lat = 34.864875, 
    lng = 135.584197, 
    station = '摂津富田駅', 
    description = 'JR「摂津富田駅」より高槻市バス乗車「奈佐原」バス停より徒歩2分', 
    location_appeal = '', 
    website_url = 'https://takatsuki-shisetsuren.jp/shisetsu/%E5%85%90%E7%AB%A5%E9%A4%8A%E8%AD%B7%E6%96%BD%E8%A8%AD-%E5%A5%88%E4%BD%90%E5%8E%9F%E5%AF%AE/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 30, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 51;

UPDATE public.facility_access 
SET 
    location_address = '大阪府柏原市国分本町7-6-14', 
    lat = 34.56277, 
    lng = 135.642953, 
    station = '河内国分駅(近鉄大阪線)', 
    description = '近鉄大阪線「河内国分」駅から徒歩15分', 
    location_appeal = '', 
    website_url = 'https://nankagakuen.jp/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 52, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 52;

UPDATE public.facility_access 
SET 
    location_address = '大阪府東大阪市吉田5-15-14', 
    lat = 34.666149, 
    lng = 135.622466, 
    station = '東花園駅(近鉄奈良線)', 
    description = '近鉄奈良線「東花園」駅から徒歩10分', 
    location_appeal = '東大阪市のほぼ中央に位置し、東側には生駒山を仰ぐ緑豊かな住宅地', 
    website_url = 'https://www.h-seisha.com/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 40, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 53;

UPDATE public.facility_access 
SET 
    location_address = '大阪府羽曳野市学園前1-1-3', 
    lat = 34.546655, 
    lng = 135.590524, 
    station = '藤井寺駅(近鉄南大阪線)', 
    description = '近鉄南大阪線「藤井寺」駅からバスで「府立医療センター」下車 徒歩3分', 
    location_appeal = '', 
    website_url = 'https://habikinoso.org/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 34, 
    provisional_capacity = NULL, 
    relation_info = ''
WHERE facility_id = 54;

UPDATE public.facility_access 
SET 
    location_address = '大阪府三島郡島本町山崎5-3-18', 
    lat = 34.695298, 
    lng = 135.437962, 
    station = '山崎駅(JR京都線)', 
    description = 'JR京都線「山崎」駅から徒歩10分', 
    location_appeal = '', 
    website_url = 'https://osakasuijorinpokan.org/harukagakuen/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 134, 
    provisional_capacity = NULL, 
    relation_info = '地域との交流や、ボランティアの方々からのご支援のもと、多くの行事を通して子どもたちが様々な経験を重ねられるよう取り組んでいます。' 
WHERE facility_id = 55;

UPDATE public.facility_access 
SET 
    location_address = '大阪府貝塚市東山2-1-1', 
    lat = 34.418533, 
    lng = 135.391501, 
    station = '森駅(水間鉄道)', 
    description = '水間鉄道「森駅」からタクシーで約5分または徒歩約20分', 
    location_appeal = '', 
    website_url = 'https://mikeyamagakuen.jp/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 82, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 56;

UPDATE public.facility_access 
SET 
    location_address = '大阪府茨木市安威1-7-21', 
    lat = 34.848109, 
    lng = 135.565667, 
    station = '茨木市駅(阪急京都線)', 
    description = '茨木市駅から阪急バス乗車「安威南口」から徒歩3分', 
    location_appeal = '豊かな自然に囲まれながらのびのび生活', 
    website_url = 'https://lebanon-home.jimdofree.com/', 
    target_age = '2～18歳',
    building = '', 
    capacity = 35, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 57;

UPDATE public.facility_access 
SET 
    location_address = '大阪府東大阪市西岩田1丁目2-8', 
    lat = 34.665098, 
    lng = 135.603983, 
    station = '若江岩田駅(近鉄奈良線)', 
    description = '近鉄奈良線「若江岩田」駅から徒歩6分', 
    location_appeal = '', 
    website_url = 'http://www.wakafukukai.com/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 37, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 58;

UPDATE public.facility_access 
SET 
    location_address = '大阪府堺市中区八田南之町219', 
    lat = 34.517611, 
    lng = 135.487147, 
    station = '八田西団地(南海バス)', 
    description = 'JR阪和線「津久野駅」から南海バス乗車「八田西団地」から徒歩8分', 
    location_appeal = '', 
    website_url = 'http://aiikusya.or.jp/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 60, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 59;

UPDATE public.facility_access 
SET 
    location_address = '大阪府堺市中区平井482', 
    lat = 34.516362, 
    lng = 135.497882, 
    station = '深井駅(南海泉北線)', 
    description = '南海泉北線「深井」駅より徒歩25分', 
    location_appeal = '', 
    website_url = 'http://www.nankokai.or.jp/izumigaokagakuin-index/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 80, 
    provisional_capacity = NULL, 
    relation_info = '地域とのつながりを大切にしており、子どもたちが通っている小学校と中学校の交流会などを開催しています。' 
WHERE facility_id = 60;

UPDATE public.facility_access 
SET 
    location_address = '大阪府堺市北区東上野芝町2-499', 
    lat = 34.551137, 
    lng = 135.484804, 
    station = '上野芝駅(JR阪和線)', 
    description = 'JR阪和線「上野芝」駅から徒歩10分', 
    location_appeal = '', 
    website_url = 'https://seishinryou.jp/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 36, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 61;

UPDATE public.facility_access 
SET 
    location_address = '大阪府堺市中区土塔町2028', 
    lat = 34.534659, 
    lng = 135.504613, 
    station = '深井駅(南海泉北線)', 
    description = '南海泉北線「深井」駅より徒歩15分', 
    location_appeal = '', 
    website_url = 'https://tokogakuen.com/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 90, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 62;

UPDATE public.facility_access 
SET 
    location_address = '大阪府大阪市港区池島2-5-52', 
    lat = 34.655352, 
    lng = 135.451382, 
    station = '朝潮橋駅(地下鉄中央線)', 
    description = '地下鉄中央線「朝潮橋駅」より徒歩8分', 
    location_appeal = '', 
    website_url = 'https://uminoko.org/ikejima/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 30, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 63;

UPDATE public.facility_access 
SET 
    location_address = '大阪府大阪市港区池島3-7-18', 
    lat = 34.654936, 
    lng = 135.448594, 
    station = '朝潮橋駅(大阪メトロ中央線)', 
    description = '大阪メトロ「朝潮橋駅」から徒歩8分', 
    location_appeal = '', 
    website_url = 'https://uminoko.org/iribune/', 
    target_age = '2～18歳', 
    building = '', 
    capacity = 80, 
    provisional_capacity = NULL, 
    relation_info = '' 
WHERE facility_id = 64;

UPDATE public.facility_access
SET
    location_address = '大阪府吹田市古江台6-2-1',
    lat = 34.814071,
    lng = 135.506409,
    station = '山田駅(阪急千里線/大阪モノレール)',
    description = '阪急千里線「山田」駅より徒歩10分',
    location_appeal = '閑静な住宅地でプライベートの外出もしやすい',
    website_url = 'https://kohsaimirai-nozomi.jp/',
    target_age = '2～18歳',
    building = '',
    capacity = 40,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 65;

UPDATE public.facility_access
SET
    location_address = '大阪府大阪市天王寺区城南寺町1-10',
    lat = 34.671118,
    lng = 135.523794,
    station = '谷町九丁目駅(大阪市営地下鉄)',
    description = '大阪市営地下鉄「谷町九丁目」駅より徒歩15分',
    location_appeal = '',
    website_url = 'http://www.kozu-gakuen.jp/kozu/',
    target_age = '2～18歳',
    building = '',
    capacity = 51,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 66;

UPDATE public.facility_access
SET
    location_address = '大阪府大阪市天王寺区逢阪2-8-41',
    lat = 34.652763,
    lng = 135.510623,
    station = '天王寺駅(JR/大阪メトロ)',
    description = '大阪メトロ「天王寺」駅から徒歩7分',
    location_appeal = '',
    website_url = 'https://www.shiongakuen.or.jp/',
    target_age = '2～18歳',
    building = '',
    capacity = 98,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 67;

UPDATE public.facility_access
SET
    location_address = '大阪府大阪市天王寺区逢阪2-8-43',
    lat = 34.652763,
    lng = 135.510623,
    station = '天王寺駅(JR/大阪メトロ)',
    description = '大阪メトロ「天王寺」駅から徒歩7分',
    location_appeal = '',
    website_url = 'https://www.shiongakuen.or.jp/chd2/',
    target_age = '2～18歳',
    building = '',
    capacity = 48,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 68;

UPDATE public.facility_access
SET
    location_address = '大阪府泉大津市松之浜町1-3-24',
    lat = 34.512213,
    lng = 135.415987,
    station = '松ノ浜駅(南海本線)',
    description = '南海本線「松ノ浜」駅より徒歩約5分',
    location_appeal = '',
    website_url = 'https://sukematsuryou.jp/',
    target_age = '2～18歳',
    building = '',
    capacity = 63,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 69;

UPDATE public.facility_access
SET
    location_address = '大阪府大阪市東住吉区南田辺4-5-2',
    lat = 34.618204,
    lng = 135.524293,
    station = '鶴ケ丘駅(JR阪和線)',
    description = 'JR阪和線「鶴ケ丘」駅より徒歩6分',
    location_appeal = '',
    website_url = 'https://seikazoku.com/seika/',
    target_age = '2～18歳',
    building = '',
    capacity = 50,
    provisional_capacity = NULL,
    relation_info = '医療看護機関や地域との「つながり」を大切にしています。'
WHERE facility_id = 70;

UPDATE public.facility_access
SET
    location_address = '大阪府大阪市生野区林寺5-11-24',
    lat = 34.645136,
    lng = 135.538589,
    station = '東部市場前駅(JR大和路線)',
    description = 'JR大和路線「東部市場前」駅から徒歩10分',
    location_appeal = '',
    website_url = 'https://tashimadouen.org/',
    target_age = '2～18歳',
    building = '',
    capacity = 36,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 71;

UPDATE public.facility_access
SET
    location_address = '大阪府大阪市淀川区十三元今里3-1-72',
    lat = 34.741468,
    lng = 135.482972,
    station = '十三駅(阪急電鉄)',
    description = '阪急電鉄「十三」駅から徒歩15分',
    location_appeal = '',
    website_url = 'https://www.hakuaisha-welfare.net/',
    target_age = '2～18歳',
    building = '鉄筋コンクリート造り',
    capacity = 117,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 72;

UPDATE public.facility_access
SET
    location_address = '大阪府大阪市天王寺区城南寺町1-10',
    lat = 34.671118,
    lng = 135.523794,
    station = '谷町九丁目駅(大阪市営地下鉄)',
    description = '大阪市営地下鉄「谷町九丁目」駅から徒歩15分',
    location_appeal = '',
    website_url = 'http://www.kozu-gakuen.jp/houon/',
    target_age = '2～18歳',
    building = '',
    capacity = 32,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 73;

-- ============================================================================
-- 7. 開発用管理者ユーザー
-- ============================================================================
-- 注: 実際の管理者作成は TypeScript スクリプトを使用してください
-- node --env-file=.env.local --import tsx src/lib/supabase/test/seed_adminuser.ts
--
-- このSQLファイルでは auth.users テーブルに直接アクセスできないため、
-- 管理者ユーザーの作成はスキップします

-- ============================================================================
-- Seed 完了
-- ============================================================================
-- 次のステップ:
-- 1. 大量の施設データを投入する場合:
--    node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility_details.ts
--
-- 2. 管理者ユーザーを作成する場合:
--    node --env-file=.env.local --import tsx src/lib/supabase/test/seed_adminuser.ts
--
-- 3. データのクリーンアップ:
--    supabase db reset (全データ削除 + マイグレーション再実行 + seed再実行)