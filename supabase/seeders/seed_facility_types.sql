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
-- 2. 施設と施設種類の紐づけ
-- ============================================================================
INSERT INTO public.facility_facility_types (facility_id, facility_type_id)
SELECT 1, id FROM public.facility_types WHERE name = '大舎'
UNION ALL
SELECT 2, id FROM public.facility_types WHERE name = '中舎'
UNION ALL
SELECT 3, id FROM public.facility_types WHERE name = '小舎'
ON CONFLICT (facility_id, facility_type_id) DO NOTHING;