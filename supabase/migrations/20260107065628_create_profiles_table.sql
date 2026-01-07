-- profiles テーブル
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- RLSを有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のプロフィールのみ閲覧可能
CREATE POLICY "select_owner"
    ON public.profiles
    FOR SELECT
    USING (id = auth.uid());

-- サービスロールのみ更新可能（ロール変更の保護）
CREATE POLICY "update_service_role"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- サービスロールのみ削除可能
CREATE POLICY "delete_service_role"
    ON public.profiles
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'service_role');

-- 新規ユーザー作成時のプロフィール自動生成
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data ->> 'name', 'Guest'),
        COALESCE(new.raw_user_meta_data ->> 'role', 'staff')
    );
    RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- updated_at 自動更新
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

CREATE TRIGGER update_profiles_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profiles_timestamp();
