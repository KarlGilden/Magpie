CREATE DATABASE IF NOT EXISTS magpie;

USE magpie;

DROP TABLE IF EXISTS credentials;
DROP TABLE IF EXISTS auth_providers;
DROP TABLE IF EXISTS users;


-- ==========================
-- Users table: core account info
-- ==========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- Auth providers (Google, GitHub, credentials, etc.)
-- ==========================
CREATE TABLE auth_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider VARCHAR(50) NOT NULL,          -- e.g. 'credentials', 'google', 'github'
    provider_user_id VARCHAR(255) NOT NULL, -- ID from provider (or same as user_id for credentials)
    access_token VARCHAR(512),              -- optional (OAuth tokens, if stored)
    refresh_token VARCHAR(512),             -- optional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE (provider, provider_user_id),
    CHECK (provider IN ('credentials', 'google', 'github'))
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================
-- Credentials: only for local logins
-- ==========================
CREATE TABLE credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,          -- must point to auth_providers row with provider = 'credentials'
    password_hash VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (provider_id) REFERENCES auth_providers(id) ON DELETE CASCADE
);