import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Admin, AuthContextType } from '../types/auth';
import { authService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchAdminList = async () => {
    try {
      const response = await authService.getAdmins();
      setAdminList(response.admins || []);
    } catch (error) {
      console.error('Error fetching admin list:', error);
    }
  };

  const login = async (nik: string, password: string, isAdminLogin = false) => {
    try {
      const { user } = await authService.login(nik, password, isAdminLogin);
      
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        setIsAdmin(user.isAdmin);
        return { success: true, isAdmin: user.isAdmin };
      }
      return { success: false, isAdmin: false };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, isAdmin: false };
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin' | 'hasVoted'> & { password: string }) => {
    try {
      const { user } = await authService.register(userData);
      
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const markAsVoted = () => {
    if (user) {
      setUser({ ...user, hasVoted: true });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      adminList,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      fetchAdminList,
      markAsVoted
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
