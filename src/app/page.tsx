/*
import { Search } from '@/features/facilities/search/search';

export default function Home() {
  return <Search />;
}
*/

import Link from 'next/link';

import { Search } from '@/features/facilities/search/search';
import { Button } from '@/components/button/button';

import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      {/* テスト用ナビゲーションエリア */}
      <div className={styles.devNavigation}>
        <p className={styles.devNavigationText}>【開発・テスト用】管理画面機能へのショートカット</p>
        <Link href="/admin/user-issuance">
          <Button>ユーザー発行画面を開く</Button>
        </Link>
      </div>

      {/* 既存の検索機能 */}
      <Search />
    </>
  );
}
