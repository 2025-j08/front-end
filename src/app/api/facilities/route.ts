/**
 * 施設一覧・追加API
 * POST /api/facilities - 新規施設作成
 */

import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';
import {
  createFacility,
  updateFacilityCoordinates,
  type CreateFacilityData,
} from '@/lib/supabase/mutations/facilities';
import { geocodeAddress } from '@/lib/geocoding/yahoo';
import { KINKI_PREFECTURES } from '@/const/searchConditions';
import type { KinkiPrefecture } from '@/types/facility';

/**
 * オブジェクトかどうかを判定する型ガード
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 文字列かつ空でないかを判定する型ガード
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * 関西6府県かを判定する型ガード
 */
function isKinkiPrefecture(value: unknown): value is KinkiPrefecture {
  return typeof value === 'string' && (KINKI_PREFECTURES as readonly string[]).includes(value);
}

/**
 * リクエストボディの検証
 */
function validateCreateFacilityRequest(
  body: unknown,
): { valid: true; data: CreateFacilityData } | { valid: false; error: string } {
  if (!isRecord(body)) {
    return { valid: false, error: 'リクエストボディが不正です' };
  }

  // 必須フィールドの検証
  const { name, corporation, postal_code, prefecture, city, address_detail } = body;

  if (!isNonEmptyString(name)) {
    return { valid: false, error: 'nameは必須です' };
  }
  if (!isNonEmptyString(corporation)) {
    return { valid: false, error: 'corporationは必須です' };
  }
  if (!isNonEmptyString(postal_code)) {
    return { valid: false, error: 'postal_codeは必須です' };
  }
  if (!isNonEmptyString(prefecture)) {
    return { valid: false, error: 'prefectureは必須です' };
  }
  if (!isNonEmptyString(city)) {
    return { valid: false, error: 'cityは必須です' };
  }
  if (!isNonEmptyString(address_detail)) {
    return { valid: false, error: 'address_detailは必須です' };
  }

  // 都道府県の検証
  if (!isKinkiPrefecture(prefecture)) {
    return { valid: false, error: '都道府県は関西6府県から選択してください' };
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      corporation: corporation.trim(),
      postal_code: postal_code.trim(),
      prefecture,
      city: city.trim(),
      address_detail: address_detail.trim(),
    },
  };
}

/**
 * 新規施設を作成する
 */
export async function POST(request: NextRequest) {
  // JSONパースエラーは400で返す
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストボディのJSONが不正です' }, { status: 400 });
  }

  try {
    // バリデーション
    const validation = validateCreateFacilityRequest(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Supabaseクライアントを作成
    const supabase = await createServerClient();

    // ユーザー認証チェック
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です。ログインしてください。' },
        { status: 401 },
      );
    }

    // 管理者権限チェック
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
    }

    // 施設を作成
    const facilityId = await createFacility(supabase, validation.data);

    // 住所からGPS座標を自動取得して更新
    const fullAddress = `${validation.data.prefecture}${validation.data.city}${validation.data.address_detail}`;
    let geocodeSuccess = false;

    try {
      const coords = await geocodeAddress(fullAddress);
      await updateFacilityCoordinates(supabase, facilityId, {
        lat: coords.lat,
        lng: coords.lng,
        location_address: fullAddress,
      });
      geocodeSuccess = true;
    } catch (geocodeError) {
      // ジオコーディング失敗時もログのみで施設作成は成功扱い
      console.warn('GPS座標の自動取得に失敗しました:', geocodeError);
    }

    return NextResponse.json(
      {
        success: true,
        message: geocodeSuccess
          ? '施設を作成しました'
          : '施設を作成しました（GPS座標の自動取得に失敗しました）',
        data: { id: facilityId },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('施設の作成に失敗しました:', error);
    return NextResponse.json(
      {
        error: '施設の作成に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 },
    );
  }
}
