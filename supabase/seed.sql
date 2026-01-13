-- ============================================================================
-- Supabase Seed Data
-- ============================================================================
-- このファイルは開発環境用のサンプルデータを投入します
-- 実行方法: supabase db seed
--
-- 注意:
-- - このファイルは冪等性を持つように設計されています(複数回実行可能)
-- - 本番環境では実行しないでください
-- - 実際のデータは src/dummy_data/*.json を参照してください
-- ============================================================================

-- ============================================================================
-- 1. 施設種類マスタデータ
-- ============================================================================
INSERT INTO public.facility_types (name)
VALUES
    ('大舎'),
    ('中舎'),
    ('小舎'),
    ('グループホーム'),
    ('地域小規模')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- Supabase Seed Data
-- ============================================================================
-- このファイルは開発環境用のサンプルデータを投入します
-- 実行方法: supabase db seed
--
-- 注意:
-- - このファイルは冪等性を持つように設計されています(複数回実行可能)
-- - 本番環境では実行しないでください
-- - 実際のデータは src/dummy_data/*.json を参照してください
-- ============================================================================


-- ============================================================================
--  兵庫県の施設データ
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
  (
    1,
    '尼崎市尼崎学園',
    '尼崎市社会福祉事業団',
    '651-1502',
    '078-985-2133',
    '兵庫県',
    '神戸市北区道場町',
    '塩田3083',
    1946,
    '[]'
  ),
  (
    2,
    'アメニティホーム光都学園',
    '社会福祉法人 あいむ',
    '679-5165',
    '0791-58-1101',
    '兵庫県',
    'たつの市新宮町',
    '光都1-6-1',
    2007,
    '[{"name":"すずらん","type":"児童家庭支援センター"}]'
  ),
  (
    3,
    'アメニティホーム広畑学園',
    '社会福祉法人 あいむ',
    '671-1102',
    '079-236-1630',
    '兵庫県',
    '姫路市広畑区',
    '蒲田370-1',
    1949,
    '[]'
  ),
  (
    4,
    '淡路学園',
    '社会福祉法人 育世会',
    '656-0122',
    '0799-45-0412',
    '兵庫県',
    '南あわじ市広田',
    '広田637',
    1953,
    '[{"name":"あじさいホーム","type":"分園型小規模グループホーム"}]'
  ),
  (
    5,
    'いながわ子供の家',
    '社会福祉法人 神戸婦人同情会',
    '666-0243',
    '072-744-1880',
    '兵庫県',
    '川辺郡猪名川町',
    '柏梨田字イハノ谷10-9',
    2014,
    '[{"name":"キャンディ","type":"児童家庭支援センター"}]'
  ),
  (
    6,
    'カーサ汐彩',
    '社会福祉法人 立正学園',
    '673-0046',
    '078-939-2696',
    '兵庫県',
    '明石市',
    '藤が丘2-36-1 ',
    2017,
    '[{"name":"かりん", "type":"児童家庭支援センター"}]'
  ),
  (
    7,
    '子供の家',
    '社会福祉法人 神戸婦人同情会',
    '661-0974',
    '06-6491-8953',
    '兵庫県',
    '尼崎市',
    '若王寺3-16-3 ',
    1926,
    '[{"name":"キャンディ","type":"児童家庭支援センター"}]'
  ),
  (
    8,
    'さくらこども学園',
    '社会福祉法人 桜谷福祉会',
    '678-0255',
    '0791-46-0332',
    '兵庫県',
    '赤穂市',
    '新田1444番地',
    2010,
    '[]'
  ),
  (
    9,
    '三光塾',
    '社会福祉法人 三光事業団',
    '663-8125',
    '0798-41-4421',
    '兵庫県',
    '西宮市',
    '小松西町2-6-30',
    1946,
    '[{"name":"ひかり保育園","type":"幼保連携型認定こども園"}]'
  ),
  (
    10,
    '児童ホーム東光園',
    '社会福祉法人 心地',
    '670-0873',
    '079-222-5028',
    '兵庫県',
    '姫路市',
    '八代東光寺町8-1',
    1951,
    '[{"name":"乳児ホームるり","type":"乳児院"}]'
  ),
  (
    11,
    '聖智学園',
    '社会福祉法人 聖智の杜',
    '656-2131',
    '0799-62-4491',
    '兵庫県',
    '淡路市',
    '志筑1542-1 ',
    1955,
    '[]'
  ),
  (
    12,
    '善照学園',
    '社会福祉法人 善照学園',
    '651-1423',
    '078-904-3773',
    '兵庫県',
    '西宮市山口町',
    '船坂2128-1',
    1959,
    '[{"name":"船坂保育園","type":"幼保連携型認定こども園"}]'
  ),
  (
    13,
    '泉心学園',
    '社会福祉法人 泉心学園',
    '678-1203',
    '0791-52-0168',
    '兵庫県',
    '赤穂郡上郡町',
    '尾長谷536',
    1947,
    '[]'
  ),
  (
    14,
    '播磨同仁学院',
    '社会福祉法人 播磨同仁学院',
    '675-0112',
    '079-424-3278',
    '兵庫県',
    '加古川市平岡町',
    '山之上518',
    1955,
    '[{"name":"子供のお里","type":"幼保連携型認定こども園"}]'
  ),
  (
    15,
    'パルコミュニティハウス信和学園',
    '社会福祉法人 信和学園',
    '670-0883',
    '0792-22-6308',
    '兵庫県',
    '姫路市',
    '城北新町1-7-31',
    1955,
    '[]'
  ),
  (
    16,
    '二葉園',
    '社会福祉法人 夢前福祉会',
    '671-2134',
    '079-335-0012',
    '兵庫県',
    '姫路市夢前町',
    '管生澗673-1',
    1951,
    '[]'
  ),
  (
    17,
    '睦の家',
    '社会福祉法人 南但愛育会',
    '669-3826',
    '0795-87-5815',
    '兵庫県',
    '丹波市青垣町',
    '文室204-2',
    2013,
    '[{"name":"くれよん","type":"乳児院"}]'
  ),
  (
    18,
    '立正学園',
    '社会福祉法人 立正学園',
    '675-1202',
    '0794-38-0132',
    '兵庫県',
    '加古川市八幡町',
    '野村617-4',
    1956,
    '[{"name":"さつき子どもホーム","type":"地域小規模"}]'
  ),
  (
    19,
    '若草寮',
    '社会福祉法人 南但愛育会',
    '669-5112',
    '0796-76-2123',
    '兵庫県',
    '朝来市山東町',
    '大内547-1',
    1956,
    '[{"name":"くれよん","type":"乳児院"}]'
  ),
  (
    20,
    'アメニティホームルピナス高砂',
    '社会福祉法人 あいむ',
    '676-0827',
    '079-449-2112',
    '兵庫県',
    '高砂市阿弥陀町',
    '阿弥陀1163-1',
    2019,
    '[]'
  ),
  (
    21,
    '愛神愛隣舎',
    '社会福祉法人 愛神愛隣舎',
    '657-0834',
    '078-861-2462',
    '兵庫県',
    '神戸市灘区',
    '泉通4-4-5',
    1948,
    '[]'
  ),
  (
    22,
    '愛信学園',
    '社会福祉法人 共生会 ',
    '652-0016',
    '078-341-8934',
    '兵庫県',
    '神戸市兵庫区',
    '馬場町７番１４号',
    1945,
    '[{"name":"ももちかハウス","type":"地域小規模児童養護施設"}]'
  ),
  (
    23,
    'グイン・ホーム',
    '社会福祉法人  白百合学園',
    '651-1144',
    '078-593-6667',
    '兵庫県',
    '神戸市北区',
    '大脇台12-1',
    1967,
    '[{"name":"しらゆりホーム","type":"児童心理治療施設"}]'
  ),
  (
    24,
    '神戸実業学院',
    '社会福祉法人 基督教日本救霊隊神戸実業学院',
    '652-0002',
    '078-521-5478',
    '兵庫県',
    '兵庫区平野町',
    '天王谷奥東服山270',
    1948,
    '[]'
  ),
  (
    25,
    '神戸少年の町',
    '社会福祉法人 神戸少年の町',
    '655-0872',
    '078-751-2222',
    '兵庫県',
    '神戸市垂水区塩屋町',
    '梅木谷720',
    1948,
    '[]'
  ),
  (
    26,
    '神戸真生塾',
    '社会福祉法人 神戸真生塾',
    '650-0004',
    '078-341-5897',
    '兵庫県',
    '神戸市中央区',
    '中山手通7-25-38',
    1948,
    '[{"name":"真生乳児院","type":"乳児院"}]'
  ),
  (
    27,
    '信愛学園',
    '社会福祉法人 信愛学園',
    '658-0047',
    '078-851-6128',
    '兵庫県',
    '神戸市東灘区',
    '御影3-28-1',
    1948,
    '[{"name":"御影乳児院","type":"乳児院"}]'
  ),
  (
    28,
    '神愛子供ホーム',
    '社会福祉法人 神愛子供ホーム',
    '658-0063',
    '078-811-8698',
    '兵庫県',
    '神戸市東灘区',
    '住吉山手4-7-35',
    1950,
    '[]'
  ),
  (
    29,
    '天王谷学園',
    '社会福祉法人 天王谷学園',
    '651-1621',
    '078-958-0302',
    '兵庫県',
    '神戸市北区淡河町',
    '神影115',
    1948,
    '[]'
  ),
  (
    30,
    '同朋学園',
    '社会福祉法人 同朋福祉会',
    '657-0068',
    '078-801-6301',
    '兵庫県',
    '神戸市灘区',
    '篠原北町4-8-1',
    1950,
    '[]'
  ),
  (
    31,
    '双葉学園',
    '社会福祉法人 神戸協和会',
    '657-0011',
    '078-841-2792',
    '兵庫県',
    '神戸市灘区',
    '鶴甲1-5-1',
    1946,
    '[]'
  ),
  (
    32,
    '長田こどもホーム',
    '社会福祉法人 明星寮',
    '653-0803',
    '078-691-7210',
    '兵庫県',
    '神戸市長田区',
    '前原町1-21-18',
    1949,
    '[{"name":"めいせい","type":"小規模保育園"}]'
  ),
  (
    33,
    '夢野こどもホーム',
    '社会福祉法人 神戸光有会',
    '652-0063',
    '078-511-3445',
    '兵庫県',
    '神戸市兵庫区',
    '夢野町4-3-13',
    1948,
    '[]'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
--  大阪府の施設データ
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
    (34, 'あおぞら', '社会福祉法人 阪南福祉事業会', '596-0808', '072-444-0100', '大阪府', '岸和田市', '三田町614-1', 2008, '[]'),
    (35, 'あんだんて', '社会福祉法人 阪南福祉事業会', '596-0808', '072-440-0300', '大阪府', '岸和田市', '三田町810-1', 2020, '[]'),
    (36, '生駒学園', '社会福祉法人 生駒学院', '579-8014', '0729-81-1005', '大阪府', '東大阪市', '中石切町2-5-5', 1952, '[]'),
    (37, '和泉幼児院', '社会福祉法人 和泉幼児院', '595-0071', '0725-33-2227', '大阪府', '泉大津市', '助松町3-8-7', 1952, '[]'),
    (38, '大阪西本願寺常照園', '社会福祉法人 大阪西本願寺常照園', '564-0063', '06-6384-0867', '大阪府', '吹田市', '江坂町3-40-24', 1949, '[]'),
    (39, 'ガーデンロイ', '社会福祉法人 イエス団', '579-8052', '072-985-4773', '大阪府', '東大阪市', '上四条町24-23', 2010, '[]'),
    (40, '岸和田学園', '社会福祉法人 阪南福祉事業会', '596-0808', '0724-45-0710', '大阪府', '岸和田市', '三田町911', 1933, '[]'),
    (41, '救世軍希望館', '社会福祉法人 救世軍社会事業団', '567-0034', '0726-23-3758', '大阪府', '茨木市', '中穂積2-16-11', 1949, '[]'),
    (42, '公徳学園', '社会福祉法人 公徳会', '577-0025', '06-6781-0236', '大阪府', '東大阪市', '新家3-7-8', 1923, '[]'),
    (43, '子どもの家', '社会福祉法人 慶徳会', '567-0048', '072-622-5030', '大阪府', '茨木市', '北春日丘1-3-38', 1948, '[]'),
    (44, '信太学園', '社会福祉法人 高津学園', '594-0003', '0725-41-0559', '大阪府', '和泉市', '太町376', 1953, '[]'),
    (45, '松柏学園', '社会福祉法人 松柏会', '564-0063', '06-6368-6010', '大阪府', '吹田市', '江坂町4-20-1',1946, '[]'),
    (46, '女子慈教寮', '社会福祉法人 女子慈教寮', '594-0083', '0725-41-1009', '大阪府', '和泉市', '池上町3-6-62', 1949, '[]'),
    (47, '聖ヨハネ学園', '社会福祉法人 聖ヨハネ学園', '569-1032', '0726-87-0541', '大阪府', '高槻市', '宮之川原2-9-1', 1952, '[]'),
    (48, '高鷲学園', '社会福祉法人 大阪福祉事業財団', '583-0885', '0729-53-3881', '大阪府', '羽曳野市', '南恵我之荘2-6-20', 1948, '[]'),
    (49, '武田塾', '社会福祉法人 武田塾', '582-0015', '0729-77-3861', '大阪府', '柏原市', '大字高井田1020-59', 1926, '[]'),
    (50, '翼', '社会福祉法人 大阪水上隣保館', '561-0893', '06-6210-6661', '大阪府', '豊中市', '宝山町16-8', 2018, '[]'),
    (51, '奈佐原寮', '社会福祉法人 奈佐原寮', '569-1043', '0726-96-0214', '大阪府', '高槻市', '奈佐原元町17-23', 1948, '[]'),
    (52, '南河学園', '社会福祉法人 南河学園', '582-0021', '0729-75-2200', '大阪府', '柏原市', '国分本町7-6-14', 1925, '[]'),
    (53, '花園精舎', '社会福祉法人 花園精舎', '578-0924', '0729-62-2132', '大阪府', '東大阪市', '吉田5-15-14', 1949, '[]'),
    (54, '羽曳野荘', '社会福祉法人 羽曳野荘', '583-0868', '072-956-2102', '大阪府', '羽曳野市', '学園前1-1-3', 1950, '[]'),
    (55, '遙学園', '社会福祉法人 大阪水上隣保館', '618-0001', '075-961-0041', '大阪府', '三島郡', '島本町山崎5-3-18', 1931, '[]'),
    (56, '三ケ山学園', '社会福祉法人 三ケ山学園', '597-0046', '072-447-0611', '大阪府', '貝塚市', '東山2-1-1', 1979, '[]'),
    (57, 'レバノンホーム', '社会福祉法人 レバノンホーム', '567-0001', '072-643-5145', '大阪府', '茨木市', '安威1-7-21', 1952, '[]'),
    (58, '若江学院', '社会福祉法人 若福会', '578-0947', '072-962-1808', '大阪府', '東大阪市', '西岩田1-2-8', 1931, '[]'),
    (59, '愛育社', '社会福祉法人 愛育社', '599-8263', '072-278-5856', '大阪府', '堺市中区', '八田南之町219', 1886, '[]'),
    (60, '泉ヶ丘学院', '社会福祉法人 南湖会', '599-8251', '072-278-0374', '大阪府', '堺市中区', '平井482', 1958, '[]'),
    (61, '清心寮', '社会福祉法人 大阪児童福祉事業協会', '591-8035', '072-252-2794', '大阪府', '堺市北区', '東上野芝町2-499', 1964, '[]'),
    (62, '東光学園', '社会福祉法人 東光学園', '599-8234', '072-237-6161', '大阪府', '堺市中区', '土塔町2028', 1952, '[]'),
    (63, '池島寮', '社会福祉法人 海の子学園', '552-0015', '06-6571-0200', '大阪府', '大阪市港区', '池島2-5-52', 1978, '[]'),
    (64, '入舟寮', '社会福祉法人 海の子学園', '552-0015', '06-6571-1000', '大阪府', '大阪市港区', '池島3-7-18', 1949, '[]'),
    (65, '弘済みらい園', '社会福祉法人 みおつくし福祉会', '565-0874', '06-6871-8011', '大阪府', '吹田市', '古江台6-2-1', 2006, '[]'),
    (66, '高津学園', '社会福祉法人 高津学園', '543-0017', '06-6761-1663', '大阪府', '大阪市天王寺区', '城南寺町1-10', 1948, '[]'),
    (67, '四恩学園', '社会福祉法人 四恩学園', '543-0062', '06-6771-9360', '大阪府', '大阪市天王寺区', '逢阪2-8-41', 1948, '[]'),
    (68, '四恩たまみず園', '社会福祉法人 四恩学園', '543-0062', '06-6771-9360', '大阪府', '大阪市天王寺区', '逢阪2-8-43', 2015, '[]'),
    (69, '助松寮', '社会福祉法人 みおつくし福祉会', '595-0072', '0725-22-5956', '大阪府', '泉大津市', '松之浜町1-3-24', 1946, '[]'),
    (70, '聖家族の家', '社会福祉法人 聖家族の家', '546-0033', '06-6699-7221', '大阪府', '大阪市東住吉区', '南田辺4-5-2', 1947, '[]'),
    (71, '田島童園', '社会福祉法人 田島童園', '544-0023', '06-6731-2321', '大阪府', '大阪市生野区', '林寺5-11-24', 1932, '[]'),
    (72, '博愛社', '社会福祉法人 博愛社', '532-0028', '06-6301-0367', '大阪府', '大阪市淀川区', '十三元今里3-1-72', 1890, '[]'),
    (73, '報恩寮', '社会福祉法人 高津学園', '543-0017', '06-6761-1663', '大阪府', '大阪市天王寺区', '城南寺町1-10', 2020, '[]')
ON CONFLICT (id) DO NOTHING;

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
-- 4. 施設と施設種類の紐づけ
-- ============================================================================
INSERT INTO public.facility_facility_types (facility_id, facility_type_id)
SELECT 1, id FROM public.facility_types WHERE name = '大舎'
UNION ALL
SELECT 2, id FROM public.facility_types WHERE name = '中舎'
UNION ALL
SELECT 3, id FROM public.facility_types WHERE name = '小舎'
ON CONFLICT (facility_id, facility_type_id) DO NOTHING;

-- ============================================================================
-- 5. 施設詳細データの更新
-- ============================================================================

-- アクセス情報
UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市北区道場町塩田3083番地',
  lat = 34.875325,
  lng = 135.24803,
  station = '道場駅(JR福知山線)',
  description = 'JR福知山線「道場」駅より歩いて約18分',
  location_appeal = '澄んだ空気と清らかな水、自然豊かな田園風景',
  website_url = 'https://www.amashaji.jp/',
  target_age = '0～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 45,
  provisional_capacity = NULL,
  relation_info = '地域の学校やこども家庭支援センターとの連携を強化し、地域の子ども家庭支援課や里親支援機関とも協力しながら、子どもたちが地域社会の一員として安心して成長できるような支援体制を構築しています。'
WHERE facility_id = 1;

UPDATE public.facility_access
SET
  location_address = '兵庫県たつの市新宮町光都1-6-1',
  lat = 34.913292,
  lng = 134.462623,
  station = '北管理棟(神姫バス)',
  description = '北管理棟駅から徒歩15分',
  location_appeal = '豊かな緑と揖保川の清流',
  website_url = 'https://www.aimu-wel.or.jp/',
  target_age = '2～18歳',
  building = '',
  capacity = 35,
  provisional_capacity = NULL,
  relation_info = '地域との交流イベントを定期的に開催し、地域住民やボランティアとの積極的な交流を通じて、子どもたちが多様な人々と関わりながら社会性を育むことができるよう努めています。'
WHERE facility_id = 2;

UPDATE public.facility_access
SET
  location_address = '兵庫県姫路市広畑区蒲田370-1',
  lat = 34.834554,
  lng = 134.647352,
  station = '播磨高岡駅(JR姫新線)',
  description = '播磨高岡駅から車で7分',
  location_appeal = '住宅街の中にありながら、自然あふれる広い敷地でのびのびと',
  website_url = 'https://www.aimu-wel.or.jp/',
  target_age = '2～18歳',
  building = '',
  capacity = 35,
  provisional_capacity = NULL,
  relation_info = '地域ボランティアとの協力体制を築き、地域社会とのつながりを大切にしながら、子どもたちが地域の一員として成長できるような環境づくりに取り組んでいます。'
WHERE facility_id = 3;

UPDATE public.facility_access
SET
  location_address = '兵庫県南あわじ市広田広田637',
  lat = 34.323568,
  lng = 134.832069,
  station = '淡路学園前(南あわじ市コミュニティ)',
  description = '淡路学園前から徒歩1分',
  location_appeal = '淡路島の豊かな自然に囲まれて',
  website_url = 'https://awagaku.com/',
  target_age = '2～18歳',
  building = '',
  capacity = 40,
  provisional_capacity = NULL,
  relation_info = '地域の子育て支援に貢献するため、地域の子育て家庭や関係機関と連携し、子どもたちが地域社会の中で安心して生活し、成長できるような支援体制を整えています。'
WHERE facility_id = 4;

UPDATE public.facility_access
SET
  location_address = '兵庫県川辺郡猪名川町柏梨田字イハノ谷10-9',
  lat = 34.899143,
  lng = 135.37627,
  station = '柏梨田バス停留所(阪急バス 日生中央のりば1番 22系統)',
  description = '柏梨田バス停留所から徒歩5分',
  location_appeal = '自然豊かな環境',
  website_url = 'https://www.kodomono-ie.jp/cn6/i-top.html',
  target_age = '2～18歳',
  building = '',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の行事やイベントへの参加、地域住民との交流を通じて、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 5;

UPDATE public.facility_access
SET
  location_address = '兵庫県明石市藤が丘2丁目36-1',
  lat = 34.665746,
  lng = 134.944302,
  station = '藤江駅(山陽電鉄)',
  description = '藤江駅より徒歩7分',
  location_appeal = '明石海峡大橋が見える高台',
  website_url = 'https://risshougakuen.org/casa.html',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建て',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域ボランティアとの連携を通じて、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 6;

UPDATE public.facility_access
SET
  location_address = '兵庫県尼崎市若王寺3-16-3',
  lat = 34.75157,
  lng = 135.436372,
  station = 'JR尼崎駅(JR神戸線)',
  description = 'JR尼崎駅から徒歩約15分',
  location_appeal = '閑静な住宅街に位置し、近隣に公園や公共施設が充実',
  website_url = 'https://www.kodomono-ie.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造3階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の子育て支援活動や自治会との連携を通じて、地域住民との交流や協力体制を築き、子どもたちが地域社会の一員として成長できるような環境づくりに積極的に取り組んでいます。'
WHERE facility_id = 7;

UPDATE public.facility_access
SET
  location_address = '兵庫県赤穂市新田1444番地',
  lat = 34.767328,
  lng = 134.368998,
  station = 'JR播州赤穂駅',
  description = 'JR播州赤穂駅から車で10分',
  location_appeal = '自然豊かな環境と広い敷地',
  website_url = 'https://www.sakurakodomo.or.jp/',
  target_age = '2～18歳',
  building = '鉄骨造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域行事への参加や地元ボランティアとの交流を通じて、地域社会とのつながりを深め、子どもたちが多様な人々と関わりながら社会性を育むことができるよう努めています。'
WHERE facility_id = 8;

UPDATE public.facility_access
SET
  location_address = '兵庫県西宮市小松西町2-6-30',
  lat = 34.719227,
  lng = 135.375815,
  station = '阪神武庫川駅',
  description = '阪神武庫川駅から徒歩12分',
  location_appeal = '交通アクセス良好で生活利便性が高い',
  website_url = 'https://www.sankou-juku.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 40,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を強化し、子どもたちが地域社会の中で安心して生活し、さまざまな体験を通じて成長できるような支援体制を整えています。'
WHERE facility_id = 9;

UPDATE public.facility_access
SET
  location_address = '兵庫県姫路市八代東光寺町8-1',
  lat = 34.845049,
  lng = 134.694544,
  station = 'JR姫路駅',
  description = 'JR姫路駅からバスで15分',
  location_appeal = '市街地に近く利便性が高い',
  website_url = 'https://www.toukouen.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や医療機関との連携を通じて、子どもたちの健やかな成長と福祉の向上を目指し、地域社会全体で子どもたちを支える体制づくりに努めています。'
WHERE facility_id = 10;

UPDATE public.facility_access
SET
  location_address = '兵庫県淡路市志筑1542-1',
  lat = 34.44209,
  lng = 134.897068,
  station = '志筑バス停',
  description = '志筑バス停から徒歩5分',
  location_appeal = '淡路島の自然に囲まれた静かな環境',
  website_url = 'https://www.seichigakuen.or.jp/',
  target_age = '2～18歳',
  building = '鉄骨造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域行事への参加や地元住民との交流を積極的に行い、地域社会とのつながりを大切にしながら、子どもたちが地域の一員として成長できるような環境づくりに取り組んでいます。'
WHERE facility_id = 11;

UPDATE public.facility_access
SET
  location_address = '兵庫県西宮市山口町船坂2128-1',
  lat = 34.815076,
  lng = 135.269764,
  station = 'JR西宮名塩駅',
  description = 'JR西宮名塩駅から車で15分',
  location_appeal = '山間部の自然に囲まれた静かな環境',
  website_url = 'https://www.zensho.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の福祉団体や自治会との連携を通じて、地域社会との協力関係を築き、子どもたちが地域の中で安心して生活し、社会性を身につけられるような支援を行っています。'
WHERE facility_id = 12;

UPDATE public.facility_access
SET
  location_address = '兵庫県赤穂郡上郡町尾長谷536',
  lat = 34.890334,
  lng = 134.374213,
  station = 'JR上郡駅',
  description = 'JR上郡駅から車で10分',
  location_appeal = '自然豊かな田園地帯',
  website_url = 'https://www.senshin.or.jp/',
  target_age = '2～18歳',
  building = '鉄骨造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を深め、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 13;

UPDATE public.facility_access
SET
  location_address = '兵庫県加古川市平岡町山之上518',
  lat = 34.727711,
  lng = 134.870197,
  station = 'JR東加古川駅',
  description = 'JR東加古川駅から車で10分',
  location_appeal = '交通アクセス良好で生活利便性が高い',
  website_url = 'https://www.doujin.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 40,
  provisional_capacity = NULL,
  relation_info = '地域行事への参加や地元住民との交流を通じて、地域社会とのつながりを大切にし、子どもたちが地域の一員として社会性を育むことができるよう努めています。'
WHERE facility_id = 14;

UPDATE public.facility_access
SET
  location_address = '兵庫県姫路市城北新町1-7-31',
  lat = 34.853496,
  lng = 134.694979,
  station = 'JR姫路駅',
  description = 'JR姫路駅からバスで20分',
  location_appeal = '市街地に近く利便性が高い',
  website_url = 'https://www.shinwa.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や医療機関との連携を通じて、子どもたちの健やかな成長と福祉の向上を目指し、地域社会全体で子どもたちを支える体制づくりに努めています。'
WHERE facility_id = 15;

UPDATE public.facility_access
SET
  location_address = '兵庫県姫路市夢前町管生澗673-1',
  lat = 34.90281,
  lng = 134.63985,
  station = 'JR姫路駅',
  description = 'JR姫路駅から車で20分',
  location_appeal = '交通アクセス良好で生活利便性が高い',
  website_url = 'https://www.futabaen.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を強化し、子どもたちが地域社会の中で安心して生活し、さまざまな体験を通じて成長できるような支援体制を整えています。'
WHERE facility_id = 16;

UPDATE public.facility_access
SET
  location_address = '兵庫県丹波市青垣町文室204-2',
  lat = 35.144399,
  lng = 135.043692,
  station = 'JR石生駅',
  description = 'JR石生駅から車で20分',
  location_appeal = '山間部の自然に囲まれた静かな環境',
  website_url = 'https://www.mutsunoya.or.jp/',
  target_age = '2～18歳',
  building = '鉄骨造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域行事への参加や地元住民との交流を積極的に行い、地域社会とのつながりを大切にしながら、子どもたちが地域の一員として成長できるような環境づくりに取り組んでいます。'
WHERE facility_id = 17;

UPDATE public.facility_access
SET
  location_address = '兵庫県加古川市八幡町野村617-4',
  lat = 34.822093,
  lng = 134.911898,
  station = 'JR加古川駅',
  description = 'JR加古川駅から車で15分',
  location_appeal = '市街地に近く利便性が高い',
  website_url = 'https://www.risshougakuen.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や医療機関との連携を通じて、子どもたちの健やかな成長と福祉の向上を目指し、地域社会全体で子どもたちを支える体制づくりに努めています。'
WHERE facility_id = 18;

UPDATE public.facility_access
SET
  location_address = '兵庫県朝来市山東町大内547-1',
  lat = 35.343608,
  lng = 134.838644,
  station = 'JR和田山駅',
  description = 'JR和田山駅から車で15分',
  location_appeal = '自然豊かな田園地帯',
  website_url = 'https://www.wakakusa.or.jp/',
  target_age = '2～18歳',
  building = '鉄骨造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を深め、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 19;

UPDATE public.facility_access
SET
  location_address = '兵庫県高砂市阿弥陀町阿弥陀1163-1',
  lat = 34.799333,
  lng = 134.775609,
  station = 'JR宝殿駅',
  description = 'JR宝殿駅から車で10分',
  location_appeal = '自然豊かな環境と広い敷地',
  website_url = 'https://www.aimu-wel.or.jp/',
  target_age = '2～18歳',
  building = '鉄骨造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域行事への参加や地元ボランティアとの交流を通じて、地域社会とのつながりを深め、子どもたちが多様な人々と関わりながら社会性を育むことができるよう努めています。'
WHERE facility_id = 20;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市灘区泉通4-4-5',
  lat = 34.767476,
  lng = 135.246175,
  station = '阪急王子公園駅',
  description = '阪急王子公園駅から徒歩7分',
  location_appeal = '閑静な住宅街に立地',
  website_url = 'https://www.aishinairinsha.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造3階建',
  capacity = 40,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を強化し、子どもたちが地域社会の中で安心して生活し、さまざまな体験を通じて成長できるような支援体制を整えています。'
WHERE facility_id = 21;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市兵庫区馬場町7-14',
  lat = 34.688338,
  lng = 135.170872,
  station = '神戸市営地下鉄大倉山駅',
  description = '大倉山駅から徒歩8分',
  location_appeal = '神戸の中心部に近い利便性',
  website_url = 'https://www.kyouseikai.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造3階建',
  capacity = 40,
  provisional_capacity = NULL,
  relation_info = '地域の子育て支援団体と連携し、子どもたちが地域社会の中で多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 22;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市北区大脇台12-1',
  lat = 34.738104,
  lng = 135.16338,
  station = '神戸電鉄北鈴蘭台駅',
  description = '北鈴蘭台駅から徒歩15分',
  location_appeal = '緑豊かな住宅地',
  website_url = 'https://www.shirayurigakuen.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域ボランティアとの交流を通じて、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 23;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市兵庫区平野町天王谷奥東服山270',
  lat = 34.710379,
  lng = 135.165728,
  station = '神戸市バス平野町バス停',
  description = '平野町バス停から徒歩10分',
  location_appeal = '自然に囲まれた静かな環境',
  website_url = 'https://www.kobe-jitsugakuin.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を深め、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 24;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市垂水区塩屋町梅木谷720',
  lat = 34.641979,
  lng = 135.078386,
  station = 'JR塩屋駅',
  description = 'JR塩屋駅から徒歩20分',
  location_appeal = '自然豊かな丘陵地',
  website_url = 'https://www.kobeshounen.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 40,
  provisional_capacity = NULL,
  relation_info = '地域行事への参加や地元住民との交流を積極的に行い、地域社会とのつながりを大切にしながら、子どもたちが地域の一員として成長できるような環境づくりに取り組んでいます。'
WHERE facility_id = 25;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市中央区中山手通7-25-38',
  lat = 34.688337,
  lng = 135.175004,
  station = '神戸市営地下鉄大倉山駅',
  description = '大倉山駅から徒歩10分',
  location_appeal = '神戸中心部の住宅街',
  website_url = 'https://www.kobe-shinseijuku.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造3階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を強化し、子どもたちが地域社会の中で安心して生活し、さまざまな体験を通じて成長できるような支援体制を整えています。'
WHERE facility_id = 26;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市東灘区御影3-28-1',
  lat = 34.722539,
  lng = 135.255417,
  station = '阪急御影駅',
  description = '阪急御影駅から徒歩10分',
  location_appeal = '閑静な住宅街',
  website_url = 'https://www.shinaigakuen.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を深め、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 27;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市東灘区住吉山手4-7-35',
  lat = 34.73532,
  lng = 135.252935,
  station = '阪急御影駅',
  description = '阪急御影駅から徒歩15分',
  location_appeal = '六甲山のふもと、自然豊かな環境',
  website_url = 'https://www.shinaikodomo.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を強化し、子どもたちが地域社会の中で安心して生活し、さまざまな体験を通じて成長できるような支援体制を整えています。'
WHERE facility_id = 28;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市北区淡河町神影115',
  lat = 34.830894,
  lng = 135.140169,
  station = '神戸電鉄道場駅',
  description = '道場駅から車で15分',
  location_appeal = '自然豊かな田園地帯',
  website_url = 'https://www.tennodani.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を深め、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 29;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市灘区篠原北町4-8-1',
  lat = 34.721183,
  lng = 135.223487,
  station = '阪急六甲駅',
  description = '阪急六甲駅から徒歩15分',
  location_appeal = '六甲山のふもと、閑静な住宅街',
  website_url = 'https://www.douhou.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を強化し、子どもたちが地域社会の中で安心して生活し、さまざまな体験を通じて成長できるような支援体制を整えています。'
WHERE facility_id = 30;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市灘区鶴甲1-5-1',
  lat = 34.738725,
  lng = 135.235142,
  station = '阪急六甲駅',
  description = '阪急六甲駅からバスで10分',
  location_appeal = '六甲山のふもと、自然豊かな環境',
  website_url = 'https://www.futabagakuen.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を深め、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 31;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市長田区前原町1-21-18',
  lat = 34.674297,
  lng = 135.1527,
  station = '神戸市営地下鉄長田駅',
  description = '長田駅から徒歩10分',
  location_appeal = '市街地に近く利便性が高い',
  website_url = 'https://www.nagatakodomo.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を強化し、子どもたちが地域社会の中で安心して生活し、さまざまな体験を通じて成長できるような支援体制を整えています。'
WHERE facility_id = 32;

UPDATE public.facility_access
SET
  location_address = '兵庫県神戸市兵庫区夢野町4-3-13',
  lat = 34.684486,
  lng = 135.157737,
  station = '神戸市営地下鉄湊川公園駅',
  description = '湊川公園駅から徒歩15分',
  location_appeal = '閑静な住宅街',
  website_url = 'https://www.yumenokodomo.or.jp/',
  target_age = '2～18歳',
  building = '鉄筋コンクリート造2階建',
  capacity = 30,
  provisional_capacity = NULL,
  relation_info = '地域の学校や福祉施設との連携を深め、子どもたちが地域社会の一員として多様な人々と関わりながら成長できるよう、地域との協働や交流活動を積極的に推進しています。'
WHERE facility_id = 33;
    

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
    station = 'JR石山駅・京阪石山寺駅',
    description = 'JR石山駅または京阪石山寺駅で下車1京阪バス(野々宮経由南郷二丁目東・新浜・大石小学校行き[52][53][54])に乗り、「滋賀大西門」を下車してすぐ',
    location_appeal = '',
    website_url = 'https://shonanhouse.com/',
    target_age = '2～18歳',
    building = '',
    capacity = 41,
    provisional_capacity = NULL,
    relation_info = ''
WHERE facility_id = 77;

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