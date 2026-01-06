CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のみ閲覧可能
CREATE POLICY "select_owner"
    ON public.profiles
    FOR SELECT
    USING (id = auth.uid());

-- サービスロールのみ更新可能
CREATE POLICY "update_service_role"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- WITH CHECK: 更新後も値を検証している

CREATE POLICY "delete_service_role"
    ON public.profiles
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'service_role');

-- auth.users登録時にprofilesテーブルへ自動挿入
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql

-- INSERTポリシーを迂回してINSERT文を実行
SECURITY DEFINER
SET search_path = ''

AS $$
BEGIN
    INSERT INTO public.profiles (id, name)
    VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'name', 'Guest'));
    RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- updated_atカラムを自動更新
CREATE OR REPLACE FUNCTION public.update_profiles_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    new.updated_at = now();
    RETURN new;
END;
$$;

-- 更新処理に際してupdated_atを自動更新するトリガー
CREATE TRIGGER update_profiles_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profiles_timestamp();