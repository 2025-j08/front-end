-- =============================================================================
-- 005: 施設詳細テーブル
-- =============================================================================
-- 施設の詳細情報を格納する7つのテーブルと自動作成トリガー
-- - facility_access: アクセス情報・地域連携情報
-- - facility_philosophy: 理念情報
-- - facility_specialty: 生活環境・特色情報
-- - facility_staff: 職員情報
-- - facility_education: 教育・進路支援情報
-- - facility_advanced: 高機能化・多機能化への取り組み
-- - facility_other: その他の情報
-- =============================================================================

-- -----------------------------------------------------------------------------
-- facility_access テーブル
-- アクセス情報・地域連携情報を格納
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_access (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    location_address TEXT NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    description TEXT,  -- 交通アクセス
    location_appeal TEXT,
    website_url TEXT,
    building TEXT,
    capacity INTEGER,
    provisional_capacity INTEGER,
    relation_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_access_lat_range CHECK (lat BETWEEN -90 AND 90),
    CONSTRAINT chk_access_lng_range CHECK (lng BETWEEN -180 AND 180),
    CONSTRAINT chk_access_capacity_positive CHECK (capacity > 0),
    CONSTRAINT chk_access_provisional_capacity_positive CHECK (provisional_capacity > 0)
);

ALTER TABLE public.facility_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_access
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_access
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_access.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_access
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_access.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_access.facility_id
            AND fp.user_id = auth.uid()
        )
    );

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

CREATE INDEX idx_facility_access_lat_lng ON public.facility_access(lat, lng);

CREATE TRIGGER update_facility_access_updated_at
    BEFORE UPDATE ON public.facility_access
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.facility_access IS '施設のアクセス情報と地域連携情報を格納するテーブル';
COMMENT ON COLUMN public.facility_access.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_access.location_address IS '施設の所在地住所';
COMMENT ON COLUMN public.facility_access.lat IS '緯度';
COMMENT ON COLUMN public.facility_access.lng IS '経度';
COMMENT ON COLUMN public.facility_access.description IS '交通アクセス';
COMMENT ON COLUMN public.facility_access.location_appeal IS '立地のアピールポイント';
COMMENT ON COLUMN public.facility_access.website_url IS '施設のウェブサイトURL';
COMMENT ON COLUMN public.facility_access.building IS '建物情報';
COMMENT ON COLUMN public.facility_access.capacity IS '施設の定員';
COMMENT ON COLUMN public.facility_access.provisional_capacity IS '暫定定員';
COMMENT ON COLUMN public.facility_access.relation_info IS '地域連携情報';

