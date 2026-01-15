/**
 * ジオコーディングAPI
 * POST /api/geocode - 住所からGPS座標を取得
 */

import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';
import { geocodeAddress, GEOCODING_ERROR_MESSAGES } from '@/lib/geocoding/yahoo';
import type { GeocodeResponse } from '@/types/geocoding';

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
 * 住所からGPS座標を取得する
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<GeocodeResponse>(
      { success: false, error: 'リクエストボディのJSONが不正です' },
      { status: 400 },
    );
  }

  try {
    // Supabaseクライアントを作成して認証チェック
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<GeocodeResponse>(
        { success: false, error: '認証が必要です。ログインしてください。' },
        { status: 401 },
      );
    }

    // リクエストボディの検証
    if (!isRecord(body)) {
      return NextResponse.json<GeocodeResponse>(
        { success: false, error: 'リクエストボディが不正です' },
        { status: 400 },
      );
    }

    const { address } = body;
    if (!isNonEmptyString(address)) {
      return NextResponse.json<GeocodeResponse>(
        { success: false, error: '住所を入力してください' },
        { status: 400 },
      );
    }

    // Yahoo APIを呼び出して座標を取得
    const coordinates = await geocodeAddress(address.trim());

    return NextResponse.json<GeocodeResponse>({
      success: true,
      coordinates,
    });
  } catch (error) {
    console.error('ジオコーディングに失敗しました:', error);

    const errorMessage =
      error instanceof Error ? error.message : GEOCODING_ERROR_MESSAGES.API_ERROR;

    return NextResponse.json<GeocodeResponse>(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
