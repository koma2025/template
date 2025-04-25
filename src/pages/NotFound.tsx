import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto bg-red-100 rounded-full w-24 h-24 flex items-center justify-center">
          <span className="text-red-600 font-bold text-4xl">404</span>
        </div>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Halaman Tidak Ditemukan</h2>
        <p className="mt-2 text-gray-600">
          Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center btn-primary py-3 px-6"
          >
            <Home size={18} className="mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
