const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5176;

// Konfigurasi CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5180'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

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
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        // Tambahkan inisialisasi database jika belum ada
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
        if (admins.length === 0) {
            // Buat admin default jika belum ada
            const adminPassword = await bcrypt.hash('admin123', 10);
            await pool.execute(
                'INSERT INTO users (id, name, nik, password, kelurahan, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
                ['admin-1', 'Admin', '1234567890123456', adminPassword, 'Semua', true]
            );
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Auth endpoints
app.post('/auth/login', async (req, res) => {
    try {
        console.log('Login attempt with:', { ...req.body, password: '***' });
        const { nik, password, isAdminLogin } = req.body;
        
        const [users] = await pool.execute('SELECT * FROM users WHERE nik = ?', [nik]);
        console.log('Found users:', users.length);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password validation:', validPassword);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (isAdminLogin && !user.is_admin) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        // Transform user object to match frontend expectations
        const transformedUser = {
            id: user.id,
            name: user.name,
            nik: user.nik,
            kelurahan: user.kelurahan,
            isAdmin: user.is_admin === 1,
            hasVoted: user.has_voted === 1
        };

        delete user.password;
        res.json({ user: transformedUser });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.get('/auth/admins', async (req, res) => {
    try {
        console.log('Fetching admin list');
        const [admins] = await pool.execute(
            'SELECT id, name FROM users WHERE is_admin = 1'
        );
        console.log('Found admins:', admins.length);
        
        // Transform admin objects to match frontend expectations
        const transformedAdmins = admins.map(admin => ({
            id: admin.id,
            name: admin.name
        }));
        
        res.json({ admins: transformedAdmins });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.post('/auth/register', async (req, res) => {
    try {
        const { name, nik, password, kelurahan } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await pool.execute(
            'INSERT INTO users (id, name, nik, password, kelurahan) VALUES (?, ?, ?, ?, ?)',
            [id, name, nik, hashedPassword, kelurahan]
        );

        const [users] = await pool.execute('SELECT id, name, nik, kelurahan, is_admin, has_voted FROM users WHERE id = ?', [id]);
        res.json({ user: users[0] });
    } catch (error) {
        console.error('Error registering:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'NIK already registered' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Candidates endpoints
app.get('/candidates', async (req, res) => {
    try {
        const [candidates] = await pool.execute('SELECT * FROM candidates');
        res.json(candidates);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/candidates/vote', async (req, res) => {
    try {
        const { candidateId, userId } = req.body;
        
        await pool.execute('START TRANSACTION');
        
        const [users] = await pool.execute(
            'SELECT has_voted FROM users WHERE id = ? FOR UPDATE',
            [userId]
        );

        if (users[0].has_voted) {
            await pool.execute('ROLLBACK');
            return res.status(400).json({ error: 'User has already voted' });
        }

        await pool.execute(
            'UPDATE candidates SET votes = votes + 1 WHERE id = ?',
            [candidateId]
        );

        await pool.execute(
            'UPDATE users SET has_voted = TRUE WHERE id = ?',
            [userId]
        );

        await pool.execute('COMMIT');
        res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
        await pool.execute('ROLLBACK');
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Announcements endpoints
app.get('/announcements', async (req, res) => {
    try {
        const [announcements] = await pool.execute('SELECT * FROM announcements ORDER BY date DESC');
        res.json(announcements);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset admin endpoint (HANYA UNTUK DEVELOPMENT)
app.post('/auth/reset-admin', async (req, res) => {
    try {
        // Hapus admin yang ada
        await pool.execute('DELETE FROM users WHERE is_admin = 1');
        
        // Buat admin baru
        const adminPassword = await bcrypt.hash('admin123', 10);
        await pool.execute(
            'INSERT INTO users (id, name, nik, password, kelurahan, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
            ['admin-1', 'Admin', '1234567890123456', adminPassword, 'Semua', true]
        );
        
        res.json({ message: 'Admin reset successful' });
    } catch (error) {
        console.error('Error resetting admin:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mendengarkan koneksi
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 