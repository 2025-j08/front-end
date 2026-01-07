CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '3 days')
);

-- RLSを有効化
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 管理者のみ全ての操作が可能
CREATE POLICY "invitations_admin_only" ON invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );