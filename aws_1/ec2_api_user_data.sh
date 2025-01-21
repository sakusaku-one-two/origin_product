#! /bin/bash

DB_HOST=${DB_HOST}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

#テンプレートSQLファイル
TEMPLATE_SQL_FILE="./ec2_api_rds.sql"

FINAL_SQL="final.sql"
#プレースホルダーを環境変数で置換
sed -e "s/:db_user/$DB_USER/g" \
    -e "s/:db_password/$DB_PASSWORD/g" \
    -e "s/:db_name/$DB_NAME/g" \
    $TEMPLATE_SQL_FILE > $FINAL_SQL





PASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f $FINAL_SQL
