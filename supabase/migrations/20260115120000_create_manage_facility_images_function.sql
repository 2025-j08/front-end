-- manage_facility_images: 施設画像の一括更新（削除・追加）をトランザクション内で実行
-- ユニーク制約 (facility_id, display_order) 違反を防ぐため、削除を先に行う

CREATE OR REPLACE FUNCTION public.manage_facility_images(
    p_facility_id BIGINT,
    p_delete_ids BIGINT[] DEFAULT '{}',
    p_new_images JSONB DEFAULT '[]'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_deleted_urls TEXT[] := '{}';
    v_inserted_ids BIGINT[] := '{}';
    v_image JSONB;
    v_new_id BIGINT;
    v_deleted_url TEXT;
BEGIN
    -- 1. 削除対象の画像URLを取得（Storage削除用に返却）
    SELECT array_agg(image_url)
    INTO v_deleted_urls
    FROM facility_images
    WHERE id = ANY(p_delete_ids)
      AND facility_id = p_facility_id;

    -- 2. 画像を削除
    DELETE FROM facility_images
    WHERE id = ANY(p_delete_ids)
      AND facility_id = p_facility_id;

    -- 3. 新しい画像を挿入
    FOR v_image IN SELECT * FROM jsonb_array_elements(p_new_images)
    LOOP
        INSERT INTO facility_images (facility_id, image_type, image_url, display_order)
        VALUES (
            p_facility_id,
            v_image->>'image_type',
            v_image->>'image_url',
            (v_image->>'display_order')::INTEGER
        )
        RETURNING id INTO v_new_id;
        
        v_inserted_ids := array_append(v_inserted_ids, v_new_id);
    END LOOP;

    -- 4. 結果を返却
    RETURN jsonb_build_object(
        'deleted_urls', to_jsonb(COALESCE(v_deleted_urls, '{}')),
        'inserted_ids', to_jsonb(v_inserted_ids)
    );
END;
$$;

-- RLSバイパスのため SECURITY DEFINER を使用
-- 呼び出し元でのアクセス制御は別途行う

COMMENT ON FUNCTION public.manage_facility_images IS '施設画像の一括更新（削除・追加）をアトミックに実行するRPC関数';
