# Supabase データベース管理

このディレクトリには、Supabase データベースのマイグレーション、シードデータ、デプロイ用スクリプトが含まれています。

## ディレクトリ構造

```
supabase/
├── migrations/   # データベースマイグレーション（7ファイル）
├── seeds/        # TypeScript シードスクリプト
├── deploy/       # 本番デプロイ用 SQL ファイル
├── snippets/     # SQL スニペット
├── seed.sql      # 開発用サンプルデータ
└── config.toml   # Supabase 設定
```

## マイグレーション

### ファイル一覧

| #   | ファイル名                                         | 説明                                               |
| --- | -------------------------------------------------- | -------------------------------------------------- |
| 1   | `20260113100000_create_common_functions.sql`       | 共通関数（`update_updated_at_column`）             |
| 2   | `20260113100001_create_profiles_table.sql`         | ユーザープロフィールテーブル                       |
| 3   | `20260113100002_create_facilities_table.sql`       | 施設基本情報テーブル（RLS 含む）                   |
| 4   | `20260113100003_create_facility_relationships.sql` | 施設関連テーブル（種類、招待、プロフィール紐付け） |
| 5   | `20260113100004_create_facility_details.sql`       | 施設詳細7テーブル（アクセス、理念、職員等）        |
| 6   | `20260113100005_create_facility_images.sql`        | 施設画像テーブル                                   |
| 7   | `20260113100006_add_utility_functions.sql`         | ユーティリティ関数・トリガー                       |

### 実行方法

```bash
# データベースをリセット（マイグレーション + seed.sql 実行）
supabase db reset

# 新しいマイグレーションを作成
supabase migration new <migration_name>

# マイグレーション履歴を確認
supabase migration list
```

### 依存関係

1. `create_common_functions.sql` は最初に実行（他テーブルのトリガーが依存）
2. `create_profiles_table.sql` と `create_facilities_table.sql` は詳細テーブルより前に実行
3. `add_utility_functions.sql` は全テーブル作成後に実行

## シードデータ

### SQL ベース（簡易セットアップ）

```bash
# db reset 時に自動実行
supabase db reset

# 手動で seed を実行
supabase db seed
```

### TypeScript ベース（詳細データ投入）

```bash
# 施設データ + 詳細情報を投入
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_facility_details.ts

# 管理者ユーザーを作成
node --env-file=.env.local --import tsx src/lib/supabase/test/seed_adminuser.ts
```

詳細は [シードスクリプト README](../src/lib/supabase/test/README.md) を参照してください。

## 本番デプロイ

### Supabase プロジェクトへの接続

```bash
# プロジェクトにリンク
supabase link --project-ref <project-id>

# マイグレーションを本番環境に適用
supabase db push
```

### デプロイ用 SQL

`deploy/` ディレクトリに本番デプロイ用の SQL ファイルが格納されています。

> **注意**: `seed.sql` は開発専用です。本番環境では実行されません。

## トラブルシューティング

### マイグレーションが失敗する

```bash
# 履歴を確認
supabase migration list

# データベースを完全リセット
supabase db reset

# Supabase コンテナを再起動
supabase stop && supabase start
```

### シードデータが投入されない

```bash
# 環境変数を確認
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# seed.sql を手動実行
psql $DATABASE_URL < supabase/seed.sql
```

## 関連リンク

- [Supabase CLI ドキュメント](https://supabase.com/docs/guides/cli)
- [マイグレーションガイド](https://supabase.com/docs/guides/database/migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
