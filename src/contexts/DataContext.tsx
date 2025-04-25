import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Candidate {
  id: string;
  name: string;
  photo: string;
  kelurahan: string;
  visi: string;
  misi: string[];
  background: string;
  experience: string;
  votes: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  kelurahan: string;
  important: boolean;
}

interface Resident {
  id: string;
  name: string;
  nik: string;
  kelurahan: string;
  hasVoted: boolean;
}

interface DataContextType {
  candidates: Candidate[];
  announcements: Announcement[];
  electionActive: boolean;
  electionEndDate: string;
  addVote: (candidateId: string) => void;
  getCandidatesByKelurahan: (kelurahan: string) => Candidate[];
  getAnnouncementsByKelurahan: (kelurahan: string) => Announcement[];
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  toggleElection: () => void;
  setElectionEndDate: (date: string) => void;
  residents: Resident[];
  fetchResidents: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initial data for demonstration
const initialCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Budi Santoso',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    kelurahan: 'Telanaipura',
    visi: 'Menjadikan RT yang aman, bersih, dan harmonis',
    misi: [
      'Meningkatkan keamanan lingkungan',
      'Mengadakan gotong royong rutin',
      'Meningkatkan fasilitas umum'
    ],
    background: 'Lulusan S1 Teknik Sipil Universitas Jambi',
    experience: 'Sekretaris RT periode 2018-2023',
    votes: 24
  },
  {
    id: 'c2',
    name: 'Siti Rahma',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    kelurahan: 'Telanaipura',
    visi: 'Mewujudkan RT yang maju, sejahtera, dan berbudaya',
    misi: [
      'Pemberdayaan ekonomi warga',
      'Peningkatan kualitas pendidikan anak-anak',
      'Pelestarian budaya lokal'
    ],
    background: 'Lulusan S2 Manajemen Universitas Indonesia',
    experience: 'Aktivis sosial dan pengurus PKK selama 10 tahun',
    votes: 18
  },
  {
    id: 'c3',
    name: 'Ahmad Ramadhan',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    kelurahan: 'Jelutung',
    visi: 'Menciptakan RT yang smart, bersih, dan religius',
    misi: [
      'Digitalisasi layanan RT',
      'Program RT bersih dan hijau',
      'Pembinaan kegiatan keagamaan'
    ],
    background: 'Lulusan S1 Ilmu Komputer Universitas Gadjah Mada',
    experience: 'Bendahara RT periode 2020-2023',
    votes: 15
  }
];

const initialAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Jadwal Pemilihan Ketua RT',
    content: 'Pemilihan Ketua RT akan dilaksanakan pada tanggal 10 Juli 2023 mulai pukul 08.00 WIB sampai dengan 14.00 WIB.',
    date: '2023-06-25T10:00:00',
    kelurahan: 'Telanaipura',
    important: true
  },
  {
    id: 'a2',
    title: 'Sosialisasi Aplikasi RT-Vote',
    content: 'Sosialisasi penggunaan aplikasi RT-Vote akan dilaksanakan pada hari Minggu, 2 Juli 2023 pukul 09.00 WIB di Balai Kelurahan Telanaipura.',
    date: '2023-06-28T15:30:00',
    kelurahan: 'Telanaipura',
    important: false
  },
  {
    id: 'a3',
    title: 'Pengumuman Hasil Pemilihan',
    content: 'Hasil pemilihan Ketua RT akan diumumkan pada tanggal 11 Juli 2023 pukul 10.00 WIB melalui aplikasi RT-Vote dan papan pengumuman kelurahan.',
    date: '2023-06-30T14:00:00',
    kelurahan: 'Jelutung',
    important: true
  }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [electionActive, setElectionActive] = useState(false);
  const [electionEndDate, setElectionEndDateState] = useState('2023-07-10T14:00:00');
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    // Initialize data from localStorage or use defaults
    const storedCandidates = localStorage.getItem('rt_vote_candidates');
    const storedAnnouncements = localStorage.getItem('rt_vote_announcements');
    const storedElectionStatus = localStorage.getItem('rt_vote_election_active');
    const storedElectionEndDate = localStorage.getItem('rt_vote_election_end_date');
    
    setCandidates(storedCandidates ? JSON.parse(storedCandidates) : initialCandidates);
    setAnnouncements(storedAnnouncements ? JSON.parse(storedAnnouncements) : initialAnnouncements);
    setElectionActive(storedElectionStatus ? JSON.parse(storedElectionStatus) : false);
    setElectionEndDateState(storedElectionEndDate || '2023-07-10T14:00:00');
    
    // Initialize data if not already present
    if (!storedCandidates) {
      localStorage.setItem('rt_vote_candidates', JSON.stringify(initialCandidates));
    }
    if (!storedAnnouncements) {
      localStorage.setItem('rt_vote_announcements', JSON.stringify(initialAnnouncements));
    }
  }, []);

  const addVote = (candidateId: string) => {
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    );
    setCandidates(updatedCandidates);
    localStorage.setItem('rt_vote_candidates', JSON.stringify(updatedCandidates));
  };

  const getCandidatesByKelurahan = (kelurahan: string) => {
    return candidates.filter(candidate => candidate.kelurahan === kelurahan);
  };

  const getAnnouncementsByKelurahan = (kelurahan: string) => {
    return announcements.filter(announcement => announcement.kelurahan === kelurahan);
  };

  const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate = {
      ...candidate,
      id: `c${Date.now()}`,
      votes: 0
    };
    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    localStorage.setItem('rt_vote_candidates', JSON.stringify(updatedCandidates));
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = {
      ...announcement,
      id: `a${Date.now()}`
    };
    const updatedAnnouncements = [...announcements, newAnnouncement];
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('rt_vote_announcements', JSON.stringify(updatedAnnouncements));
  };

  const toggleElection = () => {
    const newStatus = !electionActive;
    setElectionActive(newStatus);
    localStorage.setItem('rt_vote_election_active', JSON.stringify(newStatus));
  };

  const setElectionEndDate = (date: string) => {
    setElectionEndDateState(date);
    localStorage.setItem('rt_vote_election_end_date', date);
  };

  const fetchResidents = async () => {
    try {
      // Ambil data dari localStorage
      const storedUsers = JSON.parse(localStorage.getItem('rt_vote_users') || '[]');
      const usersList = storedUsers.filter((user: any) => !user.isAdmin);
      
      const formattedUsers = usersList.map((user: any) => ({
        id: user.id,
        name: user.name,
        nik: user.nik,
        kelurahan: user.kelurahan,
        hasVoted: user.hasVoted
      }));
      
      setResidents(formattedUsers);
    } catch (error) {
      console.error('Error fetching residents:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        candidates,
        announcements,
        electionActive,
        electionEndDate,
        addVote,
        getCandidatesByKelurahan,
        getAnnouncementsByKelurahan,
        addCandidate,
        addAnnouncement,
        toggleElection,
        setElectionEndDate,
        residents,
        fetchResidents
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
