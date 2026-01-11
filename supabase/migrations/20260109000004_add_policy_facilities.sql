-- 管理者のみ挿入可能（新規施設は担当者紐付け前のため）
CREATE POLICY "insert_admin_only"
    ON public.facilities
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- 管理者または担当施設の職員が更新可能
CREATE POLICY "update_admin_or_facility_staff"
    ON public.facilities
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.user_id = auth.uid() AND fp.facility_id = id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.user_id = auth.uid() AND fp.facility_id = id
        )
    );

-- 管理者または担当施設の職員が削除可能
CREATE POLICY "delete_admin_or_facility_staff"
    ON public.facilities
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.user_id = auth.uid() AND fp.facility_id = id
        )
    );