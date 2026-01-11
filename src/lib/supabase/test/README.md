# Supabase シードデータスクリプト

このディレクトリには、Supabaseデータベースに初期データを投入するためのスクリプトが含まれています。

## スクリプト一覧

### 1. seed_adminuser.ts

管理者ユーザーを作成します。

### 2. seed_facility.ts

施設の基本情報を投入します。

- `facilities`テーブルに施設データを挿入
- `facilities_list.json`と`facilities_detail.json`から自動的にデータを取得・変換

### 3. seed_facility_details.ts (NEW)

施設の詳細情報と関連データを投入します。

- `facility_types`テーブルに施設種類(大舎・中舎・小舎等)を挿入
- `facility_facility_types`テーブルに施設と施設種類の紐づけを挿入
- 7つの施設詳細テーブル(`facility_access`, `facility_philosophy`, etc.)にデータを挿入

## 実行方法

### 前提条件

- Supabaseプロジェクトが作成されていること
- マイグレーションが実行済みであること
- 環境変数が設定されていること

### 環境変数

以下の環境変数が必要です:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 実行順序（推奨）

```bash
# 1. 管理者ユーザーを作成
NEXT_PUBLIC_SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> tsx src/lib/supabase/test/seed_adminuser.ts

# 2. 施設基本情報を投入
NEXT_PUBLIC_SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> tsx src/lib/supabase/test/seed_facility.ts

# 3. 施設詳細情報を投入（NEW）
NEXT_PUBLIC_SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> tsx src/lib/supabase/test/seed_facility_details.ts
```

### ワンライナー実行（全て実行）

```bash
# 環境変数を設定
export NEXT_PUBLIC_SUPABASE_URL=<url>
export SUPABASE_SERVICE_ROLE_KEY=<key>

# 順番に実行
tsx src/lib/supabase/test/seed_adminuser.ts && \
tsx src/lib/supabase/test/seed_facility.ts && \
tsx src/lib/supabase/test/seed_facility_details.ts
```

## seed_facility_details.ts の詳細

### 投入されるデータ

1. **施設種類マスタ (facility_types)**
   - 大舎
   - 中舎
   - 小舎
   - グループホーム
   - 地域小規模

2. **施設と施設種類の紐づけ (facility_facility_types)**
   - `facilities_detail.json`の`dormitoryType`を元に自動的に紐づけ

type FacilityDetailItem = {
id: number;
name: string;
dormitoryType?: string;
accessInfo?: unknown;
relationInfo?: string;
philosophyInfo?: unknown;
specialtyInfo?: unknown;
staffInfo?: unknown;
educationInfo?: unknown;
advancedInfo?: unknown;
otherInfo?: unknown;
[key: string]: unknown;
};

type FacilityInsertRow = {
facility_id: number;
data: unknown;
};

type FacilityTypeAssociation = {
facility_id: number;
facility_type_id: number;
};

### データソース

全てのデータは`src/dummy_data/facilities_detail.json`から取得されます。

### エラーハンドリング

- データが存在しないテーブルはスキップされます（警告ログが出力されます）
- 施設種類が見つからない場合は紐づけがスキップされます
- 実行中にエラーが発生した場合、詳細なエラーメッセージが表示されます

## トラブルシューティング

### エラー: "環境変数が設定されていません"

→ 環境変数`NEXT_PUBLIC_SUPABASE_URL`と`SUPABASE_SERVICE_ROLE_KEY`を正しく設定してください。

### エラー: "外部キー制約違反"

→ `seed_facility.ts`を先に実行して、施設基本情報を投入してください。

### エラー: "データが挿入できません"

→ マイグレーションが正しく実行されているか確認してください:

```bash
supabase db reset  # ローカル環境の場合
```

## 注意事項

- **Service Role Key**を使用するため、本番環境では慎重に扱ってください
- 既にデータが存在する場合、重複エラーが発生する可能性があります
- データをリセットする場合は`supabase db reset`を使用してください
