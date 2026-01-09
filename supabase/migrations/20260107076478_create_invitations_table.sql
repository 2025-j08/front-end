CREATE TABLE invitations (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    facility_id BIGINT REFERENCES facilities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '3 days'),
    -- 1施設1ユーザ想定なのでfacility_idは主キー設定しない
    PRIMARY KEY (user_id)
);

-- RLSを有効化
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 自身の招待情報だけ読める
CREATE POLICY "invitations_select_self" ON invitations
    FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT: 管理者ユーザのみ
CREATE POLICY "invitations_insert_policy" ON invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- UPDATE: 管理者ユーザのみ
CREATE POLICY "invitations_update_policy" ON invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- DELETE: 管理者または削除対象ユーザ自身
CREATE POLICY "invitations_delete_policy" ON invitations
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );