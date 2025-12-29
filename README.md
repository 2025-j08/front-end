# front-end

## サーバー起動手順

1. `node -v`
   - Node.js の確認
     - `v00.00.0`みたいにバージョンが表示されているとOK
     - nodeが入ってなかった場合は下記の「nodeが入ってない場合」に記載された内容を実施してください
1. `npm install`
   - 依存パッケージインストール
1. `npm run prepare`
   - lintの自動実行を有効化
1. `npm run dev`
   - サーバー起動コマンド
   - 起動時にlocalhostのURLが表示される
1. ブラウザでローカルホストにアクセス
   - URLはサーバー起動時のログを参照

### nodeが入ってない場合

1. `nvm -v`
   - node.jsのバージョン管理ツールであるnvmがインストール済みかチェック
     - インストール済みの場合は5番までスキップ
1. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
   - nvmのインストールコマンド
1. `source ~/.bashrc`
   - インストール後にターミナルを再読み込み
1. `nvm -v`
   - インストール確認(確認できなければ要相談)
1. `nvm install --lts`
   - nodeの最新安定版をインストール
1. `node -v`と`npm -v`
   - nodeとnpmのインストール確認
   - 確認できたら`npm install`に進む

## ローカルsupabase起動手順

- ※dockerインストール&起動済み前提

1. `cd /tmp`
   - バイナリファイルをダウンロードするためtmpに移動
1. `curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz \`
   - curlでsupabaseCLIのバイナリファイルをダウンロード
1. `sudo mv supabase /usr/local/bin/`
   - ダウンロードしたファイルを再配置
1. `supabase --version`
   - 無事バージョン確認できたら`プロジェクトのルートディレクトリ`に戻る
1. `supabase start`
   - docker上でsupabaseを起動するコマンド
   - 起動してるポート
     1. http://127.0.0.1:54321
        - DBへのアクセスポイント(機能実装する際はenbファイルに記述しておくこと)
     1. http://127.0.0.1:54323
        - GUIの管理ページ(テーブル状態等諸々確認できる)

## ディレクトリ解説

### ルートディレクトリ

| ディレクトリ名  | 説明                                                         |
| --------------- | ------------------------------------------------------------ |
| `src/`          | アプリケーションのソースコード全体を格納するディレクトリ     |
| `public/`       | 画像やフォントなどの静的ファイルを配置するディレクトリ       |
| `.husky/`       | Git コミット時の自動チェック（lint等）を管理するディレクトリ |
| `.vscode/`      | VS Code の設定ファイルを格納するディレクトリ                 |
| `.next/`        | Next.js のビルド結果が自動生成されるディレクトリ             |
| `node_modules/` | npm でインストールしたパッケージが格納されるディレクトリ     |

### src ディレクトリの構成

| ディレクトリ名    | 説明                                                             | 配置するファイルの例                            |
| ----------------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| `src/app/`        | Next.js のページやレイアウトを配置するディレクトリ（App Router） | `page.tsx`, `layout.tsx`, `loading.tsx`         |
| `src/components/` | 複数のページで共通利用するUIコンポーネントを配置                 | `Button.tsx`, `Header.tsx`, `Modal.tsx`         |
| `src/features/`   | 機能ごとにまとめたコンポーネントやロジックを配置                 | `auth/LoginForm.tsx`, `contact/ContactForm.tsx` |
| `src/hooks/`      | カスタムフック（ロジックの再利用）を配置                         | `useAuth.ts`, `useForm.ts`                      |
| `src/types/`      | TypeScript の型定義ファイルを配置                                | `user.ts`, `api.ts`                             |
| `src/lib/`        | ライブラリやユーティリティ関数を配置                             | `api.ts`, `utils.ts`, `validation.ts`           |
| `src/styles/`     | CSS や スタイル関連のファイルを配置                              | `globals.css`, `theme.ts`                       |
| `src/const/`      | アプリケーション全体で使う定数を配置                             | `routes.ts`, `config.ts`                        |
| `src/dummy_data/` | 開発時に使うダミーデータを配置                                   | `users.json`, `sample.ts`                       |
