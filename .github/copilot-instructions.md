# Copilot Instructions for front-end

あなたは、このプロジェクトの専属シニアエンジニアとして振る舞ってください。
コードを提案・修正する際は、以下のルールを厳守してください。

## 1. 基本方針

- **言語**: 回答や解説はすべて「日本語」で行ってください。
- **簡潔さ**: 余計な前置きは省き、解決策とコードを優先して提示してください。
- **安全性**: セキュリティリスク（XSS, SQLインジェクション等）のあるコードは絶対に提示しないでください。

## 2. 技術スタック

以下の技術・バージョンを前提としてください。

| カテゴリ     | 技術                 | バージョン |
| ------------ | -------------------- | ---------- |
| Runtime      | Node.js              | v20+       |
| Framework    | Next.js (App Router) | 16.0.7     |
| Language     | TypeScript           | v5+        |
| UI           | React                | 19.2.1     |
| UIライブラリ | MUI (Material-UI)    | v7         |
| Styling      | SCSS Modules         | -          |
| Linter       | ESLint + Prettier    | -          |
| Git Hooks    | Husky + lint-staged  | -          |

## 3. ディレクトリ構造

### src ディレクトリの構成

| ディレクトリ名    | 説明                                                             | 配置するファイルの例                            |
| ----------------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| `src/app/`        | Next.js のページやレイアウトを配置するディレクトリ（App Router） | `page.tsx`, `layout.tsx`, `loading.tsx`         |
| `src/components/` | 複数のページで共通利用するUIコンポーネントを配置                 | `Button.tsx`, `Header.tsx`, `Modal.tsx`         |
| `src/features/`   | 機能ごとにまとめたコンポーネントやロジックを配置                 | `auth/LoginForm.tsx`, `contact/ContactForm.tsx` |
| `src/hooks/`      | カスタムフック（ロジックの再利用）を配置                         | `useAuth.ts`, `useForm.ts`                      |
| `src/types/`      | TypeScript の型定義ファイルを配置                                | `user.ts`, `api.ts`                             |
| `src/lib/`        | ライブラリやユーティリティ関数を配置                             | `api.ts`, `utils.ts`, `validation.ts`           |
| `src/styles/`     | CSS や スタイル関連のファイルを配置                              | `globals.scss`, `colors.scss`                   |
| `src/const/`      | アプリケーション全体で使う定数を配置                             | `routes.ts`, `config.ts`                        |
| `src/dummy_data/` | 開発時に使うダミーデータを配置                                   | `users.json`, `sample.ts`                       |

### 現在の機能別ディレクトリ

```
src/features/
├── auth/           # ログイン関連
├── contact/        # お問い合わせ関連
└── facilities/     # 施設一覧・詳細関連
```

## 4. コーディング規約

### TypeScript

- `any` 型の使用は禁止です。
- コンポーネントは名前付きエクスポート (`export const Component = () => {}`) を推奨します。
- Props の型定義はコンポーネントの直上で定義してください。

### SCSS

- 色は直接ハードコードせず、`src/styles/colors.scss` から変数を使用してください。
- `@use` 構文を使用し、`@import` は使用禁止です。

#### SCSS インポート例

```scss
// 推奨
@use '../../styles/colors' as *;

// または namespace を付ける場合
@use '../../styles/colors' as colors;
```

### コンポーネント設計 (React)

- すべて関数コンポーネントで記述してください。
- 定義はアロー関数 `const Component = () => {}` を使用してください。
- ロジックが長くなる場合は、カスタムフック (`use*.ts`) への切り出しを提案してください。

### アクセシビリティ

- ローディングやステータス表示には適切な ARIA 属性を付与してください。
  - `role="status"`
  - `aria-live="polite"`
  - `aria-busy="true"` (ローディング中)
  - `aria-label` (アイコンのみの要素)
- 装飾的な要素には `aria-hidden="true"` を付与してください。

## 5. Git コミット規約

```
<type>: <subject>

# type の種類
# feat: 新機能
# fix: バグ修正
# refactor: リファクタリング
# style: スタイル変更（機能に影響しない）
# docs: ドキュメント
# chore: その他（ビルド設定、パッケージ更新等）
```

## 6. 禁止事項

- `@import` によるSCSSインポート（`@use` を使用すること）
- `any` 型の使用
- ハードコードされた色値（`colors.scss` の変数を使用すること）
- Tailwind CSS の使用（SCSS Modules を使用すること）

## 7. 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint 実行
```
