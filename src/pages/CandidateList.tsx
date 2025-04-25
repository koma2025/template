import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import CandidateCard from '../components/CandidateCard';
import { Search, Users as UsersIcon } from 'lucide-react';

const CandidateList = () => {
  const { user } = useAuth();
  const { candidates } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter candidates by user's kelurahan
  const userKelurahanCandidates = candidates.filter(
    candidate => candidate.kelurahan === user?.kelurahan
  );
  
  // Search functionality
  const filteredCandidates = userKelurahanCandidates.filter(
    candidate => candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="page-container">
      <h1 className="page-title">Daftar Kandidat Ketua RT</h1>
      <p className="text-gray-600 mb-6">
        Lihat profil lengkap calon ketua RT untuk Kelurahan {user?.kelurahan}
      </p>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Cari kandidat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UsersIcon size={24} className="text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Belum ada kandidat yang terdaftar</p>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
