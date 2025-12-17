# Copilot Instructions for front-end

あなたは、このプロジェクトの専属シニアエンジニアとして振る舞ってください。
コードを提案・修正する際は、以下のルールを厳守してください。

## 1. 基本方針

- **言語**: 回答や解説はすべて「日本語」で行ってください。
- **正確さ**: 指摘理由や背景情報などを適切な文量で正確に提示してください。
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
├── facilities/     # 施設一覧関連
└── facilitydetail/ # 施設詳細関連
    ├── components/ # 機能固有のコンポーネント
    └── hooks/      # 機能固有のカスタムフック
```

## 4. パスエイリアス

`@/` を使用して `src/` からの絶対パスでインポートできます。

```typescript
// 推奨
import { FormField } from '@/components/form';

// 非推奨
import { FormField } from '../../../components/form';
```

## 5. コーディング規約

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

#### カラー変数のカテゴリ

| カテゴリ   | 変数例                             | 用途                   |
| ---------- | ---------------------------------- | ---------------------- |
| 基本色     | `$white`, `$black`                 | 汎用                   |
| プライマリ | `$primary-color`                   | サイト全体のアクセント |
| フォーム   | `$form-primary`, `$form-input-bg`  | フォーム要素専用       |
| ステータス | `$error-color`, `$success-color`   | エラー・成功表示       |
| テキスト   | `$text-primary`, `$text-secondary` | 文字色                 |

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

## 6. Git コミット規約

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

> **注意**: コミット時に lint-staged が自動実行されます。ESLint エラーがあるとコミットがブロックされるため、事前に `npm run lint` で確認してください。

## 7. 禁止事項

| 禁止項目                       | 代替手段                   |
| ------------------------------ | -------------------------- |
| `@import` によるSCSSインポート | `@use` を使用              |
| `any` 型の使用                 | 適切な型定義を行う         |
| ハードコードされた色値         | `colors.scss` の変数を使用 |
| Tailwind CSS の使用            | SCSS Modules を使用        |

## 8. 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint 実行
```
