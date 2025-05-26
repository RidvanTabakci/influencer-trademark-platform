import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getMe();
      console.log('getMe userData:', userData);
      if (userData) {
        setUser({ ...userData, _id: String(userData._id) });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      console.log('login response.user:', response.user);
      
      // Get complete user data after login
      const userData = await authService.getMe();
      
      // Normalize user data
      const normalizedUser = {
        ...userData,
        _id: String(userData._id || userData.id),
        influencerProfile: {
          bio: userData.influencerProfile?.bio || '',
          highestFollowerCount: userData.influencerProfile?.highestFollowerCount || 0,
          socialMedia: {
            instagram: userData.influencerProfile?.socialMedia?.instagram || '',
            youtube: userData.influencerProfile?.socialMedia?.youtube || '',
            tiktok: userData.influencerProfile?.socialMedia?.tiktok || '',
          },
          categories: userData.influencerProfile?.categories || [],
          location: userData.influencerProfile?.location || '',
          website: userData.influencerProfile?.website || '',
          profileImage: userData.influencerProfile?.profileImage || '',
        },
        brandProfile: {
          companyName: userData.brandProfile?.companyName || '',
          industry: userData.brandProfile?.industry || '',
          website: userData.brandProfile?.website || '',
          logo: userData.brandProfile?.logo || '',
          description: userData.brandProfile?.description || '',
        },
        permissions: userData.permissions || [],
        role: userData.role || 'influencer',
      };
      
      setUser(normalizedUser);
      return { ...response, user: normalizedUser };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = (updatedUserData) => {
    const normalizedUser = {
      ...updatedUserData,
      _id: String(updatedUserData._id),
      influencerProfile: {
        ...updatedUserData.influencerProfile,
        socialMedia: {
          instagram: updatedUserData.influencerProfile?.socialMedia?.instagram || '',
          youtube: updatedUserData.influencerProfile?.socialMedia?.youtube || '',
          tiktok: updatedUserData.influencerProfile?.socialMedia?.tiktok || '',
        },
        categories: updatedUserData.influencerProfile?.categories || [],
        bio: updatedUserData.influencerProfile?.bio || '',
        location: updatedUserData.influencerProfile?.location || '',
        website: updatedUserData.influencerProfile?.website || '',
        profileImage: updatedUserData.influencerProfile?.profileImage || '',
        highestFollowerCount: updatedUserData.influencerProfile?.highestFollowerCount || 0,
      },
      brandProfile: {
        ...updatedUserData.brandProfile,
        companyName: updatedUserData.brandProfile?.companyName || '',
        industry: updatedUserData.brandProfile?.industry || '',
        website: updatedUserData.brandProfile?.website || '',
        logo: updatedUserData.brandProfile?.logo || '',
        description: updatedUserData.brandProfile?.description || '',
      },
      permissions: updatedUserData.permissions || [],
      role: updatedUserData.role || 'influencer',
    };
    setUser(normalizedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: authService.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 