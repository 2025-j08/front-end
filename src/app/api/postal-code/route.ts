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

    // ZipCloud API 呼び出し (10秒タイムアウト設定)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`, {
        next: { revalidate: 86400 }, // 1日キャッシュ
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

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

    // 配列かつ要素が存在することを確認
    if (!Array.isArray(data.results) || data.results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '該当する住所が見つかりませんでした。手動で住所を入力してください',
        },
        { status: 404 },
      );
    }

    const result = data.results[0];

    // resultがオブジェクトであることを確認
    if (!result || typeof result !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: '住所の取得に失敗しました。郵便番号を確認するか、手動で住所を入力してください',
        },
        { status: 502 },
      );
    }

    // レスポンスデータの構造検証 (不完全なデータの混入防止)
    const requiredFields = ['address1', 'address2', 'address3', 'kana1', 'kana2', 'kana3'];
    const hasIncompleteData = requiredFields.some(
      (field) => typeof result[field] !== 'string' || !result[field],
    );

    if (hasIncompleteData) {
      return NextResponse.json(
        {
          success: false,
          error: 'この郵便番号の住所情報が見つかりませんでした。手動で住所を入力してください',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        address: {
          prefecture: result.address1,
          city: result.address2,
          town: result.address3,
          prefectureKana: result.kana1,
          cityKana: result.kana2,
          townKana: result.kana3,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=59',
        },
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          error:
            '住所の取得に時間がかかっています。しばらく経ってから再度試すか、手動で入力してください',
        },
        { status: 504 },
      );
    }

    console.error('Postal code lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}
