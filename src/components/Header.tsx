import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, User, UserCog, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FullscreenButton from './FullscreenButton';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center">
              <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-sm">RT</span>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-800">RT-Vote Jambi</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-4">
              <Link to="/home" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/home' ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                Beranda
              </Link>
              <Link to="/candidates" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('/candidates') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                Kandidat
              </Link>
              <Link to="/vote" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/vote' ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                Voting
              </Link>
              <Link to="/results" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/results' ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                Hasil
              </Link>
              <Link to="/announcements" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/announcements' ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                Pengumuman
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('/admin') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* User Profile or Login Button */}
          <div className="hidden md:flex items-center space-x-2">
            <FullscreenButton className="text-gray-700" />
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600"
                  onClick={toggleProfile}
                >
                  <User size={18} />
                  <span>{user?.name.split(' ')[0]}</span>
                  <ChevronDown size={16} />
                </button>
                
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500">{user?.kelurahan}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn-primary">
                  Masuk
                </Link>
                <Link to="/login?admin=true" className="btn-outline flex items-center">
                  <UserCog size={16} className="mr-1" />
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <FullscreenButton className="text-gray-700" />
            <button
              className="text-gray-700 hover:text-red-600 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 border-t">
          {isAuthenticated ? (
            <>
              <div className="flex items-center py-3 border-b">
                <User size={20} className="text-gray-600" />
                <div className="ml-3">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.kelurahan}</div>
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <Link
                  to="/home"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  to="/candidates"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kandidat
                </Link>
                <Link
                  to="/vote"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Voting
                </Link>
                <Link
                  to="/results"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hasil
                </Link>
                <Link
                  to="/announcements"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pengumuman
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 mt-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} className="mr-2" />
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                className="block w-full text-center py-2 px-4 rounded-md text-base font-medium btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </Link>
              <Link
                to="/login?admin=true"
                className="block w-full text-center py-2 px-4 rounded-md text-base font-medium btn-outline flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCog size={18} className="mr-2" />
                Login Admin
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-2 px-4 rounded-md text-base font-medium btn-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
