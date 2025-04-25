import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Bell, Calendar, BarChart, Check, ChevronRight, Clock, Maximize, Minimize, Users, Vote } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// Interface untuk webkit fullscreen
interface WebkitDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
}

interface WebkitHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

const Home = () => {
  const { user } = useAuth();
  const { announcements, electionActive, electionEndDate, candidates } = useData();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [localAnnouncements, setLocalAnnouncements] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Format the election end date
  const formattedEndDate = new Date(electionEndDate);
  
  // Filter announcements for the user's kelurahan
  useEffect(() => {
    if (user) {
      const filtered = announcements
        .filter(announcement => announcement.kelurahan === user.kelurahan || announcement.kelurahan === 'Semua')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      
      setLocalAnnouncements(filtered);
    }
  }, [announcements, user]);
  
  // Update time left calculation
  useEffect(() => {
    if (!electionActive) {
      setTimeLeft('Belum dimulai');
      return;
    }
    
    const updateTimeLeft = () => {
      const now = new Date();
      const end = new Date(electionEndDate);
      
      if (now >= end) {
        setTimeLeft('Pemilihan telah selesai');
        return;
      }
      
      const distance = formatDistanceToNow(end, { locale: id, addSuffix: true });
      setTimeLeft(distance);
    };
    
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 60000);
    
    return () => clearInterval(timer);
  }, [electionActive, electionEndDate]);
  
  // Count candidates in user's kelurahan
  const candidateCount = user 
    ? candidates.filter(c => c.kelurahan === user.kelurahan).length 
    : 0;
    
  // Fullscreen functionality
  const toggleFullscreen = async () => {
    try {
      const doc = document as WebkitDocument;
      const docEl = document.documentElement as WebkitHTMLElement;

      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        // Request fullscreen
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const doc = document as WebkitDocument;
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white mb-8">
        <div className="md:flex md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name}</h1>
            <p>Kelurahan {user?.kelurahan}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-lg">
              <Clock size={18} className="mr-2" />
              <span>Status: {electionActive ? 'Pemilihan Aktif' : 'Menunggu Pemilihan'}</span>
            </div>
            <button 
              onClick={toggleFullscreen}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
              title={isFullscreen ? "Keluar dari Layar Penuh" : "Masuk ke Layar Penuh"}
            >
              {isFullscreen ? (
                <>
                  <Minimize size={18} />
                  <span className="hidden sm:inline">Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Maximize size={18} />
                  <span className="hidden sm:inline">Layar Penuh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Election Status */}
      <div className="card mb-8 p-6">
        <h2 className="section-title">Status Pemilihan</h2>
        
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Calendar size={20} className="text-red-600 mr-2" />
              <span className="font-medium">
                {electionActive 
                  ? `Berakhir: ${format(formattedEndDate, 'dd MMMM yyyy, HH:mm', { locale: id })}` 
                  : 'Jadwal pemilihan belum dimulai'}
              </span>
            </div>
            <div className="flex items-center">
              <Clock size={20} className="text-red-600 mr-2" />
              <span>{timeLeft}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user?.hasVoted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {user?.hasVoted ? (
                <>
                  <Check size={16} className="mr-1" />
                  Anda telah memilih
                </>
              ) : (
                <>
                  <Vote size={16} className="mr-1" />
                  Anda belum memilih
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="section-title">Menu Utama</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Candidate List */}
          <Link to="/candidates" className="card p-5 hover:border-red-200 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Daftar Kandidat</h3>
                  <p className="text-sm text-gray-600">{candidateCount} kandidat</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </Link>
          
          {/* Voting */}
          <Link to="/vote" className="card p-5 hover:border-red-200 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Vote size={20} className="text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Votingku</h3>
                  <p className="text-sm text-gray-600">
                    {user?.hasVoted ? 'Sudah memilih' : 'Belum memilih'}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </Link>
          
          {/* Results */}
          <Link to="/results" className="card p-5 hover:border-red-200 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <BarChart size={20} className="text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Hasil Pemilihan</h3>
                  <p className="text-sm text-gray-600">
                    {electionActive ? 'Sedang berlangsung' : 'Belum dimulai'}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
      
      {/* Recent Announcements */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title mb-0">Pengumuman Terbaru</h2>
          <Link to="/announcements" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center">
            Lihat Semua
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {localAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {localAnnouncements.map((announcement) => (
              <div key={announcement.id} className="card p-5">
                <div className="flex items-start">
                  <div className={`bg-red-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${announcement.important ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <Bell size={18} className={announcement.important ? 'text-red-600' : 'text-gray-600'} />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      {announcement.important && (
                        <span className="ml-2 badge-primary">Penting</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(announcement.date), 'dd MMM yyyy', { locale: id })}
                    </p>
                    <p className="mt-2 text-gray-700">{announcement.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Bell size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Belum ada pengumuman untuk kelurahan Anda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
