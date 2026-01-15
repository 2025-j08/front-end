-- ============================================================================
-- シーケンスのリセット
-- ============================================================================

SELECT setval('facilities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.facilities));
SELECT setval('facility_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.facility_types));