-- シーケンスリセット用のRPC関数
-- IDを明示的に指定してINSERTした場合、シーケンスが追従しないため、
-- 新規追加時にIDが衝突する問題を防ぐためのユーティリティ関数

-- facilities テーブルのシーケンスをリセット
CREATE OR REPLACE FUNCTION public.reset_facilities_sequence()
RETURNS void AS $$
BEGIN
  PERFORM setval('facilities_id_seq', COALESCE((SELECT MAX(id) FROM public.facilities), 1));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- facility_types テーブルのシーケンスをリセット
CREATE OR REPLACE FUNCTION public.reset_facility_types_sequence()
RETURNS void AS $$
BEGIN
  PERFORM setval('facility_types_id_seq', COALESCE((SELECT MAX(id) FROM public.facility_types), 1));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- コメント
COMMENT ON FUNCTION public.reset_facilities_sequence() IS 'facilities テーブルのIDシーケンスを最大値にリセット';
COMMENT ON FUNCTION public.reset_facility_types_sequence() IS 'facility_types テーブルのIDシーケンスを最大値にリセット';
