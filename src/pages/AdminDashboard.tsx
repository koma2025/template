import React from 'react';
import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Bell, BarChart, ChevronRight, Pause, Play, Settings, UserCog, Users } from 'lucide-react';

// Admin sub-pages components would go here in a real app
// For now we'll just create placeholder components

const AdminHome = () => {
  const { candidates, announcements, electionActive, toggleElection, electionEndDate, setElectionEndDate } = useData();
  const [endDate, setEndDate] = useState(electionEndDate);
  
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  const totalCandidates = candidates.length;
  const totalAnnouncements = announcements.length;
  
  const handleToggleElection = () => {
    toggleElection();
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };
  
  const saveElectionDate = () => {
    setElectionEndDate(endDate);
  };
  
  return (
    <div>
      <h1 className="page-title">Dashboard Admin</h1>
      
      {/* Election Control */}
      <div className="card p-6 mb-8">
        <h2 className="section-title">Pengaturan Pemilihan</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${electionActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">Status: {electionActive ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
            <button
              onClick={handleToggleElection}
              className={`btn inline-flex items-center ${electionActive ? 'btn-outline' : 'btn-primary'}`}
            >
              {electionActive ? (
                <>
                  <Pause size={18} className="mr-1" />
                  Hentikan Pemilihan
                </>
              ) : (
                <>
                  <Play size={18} className="mr-1" />
                  Mulai Pemilihan
                </>
              )}
            </button>
          </div>
          
          <div className="flex-1">
            <div className="mb-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berakhir
              </label>
              <input
                type="datetime-local"
                id="endDate"
                className="input-field"
                value={endDate}
                onChange={handleDateChange}
              />
            </div>
            <button
              onClick={saveElectionDate}
              className="btn btn-secondary"
            >
              Simpan Tanggal
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Total Suara</h3>
            <BarChart size={20} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold">{totalVotes}</p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Jumlah Kandidat</h3>
            <Users size={20} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold">{totalCandidates}</p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Pengumuman</h3>
            <Bell size={20} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold">{totalAnnouncements}</p>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="card overflow-hidden">
        <h2 className="section-title p-6 pb-3 border-b">Menu Cepat</h2>
        
        <div className="divide-y">
          <Link to="/admin/candidates" className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center">
              <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Users size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">Kelola Kandidat</h3>
                <p className="text-sm text-gray-500">Tambah, edit, atau hapus kandidat</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
          
          <Link to="/admin/announcements" className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center">
              <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Bell size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">Kelola Pengumuman</h3>
                <p className="text-sm text-gray-500">Buat dan atur pengumuman</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
          
          <Link to="/admin/residents" className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center">
              <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <UserCog size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">Data Warga</h3>
                <p className="text-sm text-gray-500">Kelola data warga pemilih</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
          
          <Link to="/admin/settings" className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center">
              <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Settings size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">Pengaturan</h3>
                <p className="text-sm text-gray-500">Konfigurasi aplikasi</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Import admin sub-pages
import AdminCandidateManagement from './AdminCandidateManagement';
import AdminResidentsList from './AdminResidentsList';

// Placeholder components for admin sub-pages
const AdminAnnouncements = () => <div><h1 className="page-title">Kelola Pengumuman</h1><p>Halaman pengelolaan pengumuman akan ditampilkan di sini</p></div>;
const AdminSettings = () => <div><h1 className="page-title">Pengaturan</h1><p>Halaman pengaturan akan ditampilkan di sini</p></div>;

const AdminDashboard = () => {
  const location = useLocation();
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <div className="bg-red-50 rounded-lg p-4">
          <h2 className="font-semibold text-red-800 mb-1">Mode Admin</h2>
          <p className="text-red-700 text-sm">
            Anda sedang mengakses dashboard admin. Pastikan untuk keluar jika telah selesai.
          </p>
        </div>
      </div>
      
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="candidates" element={<AdminCandidateManagement />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="residents" element={<AdminResidentsList />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
