const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5175;

// Konfigurasi CORS
app.use(cors());
app.use(express.json());

// Serve static files dari folder dist (hasil build)
app.use(express.static(path.join(__dirname, 'dist')));

// Konfigurasi database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rt_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test koneksi database
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
        initializeDatabase(); // Selalu jalankan inisialisasi database
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        initializeDatabase();
    });

// Fungsi untuk inisialisasi database
async function initializeDatabase() {
    try {
        // Buat database jika belum ada
        await pool.execute('CREATE DATABASE IF NOT EXISTS rt_app');
        await pool.execute('USE rt_app');

        // Buat tabel users jika belum ada
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                nik VARCHAR(16) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                kelurahan VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                has_voted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Cek apakah sudah ada admin
        const [admins] = await pool.execute('SELECT * FROM users WHERE is_admin = 1');
        console.log('Current admin count:', admins.length);
        
        if (admins.length === 0) {
            // Buat admin default jika belum ada
            const adminPassword = await bcrypt.hash('admin123', 10);
            await pool.execute(
                'INSERT INTO users (id, name, nik, password, kelurahan, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
                ['admin-1', 'Admin', '1234567890123456', adminPassword, 'Semua', true]
            );
            console.log('Default admin created with NIK: 1234567890123456 and password: admin123');
        } else {
            console.log('Admin already exists');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// API Routes
app.post('/auth/login', async (req, res) => {
    try {
        const { nik, password, isAdminLogin } = req.body;
        console.log('Login attempt:', { nik, isAdminLogin });
        
        const [users] = await pool.execute('SELECT * FROM users WHERE nik = ?', [nik]);
        console.log('Found users:', users.length);
        
        if (users.length === 0) {
            console.log('No user found with NIK:', nik);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password validation:', validPassword);

        if (!validPassword) {
            console.log('Invalid password for NIK:', nik);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (isAdminLogin && !user.is_admin) {
            console.log('Non-admin user trying to login as admin:', nik);
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const transformedUser = {
            id: user.id,
            name: user.name,
            nik: user.nik,
            kelurahan: user.kelurahan,
            isAdmin: user.is_admin === 1,
            hasVoted: user.has_voted === 1
        };

        console.log('Login successful for user:', transformedUser.name);
        res.json({ user: transformedUser });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Semua route lainnya akan mengarah ke index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 