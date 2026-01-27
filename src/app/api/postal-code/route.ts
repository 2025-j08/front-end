import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';

/**
 * 郵便番号検索API (ZipCloud Proxy)
 * GET /api/postal-code?zipcode=1234567
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zipcode = searchParams.get('zipcode');

  if (!zipcode || !/^\d{7}$/.test(zipcode)) {
    return NextResponse.json(
      { success: false, error: '有効な7桁の郵便番号を入力してください' },
      { status: 400 },
    );
  }

  try {
    // 認証チェック
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
    }

    // ZipCloud API 呼び出し
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);

    if (!response.ok) {
      throw new Error('ZipCloud APIのリクエストに失敗しました');
    }

    const data = await response.json();

    if (data.status !== 200) {
      return NextResponse.json(
        { success: false, error: data.message || '住所の取得に失敗しました' },
        { status: 400 },
      );
    }

    if (!data.results) {
      return NextResponse.json(
        { success: false, error: '該当する住所が見つかりませんでした' },
        { status: 404 },
      );
    }

    const result = data.results[0];
    return NextResponse.json({
      success: true,
      address: {
        prefecture: result.address1,
        city: result.address2,
        town: result.address3,
        prefectureKana: result.kana1,
        cityKana: result.kana2,
        townKana: result.kana3,
      },
    });
  } catch (error) {
    console.error('Postal code lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}
