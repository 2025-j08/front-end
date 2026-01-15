-- Supabase Storage バケットの作成
-- facility-images: 施設画像を格納するパブリックバケット

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'facility-images',
    'facility-images',
    true,
    5242880, -- 5MB
    ARRAY['image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- バケットのRLSポリシー

-- 全員が閲覧可能
CREATE POLICY "Public read access"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'facility-images');

-- 認証済みユーザーがアップロード可能（施設担当者または管理者）
CREATE POLICY "Authenticated users can upload"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'facility-images'
        AND (
            -- パスから facility_id を抽出して権限チェック
            -- パスフォーマット: {facility_id}/{image_type}/{filename}
            EXISTS (
                SELECT 1 FROM public.facility_profiles fp
                WHERE fp.facility_id = split_part(name, '/', 1)::bigint
                AND fp.user_id = auth.uid()
            )
            OR EXISTS (
                SELECT 1 FROM public.profiles p
                WHERE p.id = auth.uid() AND p.role = 'admin'
            )
        )
    );

-- 認証済みユーザーが削除可能（施設担当者または管理者）
CREATE POLICY "Authenticated users can delete"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'facility-images'
        AND (
            EXISTS (
                SELECT 1 FROM public.facility_profiles fp
                WHERE fp.facility_id = split_part(name, '/', 1)::bigint
                AND fp.user_id = auth.uid()
            )
            OR EXISTS (
                SELECT 1 FROM public.profiles p
                WHERE p.id = auth.uid() AND p.role = 'admin'
            )
        )
    );
