import { Link } from 'react-router-dom';
import { ArrowRight, BarChart, Check, Users } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-red-600 to-red-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Pemilihan Ketua RT Digital
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in-delay">
              RT-Vote Jambi adalah aplikasi untuk memfasilitasi pemilihan Ketua RT secara digital
              di setiap kelurahan di Kota Jambi
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay-2">
              <Link to="/register" className="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-base md:text-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                Daftar Sekarang
              </Link>
              <Link to="/login" className="btn bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold text-base md:text-lg px-6 py-3">
                Masuk
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Fitur Utama</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Warga</h3>
              <p className="text-gray-600 mb-4">
                Kelola data warga dengan mudah dan aman.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Pendaftaran online</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Verifikasi NIK</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Data terenkripsi</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-red-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 6-6-4-6 4M4 10v8a2 2 0 0 0 2 2h2M10 20h2a2 2 0 0 0 2-2v-1M2 19h3v-4h3v4h3v-6h3v6h3v-8h3v8h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proses Pemilihan</h3>
              <p className="text-gray-600 mb-4">
                Proses pemilihan yang aman, transparan, dan dapat dipercaya.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Verifikasi data pemilih</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Kerahasiaan suara terjamin</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Sistem anti kecurangan</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hasil Pemilihan</h3>
              <p className="text-gray-600 mb-4">
                Lihat hasil pemilihan secara real-time dengan visualisasi data.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Tampilan real-time</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Grafik persentase suara</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Akses untuk semua warga</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Siap untuk berpartisipasi?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Jadilah bagian dari pemilihan Ketua RT yang transparan dan akuntabel.
              Daftarkan diri Anda sekarang dan berikan suara untuk kemajuan RT di Kota Jambi.
            </p>
            <Link to="/register" className="inline-flex items-center btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
              Mulai Sekarang
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Tentang RT-Vote Jambi</h2>
            <p className="text-gray-600 mb-4">
              RT-Vote Jambi dikembangkan untuk meningkatkan partisipasi warga dalam pemilihan Ketua RT 
              di Kota Jambi. Aplikasi ini bertujuan untuk menciptakan proses pemilihan yang transparan, 
              efisien, dan dapat diakses oleh semua warga.
            </p>
            <p className="text-gray-600">
              Dikembangkan oleh <span className="font-semibold">Mardianto Eka Saputra</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
