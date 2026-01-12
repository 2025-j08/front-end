-- ============================================================================
-- Supabase Seed Data
-- ============================================================================
-- このファイルは開発環境用のサンプルデータを投入します
-- 実行方法: supabase db seed
--
-- 注意:
-- - このファイルは冪等性を持つように設計されています（複数回実行可能）
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
-- 2. サンプル施設データ
-- ============================================================================
-- 注: 実際のデータ投入は TypeScript スクリプトを使用してください
-- node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility_details.ts
--
-- ここでは最小限のサンプルデータのみ投入します

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
    'サンプル児童養護施設A',
    'サンプル社会福祉法人A',
    '100-0001',
    '03-1234-5678',
    '東京都',
    '千代田区',
    '丸の内1-1-1',
    2000,
    NULL
  ),
  (
    2,
    'サンプル児童養護施設B',
    'サンプル社会福祉法人B',
    '530-0001',
    '06-1234-5678',
    '大阪府',
    '大阪市北区',
    '梅田1-1-1',
    1995,
    NULL
  ),
  (
    3,
    'サンプル児童養護施設C',
    'サンプル社会福祉法人C',
    '460-0001',
    '052-123-4567',
    '愛知県',
    '名古屋市中区',
    '錦1-1-1',
    2005,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. 施設と施設種類の紐づけ
-- ============================================================================
INSERT INTO public.facility_facility_types (facility_id, facility_type_id)
SELECT 1, id FROM public.facility_types WHERE name = '大舎'
UNION ALL
SELECT 2, id FROM public.facility_types WHERE name = '中舎'
UNION ALL
SELECT 3, id FROM public.facility_types WHERE name = '小舎'
ON CONFLICT (facility_id, facility_type_id) DO NOTHING;

-- ============================================================================
-- 4. 施設詳細データの更新
-- ============================================================================
-- 注: facility_detail_auto_creation トリガーにより、施設追加時に自動的に
-- 詳細テーブルのレコードが作成されるため、ここでは既存レコードを更新します

-- 4-1. アクセス情報
UPDATE public.facility_access
SET
  location_address = '東京都千代田区丸の内1-1-1',
  lat = 35.6812,
  lng = 139.7671,
  station = 'JR東京駅',
  description = '東京駅から徒歩5分',
  location_appeal = '都心部のアクセス良好な立地',
  website_url = 'https://example.com/facility-a',
  target_age = '0～18歳',
  building = '鉄筋コンクリート3階建',
  capacity = 30,
  provisional_capacity = 35,
  relation_info = '地域の学校や医療機関との連携が充実'
WHERE facility_id = 1;

UPDATE public.facility_access
SET
  location_address = '大阪府大阪市北区梅田1-1-1',
  lat = 34.7024,
  lng = 135.4959,
  station = 'JR大阪駅',
  description = '大阪駅から徒歩10分',
  location_appeal = '大阪の中心部に位置',
  website_url = 'https://example.com/facility-b',
  target_age = '0～18歳',
  building = '鉄筋コンクリート2階建',
  capacity = 20,
  provisional_capacity = 25,
  relation_info = '地域との交流イベントを定期開催'
WHERE facility_id = 2;

UPDATE public.facility_access
SET
  location_address = '愛知県名古屋市中区錦1-1-1',
  lat = 35.1706,
  lng = 136.9066,
  station = '地下鉄栄駅',
  description = '栄駅から徒歩8分',
  location_appeal = '名古屋の中心部でアクセス良好',
  website_url = 'https://example.com/facility-c',
  target_age = '0～18歳',
  building = '木造2階建',
  capacity = 15,
  provisional_capacity = 18,
  relation_info = '地域ボランティアとの協力体制'
WHERE facility_id = 3;

-- 4-2. 理念情報
UPDATE public.facility_philosophy
SET
  description = '子どもたち一人ひとりの個性を尊重し、愛情をもって育てます',
  message = '私たちは、子どもたちが安心して成長できる家庭的な環境を提供します'
WHERE facility_id = 1;

UPDATE public.facility_philosophy
SET
  description = '子どもたちの自立と社会参加を支援する',
  message = '地域社会と連携し、子どもたちの未来を創ります'
WHERE facility_id = 2;

UPDATE public.facility_philosophy
SET
  description = '家庭的な温かい雰囲気の中で、子どもたちの健やかな成長を支える',
  message = '一人ひとりに寄り添い、心の安定と成長を大切にします'
WHERE facility_id = 3;

-- 4-3. 特化領域情報
UPDATE public.facility_specialty
SET
  features = '心理ケア専門スタッフによる個別サポート体制が充実しています。また、学習支援プログラムも提供しており、子どもたちの学力向上を支援します。',
  programs = '週1回の心理カウンセリング、放課後学習支援、週末の体験活動プログラム'
WHERE facility_id = 1;

UPDATE public.facility_specialty
SET
  features = '職業訓練プログラムと進路支援に力を入れています。高校生には就職支援も行い、自立に向けたサポートを提供します。',
  programs = '職業体験プログラム、就職支援セミナー、資格取得支援'
WHERE facility_id = 2;

UPDATE public.facility_specialty
SET
  features = '少人数制で家庭的な雰囲気を重視しています。個別の成長に合わせたきめ細やかなケアを実践します。',
  programs = '個別学習支援、家庭的行事（誕生日会、季節行事）、地域交流活動'
WHERE facility_id = 3;

-- 4-4. 職員情報
UPDATE public.facility_staff
SET
  full_time_staff_count = 15,
  part_time_staff_count = 5,
  specialties = '児童福祉司、心理士、保育士',
  average_tenure = '8年',
  age_distribution = '20代: 3名、30代: 7名、40代: 5名、50代以上: 5名',
  work_style = 'シフト制、夜勤あり',
  has_university_lecturer = true,
  lecture_subjects = '児童福祉論',
  external_activities = '地域の福祉研修会への参加',
  qualifications_and_skills = '社会福祉士、精神保健福祉士、臨床心理士',
  internship_details = '大学生の実習受入れを積極的に実施'
WHERE facility_id = 1;

UPDATE public.facility_staff
SET
  full_time_staff_count = 10,
  part_time_staff_count = 3,
  specialties = '児童福祉司、保育士',
  average_tenure = '6年',
  age_distribution = '20代: 2名、30代: 5名、40代: 4名、50代以上: 2名',
  work_style = 'シフト制、夜勤あり',
  has_university_lecturer = false,
  lecture_subjects = NULL,
  external_activities = '地域の子育て支援活動',
  qualifications_and_skills = '社会福祉士、保育士',
  internship_details = '専門学校生の実習受入れ'
WHERE facility_id = 2;

UPDATE public.facility_staff
SET
  full_time_staff_count = 8,
  part_time_staff_count = 2,
  specialties = '保育士、児童指導員',
  average_tenure = '5年',
  age_distribution = '20代: 2名、30代: 4名、40代: 3名、50代以上: 1名',
  work_style = 'シフト制、夜勤あり',
  has_university_lecturer = false,
  lecture_subjects = NULL,
  external_activities = '地域ボランティア活動',
  qualifications_and_skills = '保育士、児童指導員',
  internship_details = NULL
WHERE facility_id = 3;

-- 4-5. 教育・進路支援
UPDATE public.facility_education
SET
  graduation_rate = '高校卒業率95%以上を維持',
  graduation_rate_percentage = '95',
  learning_support = '個別学習計画の作成、放課後学習支援、学習塾との連携',
  career_support = '進路相談、職場体験、就職支援、大学進学サポート'
WHERE facility_id = 1;

UPDATE public.facility_education
SET
  graduation_rate = '高校卒業率90%',
  graduation_rate_percentage = '90',
  learning_support = '学習ボランティアとの協力、オンライン学習教材の提供',
  career_support = '職業訓練プログラム、企業インターンシップ、就職フェア参加'
WHERE facility_id = 2;

UPDATE public.facility_education
SET
  graduation_rate = '高校卒業率85%',
  graduation_rate_percentage = '85',
  learning_support = '個別指導、学習環境の整備',
  career_support = '進路相談、職場見学、アフターケア'
WHERE facility_id = 3;

-- 4-6. 高機能化・多機能化
UPDATE public.facility_advanced
SET
  title = '心理ケア体制の充実',
  description = '心理専門職を配置し、トラウマインフォームドケアを実践',
  background = '複雑な背景を持つ子どもたちが増加している現状',
  challenges = '専門的なケアが必要な子どもへの対応',
  solutions = '心理士の常駐配置、スーパーバイズ体制の構築'
WHERE facility_id = 1;

UPDATE public.facility_advanced
SET
  title = '自立支援プログラムの強化',
  description = '18歳以降の自立を見据えた包括的支援プログラム',
  background = '退所後の生活困難が社会問題化',
  challenges = '生活スキルと就労スキルの習得',
  solutions = 'ライフスキルトレーニング、就労支援プログラムの実施'
WHERE facility_id = 2;

UPDATE public.facility_advanced
SET
  title = '地域連携の強化',
  description = '地域住民やボランティアとの協働による支援',
  background = '施設と地域の連携不足',
  challenges = '地域の理解と協力の獲得',
  solutions = '定期的な地域交流イベント、ボランティア受入れ'
WHERE facility_id = 3;

-- 4-7. その他情報
UPDATE public.facility_other
SET
  title = '施設の特色',
  description = '家庭的な雰囲気を大切にしながら、専門的なケアを提供',
  networks = '全国児童養護施設協議会、地域児童福祉ネットワーク',
  future_outlook = '小規模グループケアの拡充、地域分散化の推進',
  free_text = '見学や問い合わせはいつでも受け付けています。お気軽にご連絡ください。'
WHERE facility_id = 1;

UPDATE public.facility_other
SET
  title = '地域との連携',
  description = '地域に開かれた施設運営を目指しています',
  networks = '地域福祉協議会、NPO団体との連携',
  future_outlook = '地域拠点としての機能強化',
  free_text = '地域の皆様のご協力をお願いしています。'
WHERE facility_id = 2;

UPDATE public.facility_other
SET
  title = '家庭的養護',
  description = '小規模ユニットによる家庭的養護の実践',
  networks = '地域ボランティア団体',
  future_outlook = 'さらなる小規模化と家庭的環境の充実',
  free_text = NULL
WHERE facility_id = 3;

-- ============================================================================
-- 5. 開発用管理者ユーザー
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
