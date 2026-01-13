/**
 * 施設情報更新API
 * PATCH /api/facilities/[id]
 */

import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';
import { updateFacilityBySection, type TabUpdateData } from '@/lib/supabase/mutations/facilities';
import { getFacilityDetail } from '@/lib/supabase/queries/facilities';

/**
 * リクエストボディの型
 */
type UpdateFacilityRequest = TabUpdateData;

/**
 * 施設情報を部分更新する
 * @param request - HTTPリクエスト
 * @param params - ルートパラメータ（施設ID）
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // パラメータを取得
    const { id } = await params;
    const facilityId = parseInt(id, 10);

    // IDの検証
    if (isNaN(facilityId)) {
      return NextResponse.json({ error: '無効な施設IDです' }, { status: 400 });
    }

    // リクエストボディをパース
    const body: UpdateFacilityRequest = await request.json();

    // セクション名の検証
    const validSections = [
      'basic',
      'access',
      'philosophy',
      'specialty',
      'staff',
      'education',
      'advanced',
      'other',
    ];
    if (!validSections.includes(body.section)) {
      return NextResponse.json({ error: '無効なセクション名です' }, { status: 400 });
    }

    // 更新データが空でないか検証
    if (!body.data || Object.keys(body.data).length === 0) {
      return NextResponse.json({ error: '更新データが空です' }, { status: 400 });
    }

    // Supabaseクライアントを作成（認証済みユーザーのセッションを使用）
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

    // 施設の存在確認
    const existingFacility = await getFacilityDetail(facilityId);
    if (!existingFacility) {
      return NextResponse.json({ error: '施設が見つかりません' }, { status: 404 });
    }

    // データを更新
    await updateFacilityBySection(supabase, facilityId, body);

    // 更新後のデータを取得
    const updatedFacility = await getFacilityDetail(facilityId);

    return NextResponse.json(
      {
        success: true,
        message: '施設情報を更新しました',
        data: updatedFacility,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('施設情報の更新に失敗しました:', error);
    return NextResponse.json(
      {
        error: '施設情報の更新に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 },
    );
  }
}
