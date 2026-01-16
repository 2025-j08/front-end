# シードデータスクリプト

Supabase データベースに初期データを投入するための TypeScript スクリプトです。

## スクリプト一覧

| ファイル                   | 説明                           |
| -------------------------- | ------------------------------ |
| `seed_adminuser.ts`        | 管理者ユーザーを作成           |
| `seed_facility.ts`         | 施設基本情報を投入             |
| `seed_facility_details.ts` | 施設詳細情報と関連データを投入 |

## 前提条件

- Supabase プロジェクトが作成済み
- マイグレーションが実行済み
- 環境変数が設定済み

## 環境変数

```bash
# 必須
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# オプション（seed_adminuser.ts 用）
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=password12345
SEED_ADMIN_NAME=Administrator
SEED_ADMIN_FACILITY_ID=1
```

## 実行方法

```bash
# 施設詳細情報を投入（推奨）
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility_details.ts

# 管理者ユーザーを作成
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_adminuser.ts
```

## seed_facility_details.ts

施設の詳細情報を一括投入するメインスクリプトです。

**投入されるデータ:**

1. **施設種類マスタ** (`facility_types`)
   - 大舎、中舎、小舎、グループホーム、地域小規模

2. **施設と施設種類の紐づけ** (`facility_facility_types`)

3. **施設詳細7テーブル**
   - `facility_access` - アクセス情報
   - `facility_philosophy` - 理念・メッセージ
   - `facility_specialty` - 特化領域
   - `facility_staff` - 職員情報
   - `facility_education` - 教育・進路支援
   - `facility_advanced` - 高機能化・多機能化
   - `facility_other` - その他情報

**データソース:**

- `src/dummy_data/facilities_list.json`
- `src/dummy_data/facilities_detail.json`

## トラブルシューティング

### 環境変数エラー

```
環境変数が設定されていません
```

→ `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を確認してください。

### 外部キー制約違反

→ `seed_facility.ts` を先に実行して施設基本情報を投入してください。

### データ挿入エラー

→ マイグレーションが正しく実行されているか確認してください:

```bash
supabase db reset
```

## 注意事項

- Service Role Key を使用するため、本番環境では慎重に扱ってください
- スクリプトは冪等性があり、複数回実行可能です（upsert）
- データをリセットする場合は `supabase db reset` を使用してください
