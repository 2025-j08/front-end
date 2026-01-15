-- facility_access テーブル
-- アクセス情報・地域連携情報を格納
CREATE TABLE public.facility_access (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    location_address TEXT NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    station TEXT,
    description TEXT,
    location_appeal TEXT,
    website_url TEXT,
    building TEXT,
    capacity INTEGER,
    provisional_capacity INTEGER,
    relation_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- チェック制約
    CONSTRAINT chk_access_lat_range CHECK (lat BETWEEN -90 AND 90),
    CONSTRAINT chk_access_lng_range CHECK (lng BETWEEN -180 AND 180),
    CONSTRAINT chk_access_capacity_positive CHECK (capacity > 0),
    CONSTRAINT chk_access_provisional_capacity_positive CHECK (provisional_capacity > 0)
);

-- RLSを有効化
ALTER TABLE public.facility_access ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが閲覧可能
CREATE POLICY "select_public"
    ON public.facility_access
    FOR SELECT
    USING (true);

-- 挿入は施設担当者または管理者のみ許可
CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_access
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
            WHERE fp.facility_id = facility_access.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 更新は施設担当者または管理者のみ許可
CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_access
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
            WHERE fp.facility_id = facility_access.facility_id
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
            WHERE fp.facility_id = facility_access.facility_id
            AND fp.user_id = auth.uid()
        )
    );

-- 削除は管理者のみ許可
CREATE POLICY "delete_admin_only"
    ON public.facility_access
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- インデックスを追加（検索性能向上）
CREATE INDEX idx_facility_access_lat_lng ON public.facility_access(lat, lng);
CREATE INDEX idx_facility_access_station ON public.facility_access(station) WHERE station IS NOT NULL;

-- updated_at 自動更新トリガー
CREATE TRIGGER update_facility_access_updated_at
    BEFORE UPDATE ON public.facility_access
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- テーブルコメント
COMMENT ON TABLE public.facility_access IS '施設のアクセス情報と地域連携情報を格納するテーブル';
COMMENT ON COLUMN public.facility_access.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_access.location_address IS '施設の所在地住所';
COMMENT ON COLUMN public.facility_access.lat IS '緯度';
COMMENT ON COLUMN public.facility_access.lng IS '経度';
COMMENT ON COLUMN public.facility_access.station IS '最寄り駅・バス停名';
COMMENT ON COLUMN public.facility_access.description IS '駅からのアクセス方法';
COMMENT ON COLUMN public.facility_access.location_appeal IS '立地のアピールポイント';
COMMENT ON COLUMN public.facility_access.website_url IS '施設のウェブサイトURL';
COMMENT ON COLUMN public.facility_access.building IS '建物情報';
COMMENT ON COLUMN public.facility_access.capacity IS '施設の定員';
COMMENT ON COLUMN public.facility_access.provisional_capacity IS '暫定定員';
COMMENT ON COLUMN public.facility_access.relation_info IS '地域連携情報';
