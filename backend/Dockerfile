#goのドッカーイメージをベースにして、ワークディレクトリを/appにマウントする
FROM golang:latest

#ワークディレクトリを/appに設定
WORKDIR /app

#ワークディレクトリにgo.modとgo.sumをコピー
COPY go.mod go.sum ./

#ワークディレクトリにgo.modとgo.sumをコピー
COPY go.mod go.sum ./

#ワークディレクトリにmain.goをコピー

#ワークディレクトリにファイルをコピー
COPY . .

RUN go build -o main main.go



#go mod tidy パッケージを整理
RUN go mod tidy



#ワークディレクトリにDockerfileをコピー
COPY Dockerfile ./

CMD [ "go", "run", "main.go" ]

#ポート8080でリクエストを待ち受ける
EXPOSE 8080
