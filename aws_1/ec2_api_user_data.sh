#!/bin/bash

# エラーハンドリング設定
set -e  # エラー時に即座に終了
trap 'echo "エラーが発生しました。行番号: $LINENO"' ERR

# デバッグ用に環境変数の値を確認
echo "Current environment variables:"
echo "DB_HOST: $DB_HOST"
echo "DB_USER: $DB_USER"
echo "DB_PASSWORD: $DB_PASSWORD"
echo "DB_NAME: $DB_NAME"
echo "DB_PORT: $DB_PORT"

# 環境変数のチェック関数
check_env_vars() {
    local missing_vars=()
    
    # 必須の環境変数リスト
    local required_vars=(
        "DB_HOST"
        "DB_USER"
        "DB_PASSWORD"
        "DB_NAME"
        "DB_PORT"
    )
    
    # 各環境変数をチェック
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    # 未設定の変数がある場合はエラーメッセージを表示して終了
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo "Error: 以下の環境変数が設定されていません:"
        printf " - %s\n" "${missing_vars[@]}"
        echo "現在の環境変数の状態:"
        echo "DB_HOST: ${DB_HOST:-未設定}"
        echo "DB_USER: ${DB_USER:-未設定}"
        echo "DB_NAME: ${DB_NAME:-未設定}"
        echo "DB_PORT: ${DB_PORT:-未設定}"
        echo "DB_PASSWORD: ${DB_PASSWORD:+設定済み}"
        exit 1
    fi
    
    echo "✓ 全ての必要な環境変数が設定されています"
}

# ファイルの存在確認関数
check_required_files() {
    local files=("$@")
    for file in "${files[@]}"; do
        if [ ! -f "$file" ]; then
            echo "Error: 必要なファイル ${file} が見つかりません"
            exit 1
        fi
    done
    echo "✓ 必要なファイルの存在を確認しました"
}

# メイン処理の開始
echo "データベースセットアップを開始します..."

# 環境変数のチェックを実行
check_env_vars

# 必要なファイルの存在確認
check_required_files "./ec2_api_rds.sql"

# OSの判定とPostgreSQLクライアントのインストール
# echo "PostgreSQLクライアントをインストールしています..."
# if [ -f /etc/os-release ]; then
#     . /etc/os-release
#     case "$ID" in
#         "amzn")
#             # Amazon Linux 2の場合
#             if ! sudo amazon-linux-extras install postgresql14 -y; then
#                 echo "Error: PostgreSQLクライアントのインストールに失敗しました"
#                 exit 1
#             fi
#             ;;
#         "ubuntu"|"debian")
#             # Ubuntu/Debianの場合
#             if ! sudo apt-get update && sudo apt-get install -y postgresql-client; then
#                 echo "Error: PostgreSQLクライアントのインストールに失敗しました"
#                 exit 1
#             fi
#             ;;
#         *)
#             echo "Error: サポートされていないOSです: $ID"
#             exit 1
#             ;;
#     esac
# else
#     echo "Error: OSの判定ができません"
#     exit 1
# fi
sudo dnf update -y
sudo dnf install postgresql16 -y
echo "✓ PostgreSQLクライアントのインストールが完了しました"

# RDSへの接続を待機
MAX_TRIES=30
COUNTER=0

echo "RDSへの接続を確認しています..."
while ! PGPASSWORD=$DB_PASSWORD psql \
    -h $DB_HOST \
    -U $DB_USER \
    -d postgres \
    -p $DB_PORT \
    -c '\q' 2>/dev/null
do
    if [ $COUNTER -eq $MAX_TRIES ]; then
        echo "Error: RDSへの接続がタイムアウトしました"
        exit 1
    fi
    echo "⏳ RDSへの接続を待機中... ($COUNTER/$MAX_TRIES)"
    sleep 10
    COUNTER=$((COUNTER+1))
done
echo "✓ RDSへの接続が確認できました"

# テンプレートSQLファイルの処理
TEMPLATE_SQL_FILE="./ec2_api_rds.sql"
FINAL_SQL="final.sql"

echo "SQLテンプレートを処理しています..."
if ! sed -e "s/:'db_user'/${DB_USER}/g" \
        -e "s/:'db_password'/${DB_PASSWORD}/g" \
        -e "s/:'db_name'/${DB_NAME}/g" \
        -e "s/:'db_host'/${DB_HOST}/g" \
        "$TEMPLATE_SQL_FILE" > "$FINAL_SQL"; then
    echo "Error: SQLテンプレートの処理に失敗しました"
    exit 1
fi

# 置換結果の確認（パスワードは除く）
echo "生成されたSQLファイルの内容:"
grep -v "password" "$FINAL_SQL"
echo "✓ SQLテンプレートの処理が完了しました"

# データベースセットアップの実行
echo "データベースをセットアップしています..."
if ! PGPASSWORD=$DB_PASSWORD psql \
    -h $DB_HOST \
    -U $DB_USER \
    -d postgres \
    -p $DB_PORT \
    -f $FINAL_SQL; then
    echo "Error: データベースセットアップに失敗しました"
    exit 1
fi
echo "✓ データベースのセットアップが完了しました"

# スキーマの適用（存在する場合）
if [ -f "schema.sql" ]; then
    echo "テーブルを作成しています..."
    if ! PGPASSWORD=$DB_PASSWORD psql \
        -h $DB_HOST \
        -U $DB_USER \
        -d $DB_NAME \
        -f "schema.sql"; then
        echo "Error: テーブル作成に失敗しました"
        exit 1
    fi
    echo "✓ テーブルの作成が完了しました"
fi
# 置換前のファイル確認
echo "置換前:"
cat "$TEMPLATE_SQL_FILE"

# 置換後のファイル確認
echo "置換後:"
cat "$FINAL_SQL"

# 一時ファイルの削除
# rm -f "$FINAL_SQL"
echo "✓ 一時ファイルを削除しました"

echo "✨ データベースセットアップが正常に完了しました"
