# Goの特定バージョンのDockerイメージをベースにする
FROM golang:1.23.0

# 環境変数を設定

# ENV DB_HOST=db
# ENV DB_USER=MY_USER
# ENV DB_PASSWORD=SAKUSAKU
# ENV DB_NAME=ORIGINAL_PROJECTS
# ENV DB_PORT=5432
# ENV DB_SSL=disable
# ENV DB_TIMEZONE=Asia/Tokyo

 # ビルド時の引数を定義
 ARG DB_HOST
 ARG DB_USER
 ARG DB_PASSWORD
 ARG DB_NAME
 ARG DB_SSL
 ARG DB_TIMEZONE
 ARG AllowOrigin
 ARG DB_PORT

 # 環境変数として設定
 ENV DB_HOST=${DB_HOST}
 ENV DB_USER=${DB_USER}
 ENV DB_PASSWORD=${DB_PASSWORD}
 ENV DB_NAME=${DB_NAME}
 ENV DB_SSL=${DB_SSL}
 ENV DB_TIMEZONE=${DB_TIMEZONE}
 ENV AllowOrigin=${AllowOrigin}
 ENV DB_PORT=${DB_PORT}

# ワークディレクトリを/appに設定
WORKDIR /app

# go.modとgo.sumをコピーして依存関係を整理
COPY go.mod go.sum ./
RUN go mod tidy

# ソースコードをコピー
COPY . .

# アプリケーションをビルド

# ポート8080でリクエストを待ち受ける
EXPOSE 8080

# ビルドしたバイナリを実行
RUN ls -l

RUN go build -v -o main main.go

RUN chmod +x ./main   

CMD ["./main"]

