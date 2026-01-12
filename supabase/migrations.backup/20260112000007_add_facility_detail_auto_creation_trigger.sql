-- 施設作成時に詳細テーブルのレコードを自動作成するトリガー

-- トリガー関数: 施設の詳細レコードを自動作成
CREATE OR REPLACE FUNCTION public.create_facility_details()
RETURNS TRIGGER AS $$
BEGIN
  -- facility_access: 必須フィールドのみ設定（デフォルト値を使用）
  INSERT INTO public.facility_access (
    facility_id,
    location_address,
    lat,
    lng,
    target_age
  ) VALUES (
    NEW.id,
    NEW.prefecture || NEW.city || NEW.address_detail, -- 完全住所を生成
    0, -- 緯度のデフォルト値
    0, -- 経度のデフォルト値
    '0～18歳' -- 対象年齢のデフォルト値
  );

  -- facility_philosophy: 空の説明文で初期化
  INSERT INTO public.facility_philosophy (
    facility_id,
    description
  ) VALUES (
    NEW.id,
    '' -- 空文字列（NOT NULL制約を満たすため）
  );

  -- facility_specialty: 空の配列で初期化
  INSERT INTO public.facility_specialty (
    facility_id,
    features
  ) VALUES (
    NEW.id,
    ARRAY[]::TEXT[] -- 空の配列（NOT NULL制約を満たすため）
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

-- トリガーを作成: facilities テーブルへの INSERT 後に実行
CREATE TRIGGER trigger_create_facility_details
AFTER INSERT ON public.facilities
FOR EACH ROW
EXECUTE FUNCTION public.create_facility_details();

-- トリガーのコメント
COMMENT ON FUNCTION public.create_facility_details() IS '施設作成時に7つの詳細テーブルに自動的にレコードを作成する';
COMMENT ON TRIGGER trigger_create_facility_details ON public.facilities IS '施設作成時に詳細レコードを自動作成するトリガー';
