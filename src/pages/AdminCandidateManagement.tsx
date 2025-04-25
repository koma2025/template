import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

interface CandidateFormData {
  id?: string;
  name: string;
  photo: string;
  kelurahan: string;
  visi: string;
  misi: string[];
  background: string;
  experience: string;
}

interface JambiLocations {
  [key: string]: string[];
}

const jambiLocations: JambiLocations = {
  "Danau Teluk": ["Olak Kemang", "Pasir Panjang", "Tanjung Raden", "Tanjung Pasir", "Ulu Gedong"],
  "Jambi Selatan": ["Pakuan Baru", "The Hok", "Wijaya Pura", "Tambak Sari", "Talang Bakung"],
  "Jambi Timur": ["Tanjung Pinang", "Budiman", "Sulanjana", "Kasang Jaya", "Kasang"],
  "Jelutung": ["Jelutung", "Cempaka Putih", "Handil Jaya", "Lebak Bandung", "Payo Lebar"],
  "Kota Baru": ["Simpang III Sipin", "Sungai Putri", "Mayang Mangurai", "Selamat", "Legok"],
  "Pasar Jambi": ["Pasar Jambi", "Beringin", "Sungai Asam", "Orang Kayo Hitam", "Pasar"],
  "Pelayangan": ["Tahtul Yaman", "Mudung Laut", "Pelayangan", "Tanjung Johor", "Arab Melayu"],
  "Telanaipura": ["Telanaipura", "Solok Sipin", "Selamat", "Murni", "Sungai Putri"],
  "Alam Barajo": ["Bagan Pete", "Kenali Besar", "Rawasari", "Mayang", "Pematang Sulur"],
  "Paal Merah": ["Paal Merah", "Talang Banjar", "Sejinjang", "Paal V", "Lingkar Selatan"],
  "Danau Sipin": ["Danau Sipin", "Legok", "Tanjung Lumpur", "Rajawali", "Selamat"]
};

