-- invitations テーブル
-- 施設担当者の招待情報を管理
CREATE TABLE public.invitations (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    facility_id BIGINT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '3 days'),
    -- 1施設1ユーザ想定なのでfacility_idは主キー設定しない
    PRIMARY KEY (user_id)
);

-- RLSを有効化
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 自身の招待情報だけ読める
CREATE POLICY "invitations_select_self" ON public.invitations
    FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT: 管理者ユーザのみ
CREATE POLICY "invitations_insert_policy" ON public.invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- UPDATE: 管理者ユーザのみ
CREATE POLICY "invitations_update_policy" ON public.invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- DELETE: 管理者または削除対象ユーザ自身
CREATE POLICY "invitations_delete_policy" ON public.invitations
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );
