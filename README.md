# 児童養護施設情報検索システム（フロントエンド）

Next.js + Supabase で構築された児童養護施設の情報検索・管理システムです。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **UI**: MUI (Material-UI) v7 + Emotion
- **データベース**: Supabase (PostgreSQL)
- **地図**: Leaflet
- **コード品質**: ESLint, Prettier, Husky

## セットアップ

### 前提条件

- Node.js (v20 以上推奨)
- npm
- Docker (ローカル Supabase を使用する場合)

### インストール

```bash
# 依存パッケージのインストール
npm install

# Git hooks の有効化
npm run prepare
```

### 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成してください。
テンプレートは `.env.example` を参照してください。

```bash
# 必須
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:56321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
YAHOO_GEOCODING_APP_ID=your_yahoo_app_id_here

# オプション（シードデータ投入用）
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=password12345
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

## ローカル Supabase の起動

Docker が起動している状態で実行してください。

### Supabase CLI のインストール (Linux)

```bash
cd /tmp
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar xz
sudo mv supabase /usr/local/bin/
supabase --version
```

### 起動

```bash
supabase start
```

**アクセスポイント** (デフォルト設定):

| サービス        | URL                    |
| --------------- | ---------------------- |
| API Gateway     | http://127.0.0.1:56321 |
| Studio (管理UI) | http://127.0.0.1:56323 |
| Database        | http://127.0.0.1:56322 |

> ポート番号は `.env` の設定に依存します。

## 利用可能なスクリプト

| コマンド          | 説明                         |
| ----------------- | ---------------------------- |
| `npm run dev`     | 開発サーバーを起動           |
| `npm run build`   | プロダクションビルドを作成   |
| `npm run start`   | プロダクションサーバーを起動 |
| `npm run lint`    | ESLint によるコードチェック  |
| `npm run prepare` | Husky (Git hooks) を有効化   |

## ディレクトリ構成

```
front-end/
├── src/
│   ├── app/          # ページ・レイアウト (App Router)
│   ├── components/   # 共通UIコンポーネント
│   ├── features/     # 機能ごとのコンポーネント・ロジック
│   ├── hooks/        # カスタムフック
│   ├── lib/          # ユーティリティ・ライブラリ
│   ├── types/        # TypeScript 型定義
│   ├── styles/       # CSS・スタイル
│   ├── const/        # 定数定義
│   └── dummy_data/   # 開発用ダミーデータ
├── public/           # 静的ファイル
├── supabase/         # Supabase 設定・マイグレーション
└── .husky/           # Git hooks 設定
```

## 関連ドキュメント

- [Supabase データベース管理](supabase/README.md)
- [シードデータスクリプト](src/lib/supabase/test/README.md)
