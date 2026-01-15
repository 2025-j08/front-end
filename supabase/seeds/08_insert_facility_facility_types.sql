-- ============================================================================
-- 施設と施設種類の紐づけ
-- ============================================================================
INSERT INTO public.facility_facility_types (facility_id, facility_type_id)
SELECT 1, id FROM public.facility_types WHERE name = '大舎'
UNION ALL
SELECT 2, id FROM public.facility_types WHERE name = '中舎'
UNION ALL
SELECT 3, id FROM public.facility_types WHERE name = '小舎'
ON CONFLICT (facility_id, facility_type_id) DO NOTHING;