-- Create database
CREATE DATABASE IF NOT EXISTS rt_app;
USE rt_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    kelurahan VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    has_voted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    kelurahan VARCHAR(255) NOT NULL,
    vision TEXT,
    mission TEXT,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    kelurahan VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (id, name, nik, password, kelurahan, is_admin)
VALUES (
    'admin-1',
    'Admin',
    '1234567890123456',
    '$2b$10$8KzaNdKwZ8P54UzQgpB3yOJvGYyIQhsLtN7sIE/pxe2IvS8weyDgG', -- password: admin123
    'Semua',
    TRUE
)
ON DUPLICATE KEY UPDATE id=id; 