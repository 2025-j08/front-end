-- =============================================================================
-- 002: profiles テーブル
-- =============================================================================
-- ユーザープロファイルを管理
-- - auth.users との連携
-- - ロールベースアクセス制御 (admin/staff)
-- =============================================================================

-- profiles テーブル
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- RLSを有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 管理者判定関数（RLSポリシー内での循環参照を回避するため SECURITY DEFINER を使用）
CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- ユーザー自身または管理者がプロフィールを閲覧可能
CREATE POLICY "select_owner_or_admin"
    ON public.profiles
    FOR SELECT
    USING (
        id = auth.uid()
        OR public.is_admin()
    );

-- 本人が挿入する場合は role を 'staff' に制限、管理者は任意のロールで挿入可能
CREATE POLICY "insert_owner_or_admin"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- 本人が作成する場合は role を 'staff' に強制
        (
            id = auth.uid()
            AND role = 'staff'
        )
        -- または既存の管理者が他のユーザーを作成する場合は制限なし
        OR public.is_admin()
    );

-- 本人が更新する場合は役割以外を変更可能、管理者のみが役割を変更可能
-- 一般ユーザー（staff）は自分のプロフィールのみ更新可能（roleは'staff'固定）
CREATE POLICY "update_own_profile_staff"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
        id = auth.uid()
        AND NOT public.is_admin()
    )
    WITH CHECK (
        id = auth.uid()
        AND role = 'staff'  -- staffユーザーはroleを'staff'にしか設定できない（権限昇格防止）
    );

-- 管理者は全てのプロフィールを更新可能（role含む）
CREATE POLICY "update_any_profile_admin"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (true);  -- 管理者は制限なし

-- 本人または管理者が削除可能
CREATE POLICY "delete_owner_or_admin"
    ON public.profiles
    FOR DELETE
    TO authenticated
    USING (
        id = auth.uid()
        OR public.is_admin()
    );

-- メール確認完了時のプロフィール自動生成
-- confirmed_at が NULL から値が設定されたタイミングで profiles を作成
--
-- 動作フロー:
-- 1. 通常のサインアップ: raw_user_meta_data に name が設定されている場合はそれを使用
-- 2. 招待フロー: raw_user_meta_data に name が設定されていないため '仮登録ユーザ' を設定
--    → 後に /api/auth/register で実際の名前に更新される（一時的な値として問題なし）
--
-- 注意: 招待フローでは、メール確認時点ではまだユーザーが名前を入力していないため、
-- COALESCE のデフォルト値 '仮登録ユーザ' が使用されます。
-- これは意図的な動作であり、初期登録完了時に正しい名前で上書きされます。
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
            COALESCE(NEW.raw_user_meta_data ->> 'name', '仮登録ユーザ'),
            'staff'
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_confirmed_user();

-- updated_at 自動更新（汎用関数を使用）
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