const AdminCandidateManagement = () => {
  const { candidates, addCandidate } = useData();
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<CandidateFormData | null>(null);
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    photo: '',
    kelurahan: 'Telanaipura',
    visi: '',
    misi: [''],
    background: '',
    experience: ''
  });
  
  const [kecamatan, setKecamatan] = useState('Telanaipura');
  const [kelurahanList, setKelurahanList] = useState<string[]>(jambiLocations['Telanaipura']);
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      photo: '',
      kelurahan: 'Telanaipura',
      visi: '',
      misi: [''],
      background: '',
      experience: ''
    });
    setKecamatan('Telanaipura');
    setKelurahanList(jambiLocations['Telanaipura']);
  };
  
  // Update kelurahan list when kecamatan changes
  useEffect(() => {
    if (jambiLocations[kecamatan]) {
      setKelurahanList(jambiLocations[kecamatan]);
      setFormData(prev => ({
        ...prev,
        kelurahan: jambiLocations[kecamatan][0]
      }));
    }
  }, [kecamatan]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle misi changes
  const handleMisiChange = (index: number, value: string) => {
    const newMisi = [...formData.misi];
    newMisi[index] = value;
    setFormData(prev => ({
      ...prev,
      misi: newMisi
    }));
  };
  
  // Add new misi field
  const addMisiField = () => {
    setFormData(prev => ({
      ...prev,
      misi: [...prev.misi, '']
    }));
  };
  
  // Remove misi field
  const removeMisiField = (index: number) => {
    const newMisi = [...formData.misi];
    newMisi.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      misi: newMisi.length ? newMisi : ['']
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.photo || !formData.visi || !formData.background || !formData.experience) {
      alert('Semua field harus diisi');
      return;
    }
    
    if (formData.misi.some(item => !item.trim())) {
      alert('Semua misi harus diisi');
      return;
    }
    
    if (isEditMode && currentCandidate) {
      // Update existing candidate
      const updatedCandidates = candidates.map(c => 
        c.id === currentCandidate.id ? { ...formData, id: c.id, votes: c.votes } : c
      );
      
      // Update local storage
      localStorage.setItem('rt_vote_candidates', JSON.stringify(updatedCandidates));
      
      // Reset state
      setIsEditMode(false);
      setCurrentCandidate(null);
    } else {
      // Add new candidate
      addCandidate({
        name: formData.name,
        photo: formData.photo,
        kelurahan: formData.kelurahan,
        visi: formData.visi,
        misi: formData.misi,
        background: formData.background,
        experience: formData.experience
      });
      
      setIsAddMode(false);
    }
    
    resetForm();
  };
  
  // Edit candidate
  const handleEdit = (candidate: any) => {
    // Find kecamatan for this kelurahan
    let candidateKecamatan = 'Telanaipura';
    for (const [kec, kel] of Object.entries(jambiLocations)) {
      if ((kel as string[]).includes(candidate.kelurahan)) {
        candidateKecamatan = kec;
        break;
      }
    }
    
    setKecamatan(candidateKecamatan);
    setKelurahanList(jambiLocations[candidateKecamatan]);
    
    setFormData({
      id: candidate.id,
      name: candidate.name,
      photo: candidate.photo,
      kelurahan: candidate.kelurahan,
      visi: candidate.visi,
      misi: candidate.misi,
      background: candidate.background,
      experience: candidate.experience
    });
    
    setCurrentCandidate(candidate);
    setIsEditMode(true);
    setIsAddMode(false);
  };
  
  // Delete candidate
  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
      const updatedCandidates = candidates.filter(c => c.id !== id);
      localStorage.setItem('rt_vote_candidates', JSON.stringify(updatedCandidates));
      window.location.reload(); // Simple way to refresh data
    }
  };
  
  // Candidate form
  const renderCandidateForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}
        </h2>
        <button 
          onClick={() => {
            setIsAddMode(false);
            setIsEditMode(false);
            resetForm();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama lengkap kandidat"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Foto
            </label>
            <input
              type="text"
              name="photo"
              className="input-field"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kecamatan
            </label>
            <select
              className="input-field"
              value={kecamatan}
              onChange={(e) => setKecamatan(e.target.value)}
              required
            >
              {Object.keys(jambiLocations).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kelurahan
            </label>
            <select
              name="kelurahan"
              className="input-field"
              value={formData.kelurahan}
              onChange={handleChange}
              required
            >
              {kelurahanList.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visi
            </label>
            <textarea
              name="visi"
              className="input-field"
              value={formData.visi}
              onChange={handleChange}
              placeholder="Visi kandidat"
              rows={3}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Misi
            </label>
            {formData.misi.map((misi, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="input-field"
                  value={misi}
                  onChange={(e) => handleMisiChange(index, e.target.value)}
                  placeholder={`Misi ${index + 1}`}
                  required
                />
                {formData.misi.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeMisiField(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMisiField}
              className="text-sm text-red-600 hover:text-red-700 mt-2 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Tambah Misi
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latar Belakang
            </label>
            <textarea
              name="background"
              className="input-field"
              value={formData.background}
              onChange={handleChange}
              placeholder="Latar belakang pendidikan kandidat"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pengalaman
            </label>
            <textarea
              name="experience"
              className="input-field"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Pengalaman kerja atau organisasi kandidat"
              rows={3}
              required
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setIsAddMode(false);
              setIsEditMode(false);
              resetForm();
            }}
            className="btn-secondary mr-2"
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Kandidat'}
          </button>
        </div>
      </form>
    </div>
  );
  
  // Main render
  return (
    <div>
      <h1 className="page-title">Kelola Kandidat</h1>
      
      {!isAddMode && !isEditMode && (
        <div className="mb-6">
          <button
            onClick={() => {
              setIsAddMode(true);
              setIsEditMode(false);
              resetForm();
            }}
            className="btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Tambah Kandidat Baru
          </button>
        </div>
      )}
      
      {(isAddMode || isEditMode) ? (
        renderCandidateForm()
      ) : (
        <div className="space-y-6">
          {candidates.length > 0 ? (
            candidates.map(candidate => (
              <div key={candidate.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={candidate.photo} 
                      alt={candidate.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{candidate.name}</h2>
                        <p className="text-gray-600 mb-4">{candidate.kelurahan}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                          title="Edit kandidat"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(candidate.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Hapus kandidat"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-700">Visi:</h3>
                      <p className="text-gray-600 mb-3">{candidate.visi}</p>
                      
                      <h3 className="font-medium text-gray-700">Perolehan Suara:</h3>
                      <p className="text-gray-600">{candidate.votes} suara</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Belum ada kandidat yang terdaftar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCandidateManagement;
