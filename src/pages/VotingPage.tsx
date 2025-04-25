import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Clock, Check, X } from 'lucide-react';

const VotingPage = () => {
  const { user, markAsVoted } = useAuth();
  const { candidates, addVote, electionActive } = useData();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteComplete, setVoteComplete] = useState(false);
  const navigate = useNavigate();
  
  // Filter candidates by user's kelurahan
  const userKelurahanCandidates = candidates.filter(
    candidate => candidate.kelurahan === user?.kelurahan
  );
  
  const handleSelect = (candidateId: string) => {
    if (!user?.hasVoted && electionActive) {
      setSelectedCandidate(candidateId);
    }
  };
  
  const handleVoteClick = () => {
    if (selectedCandidate) {
      setShowConfirmation(true);
    }
  };
  
  const confirmVote = () => {
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    
    // Simulate network delay
    setTimeout(() => {
      addVote(selectedCandidate);
      markAsVoted();
      setIsVoting(false);
      setVoteComplete(true);
      
      // Redirect to results after voting
      setTimeout(() => {
        navigate('/results');
      }, 3000);
    }, 1500);
  };
  
  if (!electionActive) {
    return (
      <div className="page-container">
        <div className="text-center bg-yellow-50 py-12 px-4 rounded-xl border border-yellow-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
            <Clock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pemilihan Belum Dimulai</h1>
          <p className="text-gray-600 mb-6">
            Pemilihan Ketua RT belum dimulai. Silakan kembali nanti saat jadwal pemilihan telah dibuka.
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }
  
  if (user?.hasVoted) {
    return (
      <div className="page-container">
        <div className="text-center bg-green-50 py-12 px-4 rounded-xl border border-green-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Anda Telah Memberikan Suara</h1>
          <p className="text-gray-600 mb-6">
            Terima kasih telah berpartisipasi dalam pemilihan Ketua RT.
            Suara Anda telah disimpan dalam sistem.
          </p>
          <button 
            onClick={() => navigate('/results')}
            className="btn-primary"
          >
            Lihat Hasil Pemilihan
          </button>
        </div>
      </div>
    );
  }
  
  if (voteComplete) {
    return (
      <div className="page-container">
        <div className="text-center bg-green-50 py-12 px-4 rounded-xl border border-green-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pemilihan Berhasil!</h1>
          <p className="text-gray-600 mb-6">
            Terima kasih telah berpartisipasi dalam pemilihan Ketua RT.
            Anda akan dialihkan ke halaman hasil pemilihan...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <h1 className="page-title">Pemilihan Ketua RT</h1>
      <p className="text-gray-600 mb-8">
        Pilih salah satu kandidat di bawah ini dengan mengklik pada profilnya
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {userKelurahanCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className={`
              card cursor-pointer overflow-hidden transition-all duration-200
              ${selectedCandidate === candidate.id ? 'ring-2 ring-red-500' : 'hover:shadow-lg'}
            `}
            onClick={() => handleSelect(candidate.id)}
          >
            <div className="relative h-48 bg-gray-200">
              <img 
                src={candidate.photo} 
                alt={candidate.name} 
                className="w-full h-full object-cover"
              />
              {selectedCandidate === candidate.id && (
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-bold text-lg">{candidate.name}</h3>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-medium text-gray-700 mb-2">Visi:</h4>
              <p className="text-gray-600 text-sm">{candidate.visi}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          className="btn-primary py-3 px-8"
          disabled={!selectedCandidate}
          onClick={handleVoteClick}
        >
          Pilih Kandidat Ini
        </button>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Konfirmasi Pilihan</h3>
              <button onClick={() => setShowConfirmation(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-6">
              Anda akan memilih <strong>{userKelurahanCandidates.find(c => c.id === selectedCandidate)?.name}</strong> sebagai Ketua RT. 
              Pilihan ini tidak dapat diubah setelah dikonfirmasi.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                className="btn-secondary"
                onClick={() => setShowConfirmation(false)}
                disabled={isVoting}
              >
                Batal
              </button>
              <button
                className="btn-primary"
                onClick={confirmVote}
                disabled={isVoting}
              >
                {isVoting ? 'Memproses...' : 'Konfirmasi Pilihan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;
