# front-end

## サーバー起動手順
1. `node -v`
    - Node.js の確認
        - `v00.00.0`みたいにバージョンが表示されているとOK  
        - nodeが入ってなかった場合は下記の「nodeが入ってない場合」に記載された内容を実施してください
1. `npm install`
    - 依存パッケージインストール
1. `npm run dev`
    - サーバー起動コマンド
    - 起動時にlocalhostのURLが表示される
1. ブラウザでローカルホストにアクセス
    - URLはサーバー起動時のログを参照

## nodeが入ってない場合
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