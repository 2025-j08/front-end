-- ============================================================================
-- シーケンスのリセット
-- - IDを明示的に指定してINSERTした場合、シーケンスが追従しない
-- - そのため、新規追加時にIDが衝突する問題を防ぐためリセットする
-- ============================================================================

SELECT setval('facilities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.facilities));
SELECT setval('facility_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.facility_types));