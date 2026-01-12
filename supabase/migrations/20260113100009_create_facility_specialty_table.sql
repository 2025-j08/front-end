-- facility_specialty テーブル
-- 生活環境・特色情報を格納
CREATE TABLE public.facility_specialty (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    features TEXT,
    programs TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLSを有効化
ALTER TABLE public.facility_specialty ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facility_specialty
    FOR SELECT
    USING (true);

-- 挿入は施設担当者または管理者のみ許可
CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_specialty
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        -- 施設担当者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_specialty.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 更新は施設担当者または管理者のみ許可
CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_specialty
    FOR UPDATE
    TO authenticated
    USING (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        -- 施設担当者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_specialty.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        -- 施設担当者
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_specialty.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 削除は管理者のみ許可
CREATE POLICY "delete_admin_only"
    ON public.facility_specialty
    FOR DELETE
    TO authenticated
    USING (
        -- 管理者
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- updated_at 自動更新トリガー
CREATE TRIGGER update_facility_specialty_updated_at
    BEFORE UPDATE ON public.facility_specialty
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- テーブルコメント
COMMENT ON TABLE public.facility_specialty IS '施設の生活環境・特色情報を格納するテーブル';
COMMENT ON COLUMN public.facility_specialty.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_specialty.features IS '特に力を入れている取り組み/支援領域（長文テキスト）';
COMMENT ON COLUMN public.facility_specialty.programs IS '特色ある活動や独自プログラム';
