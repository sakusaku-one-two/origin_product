#!/bin/bash

# ユーザーをnginxに設定
sudo usermod -aG nginx ec2-user
sudo su - nginx


# nginxの設定ファイルを作成
cat <<EOF > /etc/nginx/nginx.conf
user nginx;

# エラーログのパスを設定
error_log /var/log/nginx/error.log;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;  

    sendfile on;
    keepalive_timeout 65;

    # WebSocketの設定
    map \$http_upgrade \$connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        listen 80;
        server_name ${DOMAIN_NAME};

        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Content-Security-Policy "default-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none'; base-uri 'self'; report-uri /csp-violation-report-endpoint" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin";
        
        root /usr/share/nginx/html/dist;
        index index.html index.htm;


        location /api/wss/ {
            proxy_pass http://${API_HOST}:8080/;
            proxy_http_version 1.1;
            proxy_set_header Cookie \$http_cookie;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection \$connection_upgrade;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_buffering off;
            proxy_redirect off;
            proxy_read_timeout 86400;
            proxy_send_timeout 86400;
        }

        location /api/ {
            proxy_pass http://${API_HOST}:8080/;
            proxy_set_header Host \$host;
            proxy_set_header Cookie \$http_cookie;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location /nginx/health {
            return 200;
        }

        location ~ {
            try_files \$uri \$uri/ /index.html;
        }   
    }
}
EOF

# nginxを起動
sudo systemctl enable nginx
sudo systemctl start nginx