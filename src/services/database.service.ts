import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export interface User {
    id: string;
    name: string;
    nik: string;
    password: string;
    kelurahan: string;
    kecamatan: string;
    is_admin: boolean;
    has_voted: boolean;
}

export interface Candidate {
    id: string;
    name: string;
    photo_url: string;
    kelurahan: string;
    visi: string;
    misi: string[];
    background: string;
    experience: string;
    votes: number;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    kelurahan: string;
    is_important: boolean;
    created_at: Date;
}

class DatabaseService {
    // Test connection
    async testConnection(): Promise<boolean> {
        try {
            const [rows] = await pool.execute('SELECT 1');
            console.log('Database connection successful!');
            return true;
        } catch (error) {
            console.error('Database connection failed:', error);
            return false;
        }
    }

    // User operations
    async createUser(name: string, nik: string, password: string, kelurahan: string, kecamatan: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();
        
        await pool.execute(
            'INSERT INTO users (id, name, nik, password, kelurahan, kecamatan) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, nik, hashedPassword, kelurahan, kecamatan]
        );
        
        const user = await this.getUserById(id);
        if (!user) throw new Error('Failed to create user');
        return user;
    }

    async getUserByNik(nik: string): Promise<User | null> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM users WHERE nik = ?',
            [nik]
        );
        
        return rows[0] || null;
    }

    async getUserById(id: string): Promise<User | null> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
    }

    async verifyPassword(nik: string, password: string): Promise<boolean> {
        const user = await this.getUserByNik(nik);
        if (!user) return false;
        
        return bcrypt.compare(password, user.password);
    }

    // Candidate operations
    async createCandidate(candidateData: Omit<Candidate, 'id' | 'votes'>): Promise<Candidate> {
        const id = uuidv4();
        const { name, photo_url, kelurahan, visi, misi, background, experience } = candidateData;
        
        await pool.execute(
            'INSERT INTO candidates (id, name, photo_url, kelurahan, visi, misi, background, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, photo_url, kelurahan, visi, JSON.stringify(misi), background, experience]
        );
        
        const candidate = await this.getCandidateById(id);
        if (!candidate) throw new Error('Failed to create candidate');
        return candidate;
    }

    async getCandidatesByKelurahan(kelurahan: string): Promise<Candidate[]> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM candidates WHERE kelurahan = ?',
            [kelurahan]
        );
        
        return rows.map((row: any) => ({
            ...row,
            misi: JSON.parse(row.misi)
        }));
    }

    async getCandidateById(id: string): Promise<Candidate | null> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM candidates WHERE id = ?',
            [id]
        );
        
        if (!rows[0]) return null;
        
        return {
            ...rows[0],
            misi: JSON.parse(rows[0].misi)
        };
    }

    async recordVote(userId: string, candidateId: string): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Record vote
            await connection.execute(
                'INSERT INTO voting_records (id, user_id, candidate_id) VALUES (?, ?, ?)',
                [uuidv4(), userId, candidateId]
            );
            
            // Update user status
            await connection.execute(
                'UPDATE users SET has_voted = TRUE WHERE id = ?',
                [userId]
            );
            
            // Increment candidate votes
            await connection.execute(
                'UPDATE candidates SET votes = votes + 1 WHERE id = ?',
                [candidateId]
            );
            
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Announcement operations
    async createAnnouncement(title: string, content: string, kelurahan: string, isImportant: boolean): Promise<Announcement> {
        const id = uuidv4();
        
        await pool.execute(
            'INSERT INTO announcements (id, title, content, kelurahan, is_important) VALUES (?, ?, ?, ?, ?)',
            [id, title, content, kelurahan, isImportant]
        );
        
        const announcement = await this.getAnnouncementById(id);
        if (!announcement) throw new Error('Failed to create announcement');
        return announcement;
    }

    async getAnnouncementsByKelurahan(kelurahan: string): Promise<Announcement[]> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM announcements WHERE kelurahan = ? ORDER BY created_at DESC',
            [kelurahan]
        );
        
        return rows;
    }

    async getAnnouncementById(id: string): Promise<Announcement | null> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM announcements WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
    }

    // Election settings operations
    async getElectionSettings(): Promise<any> {
        const [rows]: any = await pool.execute('SELECT * FROM election_settings LIMIT 1');
        return rows[0] || null;
    }

    async updateElectionStatus(isActive: boolean): Promise<void> {
        await pool.execute(
            'UPDATE election_settings SET is_active = ?',
            [isActive]
        );
    }

    async updateElectionDates(startDate: Date, endDate: Date): Promise<void> {
        await pool.execute(
            'UPDATE election_settings SET start_date = ?, end_date = ?',
            [startDate, endDate]
        );
    }
}

export const databaseService = new DatabaseService();

// Test koneksi saat service diimpor
databaseService.testConnection(); 