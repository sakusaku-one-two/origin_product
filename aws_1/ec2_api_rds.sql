DO $$ BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = ":'db_user'"
    ) THEN
        CREATE ROLE :'db_user' WITH PASSWORD :'db_password';
        -- EXECUTE format('CREATE ROLE %I WITH PASSWORD %L LOGIN', :'db_user', :'db_password');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '%のロールは既に存在します', :'db_user';
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_database WHERE datname = ":'db_name'"
    ) THEN
        CREATE DATABASE :'db_name' OWNER :'db_user';
        -- EXECUTE format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '%のデータベースは既に存在します', :'db_name';
END $$;