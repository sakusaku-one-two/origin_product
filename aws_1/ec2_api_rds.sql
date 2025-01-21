DO $$ BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = ':db_user'
    ) THEN
        CREATE ROLE :db_user WITH PASSWORD ':db_password' LOGIN;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE ':db_user role already exists';
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_database WHERE datname = ':db_name'
    ) THEN
        CREATE DATABASE :db_name OWNER :db_user;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE ':db_name database already exists';
END $$;