
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT FROM pg_catalog.pg_roles WHERE rolname = 'MY_USER'
	) THEN
		CREATE ROLE MY_USER WITH PASSWORD 'SAKUSAKU' LOGIN;
	END IF;
EXCEPTION
	WHEN OTHERS THEN
		RAISE NOTICE 'MY_USER role already exists';
END $$;


DO $$ BEGIN
	IF NOT EXISTS (
		SELECT FROM pg_catalog.pg_database WHERE datname = 'ORIGINAL_PROJECTS'
	) THEN
		CREATE DATABASE ORIGINAL_PROJECTS OWNER MY_USER;
	END IF;
EXCEPTION
	WHEN OTHERS THEN
		RAISE NOTICE 'ORIGINAL_PROJECTS database already exists';
END $$;


-- #### 解説

-- 1. **`DO $$ BEGIN`**:
--    - **説明**: これは匿名のPL/pgSQLブロックの開始を示します。PostgreSQLでは、条件付きのロジックを実行するために使用します。
   
-- 2. **`IF NOT EXISTS (`**:
--    - **説明**: もし指定した条件が存在しない場合に、以下の処理を実行します。
   
-- 3. **`SELECT FROM pg_catalog.pg_roles WHERE rolname = 'MY_USER'`**:
--    - **説明**: `pg_roles` テーブルから `rolname` が `'MY_USER'` の行を選択します。これにより、`MY_USER` という名前のユーザーが既に存在するかどうかを確認します。
   
-- 4. **`) THEN`**:
--    - **説明**: 上記のユーザーが存在しない場合に、次の行のコマンドを実行します。
   
-- 5. **`CREATE ROLE MY_USER WITH PASSWORD 'SAKUSAKU' WITH LOGIN;`**:
--    - **説明**: 新しいユーザー `MY_USER` を作成し、パスワードを `'SAKUSAKU'` に設定します。また、`WITH LOGIN` により、このユーザーがログイン可能になります。
   
-- 6. **`END IF;`**:
--    - **説明**: `IF` ブロックの終了を示します。
   
-- 7. **`EXCEPTION`**:
--    - **説明**: エラーハンドリングの開始を示します。ここでは、上記の処理中にエラーが発生した場合の対応を定義します。
   
-- 8. **`WHEN OTHERS THEN`**:
--    - **説明**: すべての種類のエラー (`OTHERS`) に対して、以下の処理を実行します。
   
-- 9. **`RAISE NOTICE 'MY_USER role already exists';`**:
--    - **説明**: 通知メッセージ `'MY_USER role already exists'` を表示します。これにより、ユーザーが既に存在する場合にエラーを避けて通知します。
   
-- 10. **`END $$;`**:
--     - **説明**: `DO` ブロックの終了を示します。

-- ### 2つ目の `DO` ブロック：データベースの作成
