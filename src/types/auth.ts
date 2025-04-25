export interface User {
  id: string;
  name: string;
  nik: string;
  kelurahan: string;
  isAdmin: boolean;
  hasVoted: boolean;
}

export interface Admin {
  id: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: User | null;
  adminList: Admin[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (nik: string, password: string, isAdminLogin?: boolean) => Promise<LoginResponse>;
  register: (userData: Omit<User, 'id' | 'isAdmin' | 'hasVoted'> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchAdminList: () => Promise<void>;
  markAsVoted: () => void;
} 