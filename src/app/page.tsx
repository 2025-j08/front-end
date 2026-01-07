/*
import { Search } from '@/features/facilities/search/search';

export default function Home() {
  return <Search />;
}
*/

import Link from 'next/link';

import { Search } from '@/features/facilities/search/search';
import { Button } from '@/components/button/button'; // 既存の共通ボタンをインポート

export default function Home() {
  return (
    <>
      {/* テスト用ナビゲーションエリア */}
      <div
        style={{
          padding: '10px 20px',
          backgroundColor: '#fffbe6',
          borderBottom: '1px solid #ffe58f',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#856404' }}>
          【開発・テスト用】管理画面機能へのショートカット
        </p>
        <Link href="/admin/user-issuance">
          <Button>ユーザー発行画面を開く</Button>
        </Link>
      </div>

      {/* 既存の検索機能 */}
      <Search />
    </>
  );
}
