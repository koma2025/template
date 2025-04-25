import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  photo: string;
  kelurahan: string;
  visi: string;
  votes: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  showVotes?: boolean;
}

const CandidateCard = ({ candidate, showVotes = false }: CandidateCardProps) => {
  return (
    <div className="card overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={candidate.photo} 
          alt={candidate.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{candidate.name}</h3>
          <p className="text-white/80 text-sm">{candidate.kelurahan}</p>
        </div>
      </div>
      
      <div className="p-4">
        {showVotes && (
          <div className="mb-3">
            <span className="badge-primary">Perolehan Suara: {candidate.votes}</span>
          </div>
        )}
        
        <h4 className="font-medium text-gray-700 mb-2">Visi:</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{candidate.visi}</p>
        
        <Link 
          to={`/candidates/${candidate.id}`} 
          className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
        >
          Lihat Profil
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;
