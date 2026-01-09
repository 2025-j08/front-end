-- profiles テーブル
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
    TO service_role
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- サービスロールのみ削除可能
CREATE POLICY "delete_service_role"
    ON public.profiles
    FOR DELETE
    TO service_role
    USING (auth.role() = 'service_role');

-- メール確認完了時のプロフィール自動生成
-- confirmed_at が NULL から値が設定されたタイミングで profiles を作成
CREATE FUNCTION public.handle_confirmed_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- メール確認が完了したタイミングのみ実行
    IF OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
        INSERT INTO public.profiles (id, name, role)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data ->> 'name', 'Guest'),
            'staff'
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_confirmed_user();

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
