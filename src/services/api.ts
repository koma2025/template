import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5176'
});

// Auth Services
export const authService = {
  login: async (nik: string, password: string, isAdminLogin: boolean = false) => {
    const response = await api.post('/auth/login', { nik, password, isAdminLogin });
    return response.data;
  },

  register: async (userData: { name: string; nik: string; password: string; kelurahan: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get('/auth/admins');
    return response.data;
  }
};

// Candidates Services
export const candidatesService = {
  getAll: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  vote: async (candidateId: string, userId: string) => {
    const response = await api.post('/candidates/vote', { candidateId, userId });
    return response.data;
  }
};

// Announcements Services
export const announcementsService = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data;
  }
}; 