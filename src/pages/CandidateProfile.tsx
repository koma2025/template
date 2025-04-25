import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Briefcase, ChevronLeft, GraduationCap, ListChecks, Target, User } from 'lucide-react';

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { candidates } = useData();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);
  
  useEffect(() => {
    const found = candidates.find(c => c.id === id);
    if (found) {
      setCandidate(found);
    } else {
      navigate('/404');
    }
  }, [id, candidates, navigate]);
  
  if (!candidate) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <div className="mx-auto bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-gray-500 text-xl">?</span>
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-4">Memuat profil kandidat...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <Link 
        to="/candidates" 
        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-6"
      >
        <ChevronLeft size={20} className="mr-1" />
        Kembali ke Daftar Kandidat
      </Link>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header section with photo and basic info */}
        <div className="relative h-48 md:h-64 bg-gray-200">
          <img 
            src={candidate.photo} 
            alt={candidate.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-white text-2xl md:text-3xl font-bold">{candidate.name}</h1>
            <p className="text-white/90">{candidate.kelurahan}</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Visi */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Target size={20} className="text-red-600 mr-2" />
              <h2 className="text-xl font-semibold">Visi</h2>
            </div>
            <p className="text-gray-700">{candidate.visi}</p>
          </div>
          
          {/* Misi */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <ListChecks size={20} className="text-red-600 mr-2" />
              <h2 className="text-xl font-semibold">Misi</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {candidate.misi.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          {/* Background & Experience */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <GraduationCap size={20} className="text-red-600 mr-2" />
                <h2 className="text-xl font-semibold">Latar Belakang</h2>
              </div>
              <p className="text-gray-700">{candidate.background}</p>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <Briefcase size={20} className="text-red-600 mr-2" />
                <h2 className="text-xl font-semibold">Pengalaman</h2>
              </div>
              <p className="text-gray-700">{candidate.experience}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Link 
          to="/vote" 
          className="btn-primary py-3 px-8 flex items-center"
        >
          <User size={18} className="mr-2" />
          Lanjut ke Halaman Voting
        </Link>
      </div>
    </div>
  );
};

export default CandidateProfile;
