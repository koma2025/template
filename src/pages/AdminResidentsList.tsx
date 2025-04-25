import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Download, Filter, Search } from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  nik: string;
  kelurahan: string;
  has_voted: boolean;
  created_at: string;
}

const AdminResidentsList = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { fetchResidents } = useData();
  
  // Get all unique kelurahans
  const allKelurahans = [
    'Semua',
    ...new Set(residents.map(resident => resident.kelurahan))
  ];
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }

    const loadData = async () => {
      try {
        await fetchResidents();
        setLoading(false);
      } catch (error) {
        setError('Gagal memuat data warga');
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter residents when search term or kelurahan changes
  useEffect(() => {
    let filtered = residents;
    
    // Filter by kelurahan
    if (selectedKelurahan !== 'Semua') {
      filtered = filtered.filter(resident => resident.kelurahan === selectedKelurahan);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resident => 
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.nik.includes(searchTerm)
      );
    }
    
    setFilteredResidents(filtered);
  }, [searchTerm, selectedKelurahan, residents]);
  
  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Nama', 'NIK', 'Kelurahan', 'Status Voting', 'Tanggal Daftar'];
    const rows = filteredResidents.map(resident => [
      resident.name,
      resident.nik,
      resident.kelurahan,
      resident.has_voted ? 'Sudah Memilih' : 'Belum Memilih',
      new Date(resident.created_at).toLocaleDateString('id-ID')
    ]);
    
    // Generate CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `warga_${selectedKelurahan}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Daftar Warga
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Menampilkan semua warga yang terdaftar dalam sistem
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="Cari berdasarkan nama atau NIK..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex items-center">
                  <Filter size={18} className="text-gray-400 mr-2" />
                  <select
                    className="input-field"
                    value={selectedKelurahan}
                    onChange={(e) => setSelectedKelurahan(e.target.value)}
                  >
                    {allKelurahans.map((kelurahan) => (
                      <option key={kelurahan} value={kelurahan}>
                        {kelurahan}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={exportToCSV}
                  className="btn-secondary flex items-center justify-center"
                >
                  <Download size={18} className="mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIK
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelurahan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResidents.map((resident) => (
                  <tr key={resident.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resident.nik}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resident.kelurahan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resident.has_voted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {resident.has_voted ? 'Sudah Memilih' : 'Belum Memilih'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResidentsList;
