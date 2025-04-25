import mysql from 'mysql2/promise';

// Konfigurasi koneksi database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Sesuaikan dengan password MySQL Anda
    database: 'rt_vote',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool; 