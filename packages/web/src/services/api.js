import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istek öncesi token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Axios Request Config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
    token: token
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Axios Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor ekle
api.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Axios Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// ------------------ Auth Servisi ------------------ //
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);

      // 🔥 Eksiksiz kullanıcı verisini login sonrası çek
      const fullUser = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(fullUser));

      return { token: response.data.token, user: fullUser };
    }

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  updateUserProfile: async (userData) => {
    // Alias for updateProfile for compatibility with ProfileScreen
    return await authService.updateProfile(userData);
  },

  updateInfluencerProfile: async (profileData) => {
    const response = await api.put('/users/influencer-profile', {
      influencerProfile: {
        socialMedia: profileData.socialMedia,
        highestFollowerCount: profileData.highestFollowerCount
      },
    });
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  updateBrandProfile: async (profileData) => {
    const response = await api.put('/users/brand-profile', profileData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  analyzeProfile: async (profile) => {
    const response = await api.post('/ai/analyze-profile', { profile });
    return response.data;
  },

  // 🔥 Eksiksiz kullanıcı verisini backend'den al
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data.user; // response: { user: {...} }
  },
};

// ------------------ Campaign Servisi ------------------ //
export const campaignService = {
  getAllCampaigns: async () => {
    const response = await api.get('/campaigns');
    return response.data;
  },

  getCampaign: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  createCampaign: async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },

  updateCampaign: async (id, campaignData) => {
    const response = await api.put(`/campaigns/${id}`, campaignData);
    return response.data;
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  // Yeni eklenen fonksiyonlar
  applyToCampaign: async (campaignId, applicationData) => {
    const response = await api.post(`/campaigns/${campaignId}/apply`, applicationData);
    return response.data;
  },

  getCampaignApplications: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/applications`);
    return response.data;
  },

  updateApplicationStatus: async (campaignId, applicationId, statusData) => {
    const response = await api.put(`/campaigns/${campaignId}/applications/${applicationId}`, statusData);
    return response.data;
  },

  analyzeApplications: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/analyze-applications`);
    return response.data;
  }
};

// ------------------ Instagram Servisi ------------------ //
export const instagramService = {
  getAuthUrl: async () => {
    const response = await api.get('/instagram/auth-url');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/instagram/profile');
    return response.data;
  },

  getMedia: async () => {
    const response = await api.get('/instagram/media');
    return response.data;
  },
};
export const userService = {
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
};

// Axios instance'ı export et
export default api;