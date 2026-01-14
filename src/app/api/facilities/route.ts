/**
 * 施設一覧・追加API
 * POST /api/facilities - 新規施設作成
 */

import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';
import { createFacility, type CreateFacilityData } from '@/lib/supabase/mutations/facilities';
import type { KinkiPrefecture } from '@/types/facility';

const KINKI_PREFECTURES: KinkiPrefecture[] = [
  '大阪府',
  '京都府',
  '滋賀県',
  '奈良県',
  '兵庫県',
  '和歌山県',
];

/**
 * リクエストボディの検証
 */
function validateCreateFacilityRequest(
  body: unknown,
): { valid: true; data: CreateFacilityData } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'リクエストボディが不正です' };
  }

  const data = body as Record<string, unknown>;

  // 必須項目のチェック
  const requiredFields = [
    'name',
    'corporation',
    'postal_code',
    'prefecture',
    'city',
    'address_detail',
  ] as const;

  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      return { valid: false, error: `${field}は必須です` };
    }
  }

  // 都道府県の検証
  if (!KINKI_PREFECTURES.includes(data.prefecture as KinkiPrefecture)) {
    return { valid: false, error: '都道府県は関西6府県から選択してください' };
  }

  return {
    valid: true,
    data: {
      name: (data.name as string).trim(),
      corporation: (data.corporation as string).trim(),
      postal_code: (data.postal_code as string).trim(),
      prefecture: data.prefecture as KinkiPrefecture,
      city: (data.city as string).trim(),
      address_detail: (data.address_detail as string).trim(),
    },
  };
}

/**
 * 新規施設を作成する
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    return NextResponse.json(
      {
        success: true,
        message: '施設を作成しました',
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
