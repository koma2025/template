import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Bell, Calendar, Info } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Announcements = () => {
  const { user } = useAuth();
  const { announcements } = useData();
  const [userAnnouncements, setUserAnnouncements] = useState<any[]>([]);
  
  useEffect(() => {
    if (user) {
      // Filter announcements for the user's kelurahan
      const filtered = announcements
        .filter(announcement => announcement.kelurahan === user.kelurahan || announcement.kelurahan === 'Semua')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setUserAnnouncements(filtered);
    }
  }, [announcements, user]);
  
  return (
    <div className="page-container">
      <h1 className="page-title">Pengumuman</h1>
      <p className="text-gray-600 mb-8">
        Informasi penting terkait pemilihan Ketua RT di Kelurahan {user?.kelurahan}
      </p>
      
      {userAnnouncements.length > 0 ? (
        <div className="space-y-6">
          {userAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`card p-6 ${announcement.important ? 'border-l-4 border-l-red-500' : ''}`}
            >
              <div className="flex items-start">
                <div className={`${announcement.important ? 'bg-red-100' : 'bg-gray-100'} rounded-full p-2 mr-4 flex-shrink-0`}>
                  {announcement.important ? (
                    <Bell size={20} className="text-red-600" />
                  ) : (
                    <Info size={20} className="text-gray-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold">{announcement.title}</h2>
                    {announcement.important && (
                      <span className="badge-primary text-xs">Penting</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={14} className="mr-1" />
                    {format(new Date(announcement.date), 'dd MMMM yyyy, HH:mm', { locale: id })}
                  </div>
                  
                  <div className="text-gray-700 whitespace-pre-line">
                    {announcement.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Bell size={32} className="mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Belum Ada Pengumuman</h3>
          <p className="text-gray-500">
            Belum ada pengumuman untuk kelurahan Anda saat ini
          </p>
        </div>
      )}
    </div>
  );
};

export default Announcements;
