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
-- 3. 兵庫県の施設データ
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
-- 4. 施設詳細データの更新
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
-- 3. 開発用管理者ユーザー
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