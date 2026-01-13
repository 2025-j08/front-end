-- ============================================================================
-- 滋賀県の施設データ
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
    (74, '守山学園', '社会福祉法人 ひかり会', '524-0004', '077-582-2887', '滋賀県', ' 守山市', '笠原町1257-1', 1959, '[]'),
    (75, '鹿深の家', '社会福祉法人  甲賀学園', '520-3402', '0748-88-2015', '滋賀県', '甲賀市甲賀町', '小佐治3571', 1962, '[]'),
    (76, '小鳩の家', '社会福祉法人 小鳩会', '520-0027', '077-522-4897', '滋賀県', '大津市 ', '錦織1-14-25', 1962, '[]'),
    (77, '湘南学園', '社会福祉法人 湘南学園', '520-0862', '077-537-0046', '滋賀県', '大津市', '平津2-4-9', 1904, '[]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 施設詳細データの更新
-- ============================================================================

-- 滋賀県 児童養護施設 詳細データ（id:74〜77）
UPDATE public.facility_access
SET
    location_address = '滋賀県守山市笠原町1257-1',
    lat = 35.092369,
    lng = 135.986107,
    station = '守山駅(JR琵琶湖線)',
    description = 'JR琵琶湖線「守山駅」より近江バス服部線「埋蔵文化センター」行・「野洲川歴史公園サッカー場」行き乗車「笠原」下車 徒歩5分',
    location_appeal = '',
    website_url = 'https://moriyama-gakuen.jp/',
    target_age = '2～18歳',
    building = '',
    capacity = 36,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 74;

UPDATE public.facility_access
SET
    location_address = '滋賀県甲賀市甲賀町小佐治3571',
    lat = 34.941561,
    lng = 136.213064,
    station = 'JR寺庄駅',
    description = 'JR寺庄駅より車で10分',
    location_appeal = '',
    website_url = 'https://kafuka-home.or.jp/',
    target_age = '2～18歳',
    building = '',
    capacity = 40,
    provisional_capacity = NULL,
    relation_info = '地域とのさらなる繋がりを重視し、地域に根差した施設づくりをおこなっています。'
WHERE facility_id = 75;

UPDATE public.facility_access
SET
    location_address = '滋賀県大津市錦織1-10-21',
    lat = 35.030322,
    lng = 135.854079,
    station = '近江神宮前駅(京阪電車)',
    description = '京阪電車(石坂線)「近江神宮前駅」より徒歩5分',
    location_appeal = '',
    website_url = 'https://kobatokai.or.jp/',
    target_age = '2～18歳',
    building = '',
    capacity = 42,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 76;

UPDATE public.facility_access
SET
    location_address = '滋賀県大津市平津2-4-9',
    lat = 34.952609,
    lng = 135.90389,
    station = 'ＪＲ石山駅・京阪石山寺駅',
    description = 'JR石山駅または京阪石山寺駅で下車1京阪バス(野々宮経由南郷二丁目東・新浜・大石小学校行き[52][53][54])に乗り、「滋賀大西門」を下車してすぐ',
    location_appeal = '',
    website_url = 'https://shonanhouse.com/',
    target_age = '2～18歳',
    building = '',
    capacity = 41,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 77;