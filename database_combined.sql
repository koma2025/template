-- Hapus database jika sudah ada
DROP DATABASE IF EXISTS rt_app;

-- Buat database baru
CREATE DATABASE rt_app;
USE rt_app;

-- Tabel users (untuk warga dan admin)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    kelurahan VARCHAR(255) NOT NULL,
    kecamatan VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    has_voted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel candidates (untuk calon ketua RT)
CREATE TABLE candidates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255),
    kelurahan VARCHAR(255) NOT NULL,
    visi TEXT NOT NULL,
    misi JSON NOT NULL,
    background TEXT,
    experience TEXT,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel voting_records (untuk mencatat history voting)
CREATE TABLE voting_records (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    candidate_id VARCHAR(36) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- Tabel announcements (untuk pengumuman)
CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    kelurahan VARCHAR(255) NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel election_settings (untuk pengaturan pemilihan)
CREATE TABLE election_settings (
    id VARCHAR(36) PRIMARY KEY,
    is_active BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data awal untuk admin
INSERT INTO users (id, name, nik, password, kelurahan, kecamatan, is_admin) 
VALUES (
    'admin-1', 
    'Admin', 
    '1234567890123456', 
    '$2b$10$vgSwk8C2H6P6RYh8xElGe.nUzqH9T7upgSh4F9uPfUY0Ql.OYrpgq', -- password: admin123
    'Semua',
    'Semua',
    TRUE
);

-- Insert data pengaturan pemilihan awal
INSERT INTO election_settings (id, is_active, start_date, end_date)
VALUES (
    UUID(),
    FALSE,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 1 MONTH)
); 