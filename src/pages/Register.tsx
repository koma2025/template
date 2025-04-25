import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface JambiLocations {
  [kecamatan: string]: string[];
}

const Register = () => {
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [kecamatan, setKecamatan] = useState('Telanaipura');
  const [kelurahan, setKelurahan] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Data lokasi Kota Jambi
  const jambiLocations: JambiLocations = {
    "Alam Barajo": ["Bagan Pete", "Beliung", "Kenali Besar", "Mayang Mangurai", "Rawa Sari"],
    "Danau Sipin": ["Legok", "Murni", "Selamat", "Solok Sipin", "Sungai Putri"],
    "Danau Teluk": ["Olak Kemang", "Pasir Panjang", "Tanjung Pasir", "Tanjung Raden", "Ulu Gedong"],
    "Jambi Selatan": ["Pakuan Baru", "Pasir Putih", "Tambak Sari", "The Hok", "Wijaya Pura"],
    "Jambi Timur": ["Budiman", "Kasang", "Kasang Jaya", "Rajawali", "Sejinjang", "Sulanjana", "Talang Banjar", "Tanjung Pinang", "Tanjung Sari"],
    "Jelutung": ["Cempaka Putih", "Handil Jaya", "Jelutung", "Kebun Handil", "Lebak Bandung", "Payo Lebar", "Talang Jauh"],
    "Kota Baru": ["Kenali Asam Atas", "Kenali Asam Bawah", "Paal Lima", "Simpang Tiga Sipin", "Sukakarya"],
    "Paal Merah": ["Eka Jaya", "Lingkar Selatan", "Paal Merah", "Payo Selincah", "Talang Bakung"],
    "Pasar Jambi": ["Beringin", "Orang Kayo Hitam", "Pasar Jambi", "Sungai Asam"],
    "Pelayangan": ["Arab Melayu", "Jelmu", "Mudung Laut", "Tahtul Yaman", "Tanjung Johor", "Tengah"],
    "Telanaipura": ["Buluran Kenali", "Pematang Sulur", "Penyengat Rendah", "Simpang Empat Sipin", "Telanaipura", "Teluk Kenali"]
  };

  // Update kelurahan list when kecamatan changes
  useEffect(() => {
    const locations = jambiLocations[kecamatan];
    if (locations) {
      setKelurahan(locations[0]); // Set first kelurahan as default
    }
  }, [kecamatan]);

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !nik || !kelurahan || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }
    
    if (nik.length !== 16) {
      setError('NIK harus terdiri dari 16 digit');
      return;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const success = await register({
        name,
        nik,
        kelurahan,
        password
      });
      
      if (success) {
        navigate('/home');
      } else {
        setError('NIK sudah terdaftar atau terjadi kesalahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto bg-red-600 rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-white font-bold text-lg">RT</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Daftar RT-Vote</h2>
          <p className="mt-2 text-sm text-gray-600">
            Daftar untuk berpartisipasi dalam pemilihan Ketua RT
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </label>
              <input
                id="nik"
                name="nik"
                type="text"
                required
                className="input-field"
                placeholder="Masukkan 16 digit NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={16}
              />
              <p className="mt-1 text-xs text-gray-500">
                Masukkan 16 digit NIK sesuai KTP
              </p>
            </div>
            
            <div>
              <label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700 mb-1">
                Kecamatan
              </label>
              <select
                id="kecamatan"
                name="kecamatan"
                required
                className="input-field"
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
              >
                {Object.keys(jambiLocations).map((k: string) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="kelurahan" className="block text-sm font-medium text-gray-700 mb-1">
                Kelurahan
              </label>
              <select
                id="kelurahan"
                name="kelurahan"
                required
                className="input-field"
                value={kelurahan}
                onChange={(e) => setKelurahan(e.target.value)}
              >
                {jambiLocations[kecamatan]?.map((k: string) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-10"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimal 6 karakter
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-10"
                  placeholder="Konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-600">Sudah punya akun?</span>{' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                Masuk
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full btn-primary py-3"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-sm font-medium text-red-600 hover:text-red-500">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
