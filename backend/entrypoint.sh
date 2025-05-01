#! /bin/bash

# ホストのIPアドレスを取得
HostIp=$(hostname -I | awk '{print $1}')

# 環境変数を現在のシェルセッションで設定
export AllowOrigin=${HostIp}

# アプリケーションを起動
exec "$@"
