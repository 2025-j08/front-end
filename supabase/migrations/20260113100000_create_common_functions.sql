-- =============================================================================
-- 001: 共通関数の定義
-- =============================================================================
-- このファイルは最初に実行されることを想定しています
-- =============================================================================

-- updated_at カラムを自動更新する汎用関数
-- 全テーブルで使用可能
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS
'updated_at カラムを現在時刻で自動更新する汎用トリガー関数。
レコード更新時に BEFORE UPDATE トリガーで呼び出されることを想定。';
