/**
 * 施設情報更新・削除API
 * PATCH /api/facilities/[id] - 施設情報更新
 * DELETE /api/facilities/[id] - 施設削除
 */

import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';
import {
  updateFacilityBySection,
  updateFacilityManagementInfo,
  deleteFacility,
  type TabUpdateData,
  type FacilityManagementUpdateData,
} from '@/lib/supabase/mutations/facilities';
import { getFacilityDetail } from '@/lib/supabase/queries/facilities';

/**
 * リクエストボディの型
 */
type UpdateFacilityRequest =
  | TabUpdateData
  | { section: 'management'; data: FacilityManagementUpdateData };

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
      'management',
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
    if (body.section === 'management') {
      await updateFacilityManagementInfo(supabase, facilityId, body.data);
    } else {
      await updateFacilityBySection(supabase, facilityId, body as TabUpdateData);
    }

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

/**
 * 施設を削除する
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const facilityId = parseInt(id, 10);

    if (isNaN(facilityId)) {
      return NextResponse.json({ error: '無効な施設IDです' }, { status: 400 });
    }

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

    // 施設の存在確認
    const existingFacility = await getFacilityDetail(facilityId);
    if (!existingFacility) {
      return NextResponse.json({ error: '施設が見つかりません' }, { status: 404 });
    }

    // 施設を削除
    await deleteFacility(supabase, facilityId);

    return NextResponse.json(
      {
        success: true,
        message: '施設を削除しました',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('施設の削除に失敗しました:', error);
    return NextResponse.json(
      {
        error: '施設の削除に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 },
    );
  }
}