-- -----------------------------------------------------------------------------
-- facility_philosophy テーブル
-- 理念情報を格納
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_philosophy (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.facility_philosophy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_philosophy
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_philosophy
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_philosophy.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_philosophy
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_philosophy.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_philosophy.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "delete_admin_only"
    ON public.facility_philosophy
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE TRIGGER update_facility_philosophy_updated_at
    BEFORE UPDATE ON public.facility_philosophy
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.facility_philosophy IS '施設の理念情報を格納するテーブル';
COMMENT ON COLUMN public.facility_philosophy.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_philosophy.description IS '日々の支援の中で重視している視点・理念';
COMMENT ON COLUMN public.facility_philosophy.message IS '理念メッセージ';

-- -----------------------------------------------------------------------------
-- facility_specialty テーブル
-- 生活環境・特色情報を格納
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_specialty (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    features TEXT,
    programs TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.facility_specialty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_specialty
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_specialty
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_specialty.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_specialty
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_specialty.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_specialty.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "delete_admin_only"
    ON public.facility_specialty
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE TRIGGER update_facility_specialty_updated_at
    BEFORE UPDATE ON public.facility_specialty
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.facility_specialty IS '施設の生活環境・特色情報を格納するテーブル';
COMMENT ON COLUMN public.facility_specialty.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_specialty.features IS '特に力を入れている取り組み/支援領域（長文テキスト）';
COMMENT ON COLUMN public.facility_specialty.programs IS '特色ある活動や独自プログラム';

-- -----------------------------------------------------------------------------
-- facility_staff テーブル
-- 職員情報を格納
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_staff (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    full_time_staff_count INTEGER,
    part_time_staff_count INTEGER,
    specialties TEXT,
    average_tenure TEXT,
    age_distribution TEXT,
    work_style TEXT,
    has_university_lecturer BOOLEAN,
    lecture_subjects TEXT,
    external_activities TEXT,
    qualifications_and_skills TEXT,
    internship_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_staff_full_time_staff_count_positive CHECK (full_time_staff_count > 0),
    CONSTRAINT chk_staff_part_time_staff_count_positive CHECK (part_time_staff_count >= 0)
);

ALTER TABLE public.facility_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_staff
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_staff
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_staff.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_staff
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_staff.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_staff.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "delete_admin_only"
    ON public.facility_staff
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE TRIGGER update_facility_staff_updated_at
    BEFORE UPDATE ON public.facility_staff
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.facility_staff IS '施設の職員情報を格納するテーブル';
COMMENT ON COLUMN public.facility_staff.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_staff.full_time_staff_count IS '常勤職員数';
COMMENT ON COLUMN public.facility_staff.part_time_staff_count IS '非常勤職員数';
COMMENT ON COLUMN public.facility_staff.specialties IS '職員の特徴・専門性';
COMMENT ON COLUMN public.facility_staff.average_tenure IS '平均勤続年数';
COMMENT ON COLUMN public.facility_staff.age_distribution IS '年齢層の傾向';
COMMENT ON COLUMN public.facility_staff.work_style IS '働き方の特徴（年休、有給平均、福利厚生等）';
COMMENT ON COLUMN public.facility_staff.has_university_lecturer IS '大学講義を担当している職員の有無';
COMMENT ON COLUMN public.facility_staff.lecture_subjects IS '担当している科目';
COMMENT ON COLUMN public.facility_staff.external_activities IS '他機関での活動実績（外部講演・講師）';
COMMENT ON COLUMN public.facility_staff.qualifications_and_skills IS '職員個人の資格やスキルで活かされているもの';
COMMENT ON COLUMN public.facility_staff.internship_details IS '実習生受け入れについて特筆的なこと';

-- -----------------------------------------------------------------------------
-- facility_education テーブル
-- 教育・進路支援情報を格納
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_education (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    graduation_rate TEXT,
    graduation_rate_percentage TEXT,
    learning_support TEXT,
    career_support TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.facility_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_education
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_education
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_education.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_education
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_education.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_education.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "delete_admin_only"
    ON public.facility_education
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE TRIGGER update_facility_education_updated_at
    BEFORE UPDATE ON public.facility_education
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.facility_education IS '施設の教育・進路支援情報を格納するテーブル';
COMMENT ON COLUMN public.facility_education.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_education.graduation_rate IS '進学率（高校、専門、大学）と支援体制';
COMMENT ON COLUMN public.facility_education.graduation_rate_percentage IS '進学率の割合（例: 100%）';
COMMENT ON COLUMN public.facility_education.learning_support IS '学習支援の工夫や外部連携';
COMMENT ON COLUMN public.facility_education.career_support IS '特化した進路支援内容';

-- -----------------------------------------------------------------------------
-- facility_advanced テーブル
-- 高機能化・多機能化への取り組み情報を格納
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_advanced (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    background TEXT,
    challenges TEXT,
    solutions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.facility_advanced ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_advanced
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_advanced
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_advanced.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_advanced
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_advanced.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_advanced.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "delete_admin_only"
    ON public.facility_advanced
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE TRIGGER update_facility_advanced_updated_at
    BEFORE UPDATE ON public.facility_advanced
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.facility_advanced IS '施設の高機能化・多機能化への取り組み情報を格納するテーブル';
COMMENT ON COLUMN public.facility_advanced.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_advanced.description IS '実施している多機能化の取り組み';
COMMENT ON COLUMN public.facility_advanced.background IS '経緯と背景';
COMMENT ON COLUMN public.facility_advanced.challenges IS '取り組みにあたっての苦労や課題';
COMMENT ON COLUMN public.facility_advanced.solutions IS '工夫や成功要因・乗り越えた方法';

-- -----------------------------------------------------------------------------
-- facility_other テーブル
-- その他の情報を格納
-- -----------------------------------------------------------------------------
CREATE TABLE public.facility_other (
    facility_id BIGINT PRIMARY KEY REFERENCES public.facilities(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    networks TEXT,
    future_outlook TEXT,
    free_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.facility_other ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_public"
    ON public.facility_other
    FOR SELECT
    USING (true);

CREATE POLICY "insert_facility_owner_or_admin"
    ON public.facility_other
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_other.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "update_facility_owner_or_admin"
    ON public.facility_other
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_other.facility_id
            AND fp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.facility_profiles fp
            WHERE fp.facility_id = facility_other.facility_id
            AND fp.user_id = auth.uid()
        )
    );

CREATE POLICY "delete_admin_only"
    ON public.facility_other
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE TRIGGER update_facility_other_updated_at
    BEFORE UPDATE ON public.facility_other
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.facility_other IS '施設のその他の情報を格納するテーブル';
COMMENT ON COLUMN public.facility_other.facility_id IS '施設ID (facilities テーブルへの外部キー)';
COMMENT ON COLUMN public.facility_other.title IS 'タイトル';
COMMENT ON COLUMN public.facility_other.description IS '説明・その他情報';
COMMENT ON COLUMN public.facility_other.networks IS '他施設とのネットワークや共同プロジェクト';
COMMENT ON COLUMN public.facility_other.future_outlook IS '今後の展望や課題';
COMMENT ON COLUMN public.facility_other.free_text IS '自由記述欄';

-- -----------------------------------------------------------------------------
-- 施設作成時に詳細テーブルのレコードを自動作成するトリガー
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_facility_details()
RETURNS TRIGGER AS $$
BEGIN
  -- facility_access: 必須フィールドのみ設定（デフォルト値を使用）
  INSERT INTO public.facility_access (
    facility_id,
    location_address,
    lat,
    lng
  ) VALUES (
    NEW.id,
    NEW.prefecture || NEW.city || NEW.address_detail, -- 完全住所を生成
    0, -- 緯度のデフォルト値
    0 -- 経度のデフォルト値
  );

  -- facility_philosophy: 空の説明文で初期化
  INSERT INTO public.facility_philosophy (
    facility_id,
    description
  ) VALUES (
    NEW.id,
    '' -- 空文字列（NOT NULL制約を満たすため）
  );

  -- facility_specialty: facility_idのみで初期化（featuresはNULL許容）
  INSERT INTO public.facility_specialty (
    facility_id
  ) VALUES (
    NEW.id
  );

  -- facility_staff: 全フィールドNULLで初期化
  INSERT INTO public.facility_staff (
    facility_id
  ) VALUES (
    NEW.id
  );

  -- facility_education: 全フィールドNULLで初期化
  INSERT INTO public.facility_education (
    facility_id
  ) VALUES (
    NEW.id
  );

  -- facility_advanced: descriptionのみ空文字列で初期化
  INSERT INTO public.facility_advanced (
    facility_id,
    description
  ) VALUES (
    NEW.id,
    '' -- 空文字列（NOT NULL制約を満たすため）
  );

  -- facility_other: 全フィールドNULLで初期化
  INSERT INTO public.facility_other (
    facility_id
  ) VALUES (
    NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_facility_details
AFTER INSERT ON public.facilities
FOR EACH ROW
EXECUTE FUNCTION public.create_facility_details();

COMMENT ON FUNCTION public.create_facility_details() IS '施設作成時に7つの詳細テーブルに自動的にレコードを作成する';
COMMENT ON TRIGGER trigger_create_facility_details ON public.facilities IS '施設作成時に詳細レコードを自動作成するトリガー';
