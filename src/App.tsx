import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CandidateList from './pages/CandidateList';
import CandidateProfile from './pages/CandidateProfile';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ParticleBackground from './components/ParticleBackground';

// Enable React Router v7 future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Simulate loading delay (remove in production)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-red-600 to-red-800 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute h-24 w-24 rounded-full animate-spin bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute flex items-center justify-center bg-red-700 rounded-full h-[90px] w-[90px]">
            <div className="text-white font-bold text-2xl">RT</div>
          </div>
        </div>
        <h1 className="text-white font-bold text-2xl mt-6">RT-Vote Jambi</h1>
        <p className="text-white/80 mt-2">Pemilihan Digital Ketua RT</p>
      </div>
    );
  }

  return (
    <Router {...router}>
      <AuthProvider>
        <DataProvider>
          <div className="flex flex-col min-h-screen font-primary">
            <ParticleBackground />
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/candidates" 
                  element={
                    <ProtectedRoute>
                      <CandidateList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/candidates/:id" 
                  element={
                    <ProtectedRoute>
                      <CandidateProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/vote" 
                  element={
                    <ProtectedRoute>
                      <VotingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/results" 
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/announcements" 
                  element={
                    <ProtectedRoute>
                      <Announcements />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/*" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
