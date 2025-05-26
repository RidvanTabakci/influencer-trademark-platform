import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istekten önce token ekle
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/users/me');
      const userData = response.data.user;
      
      // Ensure all user data is properly structured
      const normalizedUser = {
        ...userData,
        _id: String(userData._id),
        influencerProfile: {
          ...userData.influencerProfile,
          socialMedia: {
            instagram: userData.influencerProfile?.socialMedia?.instagram || '',
            youtube: userData.influencerProfile?.socialMedia?.youtube || '',
            tiktok: userData.influencerProfile?.socialMedia?.tiktok || '',
          },
          categories: userData.influencerProfile?.categories || [],
          bio: userData.influencerProfile?.bio || '',
          location: userData.influencerProfile?.location || '',
          website: userData.influencerProfile?.website || '',
          profileImage: userData.influencerProfile?.profileImage || '',
          highestFollowerCount: userData.influencerProfile?.highestFollowerCount || 0,
        },
        brandProfile: {
          ...userData.brandProfile,
          companyName: userData.brandProfile?.companyName || '',
          industry: userData.brandProfile?.industry || '',
          website: userData.brandProfile?.website || '',
          logo: userData.brandProfile?.logo || '',
          description: userData.brandProfile?.description || '',
        },
        permissions: userData.permissions || [],
        role: userData.role || 'influencer',
      };
      
      return normalizedUser;
    } catch (error) {
      console.error('getMe error:', error);
      throw error;
    }
  },

  updateInfluencerProfile: async (profileData) => {
    try {
      const response = await api.put('/users/influencer-profile', {
        influencerProfile: {
          bio: profileData.bio || '',
          highestFollowerCount: profileData.highestFollowerCount || 0,
          socialMedia: {
            instagram: profileData.socialMedia?.instagram || '',
            youtube: profileData.socialMedia?.youtube || '',
            tiktok: profileData.socialMedia?.tiktok || '',
          },
          categories: profileData.categories || [],
          location: profileData.location || '',
          website: profileData.website || '',
          profileImage: profileData.profileImage || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      throw error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.user;
    } catch (error) {
      console.error('Kullanıcı profili alınırken hata:', error);
      throw error;
    }
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Kullanıcı profili güncellenirken hata:', error);
      throw error;
    }
  },
};

export const campaignService = {
  getAllCampaigns: async () => {
    try {
      const response = await api.get('/campaigns');
      return response.data;
    } catch (error) {
      console.error('Kampanyalar alınırken hata:', error);
      throw error;
    }
  },

  getCampaign: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Kampanya detayları alınırken hata:', error);
      throw error;
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Kampanya oluşturulurken hata:', error);
      throw error;
    }
  },

  updateCampaign: async (id, campaignData) => {
    try {
      const response = await api.put(`/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Kampanya güncellenirken hata:', error);
      throw error;
    }
  },

  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Kampanya silinirken hata:', error);
      throw error;
    }
  },

  applyToCampaign: async (campaignId, applicationData) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Kampanyaya başvurulurken hata:', error);
      throw error;
    }
  },

  updateApplicationStatus: async (campaignId, applicationId, statusData) => {
    try {
      const response = await api.put(`/campaigns/${campaignId}/applications/${applicationId}`, statusData);
      return response.data;
    } catch (error) {
      console.error('Başvuru durumu güncellenirken hata:', error);
      throw error;
    }
  },

  analyzeApplications: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/analyze-applications`);
    return response.data;
  },
};

export const messageService = {
  getInbox: async () => {
    const response = await api.get('/messages/inbox');
    return response.data.messages;
  },
  getMessagesWith: async (userId) => {
    const response = await api.get(`/messages/with/${userId}`);
    return response.data.messages;
  },
  sendMessage: async (receiver, content) => {
    const response = await api.post('/messages', { receiver, content });
    return response.data.data;
  }
};

export const aiService = {
  analyzeProfile: async (profile) => {
    const response = await api.post('/ai/analyze-profile', { profile });
    return response.data;
  }
};

export default api;