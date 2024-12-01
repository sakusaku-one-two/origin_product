# Goの特定バージョンのDockerイメージをベースにする
FROM golang:1.23.0

# ワークディレクトリを/appに設定
WORKDIR /app

# go.modとgo.sumをコピーして依存関係を整理
COPY go.mod go.sum ./
RUN go mod tidy

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN go build -o main start.go

# ポート8080でリクエストを待ち受ける
EXPOSE 8080

# ビルドしたバイナリを実行
RUN ls -l


CMD ["ls", "-l"]
