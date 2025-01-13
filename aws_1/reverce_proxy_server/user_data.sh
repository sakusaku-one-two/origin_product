#! /bin/bash

yum update -y
yum install -y nginx

# nginxの起動
systemctl start nginx

# nginxの自動起動設定
systemctl enable nginx

# nginxの設定ファイルを作成
cat <<EOF > /etc/nginx/nginx.conf
user nginx;
error_log /var/log/nginx/error.log;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;  

    sendfile on; # ファイル送信を最適化するための設定。カーネル空間からユーザー空間へのコピーを省略し、直接ネットワークにファイルを送信することで効率化します。
    keepalive_timeout 65;

    # WebSocketの設定
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    # server {
    #     listen 80;
    #     server_name api localhost;
    #     # HTTPからHTTPSへのリダイレクト
    #     return 301 https://$host$request_uri;
    # }

    server {
        # ポート番号
        listen 80;
        server_name ${api_server_name};

        # SSL証明書の設定
        # ssl_certificate /etc/nginx/certificate.crt;
        # ssl_certificate_key /etc/nginx/private.key;

        # セキュリティヘッダーの設定
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Content-Security-Policy "default-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none'; base-uri 'self'; report-uri /csp-violation-report-endpoint" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin";
        
        # WebSocketの設定
        location /api/wss/ {
            proxy_pass http://${api_server_name}:8080/; # クライアントからのリクエストを内部のWebSocketサーバーに送ります。
            proxy_http_version 1.1; # 通信に使用するHTTPのバージョンを1.1に設定します。
            proxy_set_header Cookie $http_cookie;
            proxy_set_header Upgrade $http_upgrade; # 接続をWebSocketにアップグレードするためのヘッダーを設定します。
            proxy_set_header Connection $connection_upgrade; # コネクションの維持に関するヘッダーを設定します。
            proxy_set_header Host $host; # クライアントがアクセスしているホスト名をサーバーに送信します。
            proxy_set_header X-Real-IP $remote_addr; # クライアントの実際のIPアドレスをサーバーに伝えます。
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # クライアントが通過したプロキシの情報をサーバーに送信します。
            proxy_set_header X-Forwarded-Proto $scheme; # 使用されたプロトコル（httpまたはhttps）をサーバーに伝えます。
            proxy_buffering off; # データの一時保存（バッファリング）を無効にして、リアルタイム性を高めます。
            proxy_redirect off; # リダイレクトを無効にして、オリジナルのリクエストURLを保持します。
            proxy_read_timeout 86400; # サーバーからのレスポンスを待つ最大時間を24時間に設定します。
            proxy_send_timeout 86400; # クライアントへのデータ送信を待つ最大時間を24時間に設定します。
        }

        # 通常のAPIリクエストの設定
        location /api/ {
            proxy_pass http://${api_server_name}:8080/;
            proxy_set_header Host $host;
            proxy_set_header Cookie $http_cookie;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
        }   
    }
}
EOF
