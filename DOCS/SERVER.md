├── DockerFile               # バックエンド用のDocker設定ファイル
├── go.mod                   # Goモジュールの依存関係を管理するファイル
├── go.sum                   # 依存関係のチェックサムを記録するファイル
├── main.go                  # アプリケーションのエントリーポイント
├── plan.txt                 # プロジェクト計画書やメモ
├── server
│   ├── controls
│   │   ├── cash
│   │   │   └── locationToEmp.go      # キャッシュ関連のコントローラ
│   │   ├── code.txt                   # コードに関するメモ
│   │   ├── controls.go                # コントローラ全般
│   │   ├── csvICheck.go               # CSVチェック機能
│   │   ├── csvToCreateModel.go        # CSVからモデルを作成する機能
│   │   ├── csvhelper.go               # CSVヘルパー関数
│   │   ├── getRecords.go              # レコード取得機能
│   │   ├── insertRecord.go            # レコード挿入機能
│   │   ├── login.go                   # ログイン機能
│   │   ├── logout.go                  # ログアウト機能
│   │   └── websocket.go               # WebSocket機能
│   ├── middlewares
│   │   ├── jwtMiddleware.go           # JWT認証ミドルウェア
│   │   └── middlewqe.go               # その他HTTPに関するミドルウェア
│   ├── models
│   │   ├── abc_code.txt               # モデル関連のコードメモ
│   │   ├── channels.go                # チャンネルモデル
│   │   ├── dbClient.go                # データベースクライアント設定
│   │   ├── recordCache.go             # レコードキャッシュモデル
│   │   ├── recordRepository.go        # レコードリポジトリ
│   │   ├── records.go                 # レコードモデル
│   │   ├── repositoryDemon.go         # リポジトリのデーモン処理
│   │   └── user.go                    # ユーザーモデル
│   └── server.go                      # サーバーの設定と起動
└── store
    ├── DockerFile                       # データベース用のDocker設定ファイル
    └── init.sql                          # 初期化用のSQLスクリプト