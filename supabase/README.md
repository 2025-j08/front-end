# Supabase データベース管理

このディレクトリには、Supabaseデータベースのマイグレーションとseedデータが含まれています。

## ディレクトリ構造

```
supabase/
├── migrations/          # データベースマイグレーションファイル（15ファイル）
├── migrations.backup/   # 旧マイグレーションファイルのバックアップ（29ファイル）
├── seed.sql            # 開発用サンプルデータ（SQLベース）
├── config.toml         # Supabase設定ファイル
└── README.md           # このファイル
```

## マイグレーション管理

### マイグレーションファイル一覧

マイグレーションは**適切な粒度**に整理されており、各ファイルは以下の順序で実行されます:

| #   | ファイル名                                                     | 説明                                                      |
| --- | -------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | `20260113100000_create_common_functions.sql`                   | 共通関数（`update_updated_at_column`）                    |
| 2   | `20260113100001_create_profiles_table.sql`                     | ユーザープロフィールテーブル                              |
| 3   | `20260113100002_create_facilities_table.sql`                   | 施設基本情報テーブル（RLSポリシー、annex_facilities含む） |
| 4   | `20260113100003_create_facility_profiles_table.sql`            | 施設-ユーザー関連テーブル                                 |
| 5   | `20260113100004_create_invitations_table.sql`                  | 招待管理テーブル                                          |
| 6   | `20260113100005_create_facility_types_table.sql`               | 施設種類マスタ（UNIQUE制約含む）                          |
| 7   | `20260113100006_create_facility_facility_types_table.sql`      | 施設-施設種類関連テーブル                                 |
| 8   | `20260113100007_create_facility_access_table.sql`              | 施設アクセス情報（正規化済み）                            |
| 9   | `20260113100008_create_facility_philosophy_table.sql`          | 施設理念（description + message）                         |
| 10  | `20260113100009_create_facility_specialty_table.sql`           | 施設特化領域（features: TEXT）                            |
| 11  | `20260113100010_create_facility_staff_table.sql`               | 施設職員情報（正規化済み）                                |
| 12  | `20260113100011_create_facility_education_table.sql`           | 教育・進路支援（graduation_rate_percentage含む）          |
| 13  | `20260113100012_create_facility_advanced_table.sql`            | 高機能化・多機能化                                        |
| 14  | `20260113100013_create_facility_other_table.sql`               | その他情報                                                |
| 15  | `20260113100014_add_facility_detail_auto_creation_trigger.sql` | 施設詳細自動作成トリガー                                  |

### マイグレーションの実行

```bash
# ローカル開発環境でマイグレーションを適用
supabase db reset

# 新しいマイグレーションを作成（必要な場合）
supabase migration new <migration_name>

# マイグレーション履歴を確認
supabase migration list
```

### 重要な依存関係

- `create_common_functions.sql` は**必ず最初**に実行する必要があります（他のテーブルのトリガーが依存）
- `create_profiles_table.sql` と `create_facilities_table.sql` は詳細テーブルより前に実行
- `add_facility_detail_auto_creation_trigger.sql` は**全ての詳細テーブル作成後**に実行

## Seed データ管理

### SQLベースのseed（推奨: シンプルな環境構築）

最小限のサンプルデータを素早く投入できます。

```bash
# seed.sql を実行（db reset時に自動実行される）
supabase db reset

# 手動でseedを再実行
supabase db seed
```

**含まれるデータ:**

- 施設種類マスタ（5種類）
- サンプル施設3件
- 各施設の詳細情報（7テーブル分）

### TypeScriptベースのseed（推奨: 大量データ投入）

実際のダミーデータ（JSON）を使用して大量のデータを投入できます。

#### 1. 施設データの投入

```bash
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility_details.ts
```

**機能:**

- `src/dummy_data/facilities_list.json` からリストデータを読込
- `src/dummy_data/facilities_detail.json` から詳細データを読込
- 施設テーブル + 7つの詳細テーブル + 施設種類の紐づけを自動投入
- 冪等性があり、複数回実行可能（upsert）

#### 2. 管理者ユーザーの作成

```bash
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_adminuser.ts
```

**環境変数（オプション）:**

```bash
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=password12345
SEED_ADMIN_NAME=Administrator
SEED_ADMIN_FACILITY_ID=1  # 施設IDを指定すると自動で割当
```

**機能:**

- Supabase Admin APIでユーザー作成（メール確認済み）
- `profiles` テーブルに `role='admin'` で登録
- オプションで施設割当も可能

## データベースのリセット

開発環境で全データをクリーンアップして再構築:

```bash
# 全データ削除 + マイグレーション実行 + seed.sql実行
supabase db reset

# その後、必要に応じてTypeScriptベースのseedを実行
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility_details.ts
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_adminuser.ts
```

## マイグレーション再編成について

**2026年1月13日実施:**

- 旧マイグレーション: 29ファイル（複数回の修正で散在）
- 新マイグレーション: 15ファイル（適切な粒度に統合）

**統合されたファイル例:**

- `create_facility_access_table.sql`: 作成 + 正規化を1ファイルに統合
- `create_facility_philosophy_table.sql`: 作成 + 正規化 + カラム追加を統合
- `create_facilities_table.sql`: 作成 + RLSポリシー + カラム追加を統合

**バックアップ:**
旧マイグレーションファイルは `migrations.backup/` に保存されています。

## トラブルシューティング

### マイグレーションが失敗する場合

```bash
# マイグレーション履歴を確認
supabase migration list

# データベースを完全にリセット
supabase db reset

# それでも解決しない場合はローカルのSupabaseコンテナを再起動
supabase stop
supabase start
```

### Seedデータが投入されない場合

```bash
# seed.sql を手動実行
psql $DATABASE_URL < supabase/seed.sql

# TypeScriptスクリプトの場合は環境変数を確認
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

## 本番環境へのデプロイ

```bash
# Supabaseプロジェクトにリンク
supabase link --project-ref <project-id>

# マイグレーションを本番環境に適用
supabase db push

# 注意: seed.sql は本番環境では実行されません（開発専用）
```

## 関連ドキュメント

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/database/migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
