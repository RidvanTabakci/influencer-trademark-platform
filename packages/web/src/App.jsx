// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import HomeScreen from './pages/HomeScreen';
import ProfileScreen from './pages/ProfileScreen';
import CreateCampaignScreen from './pages/CreateCampaignScreen';
import EditCampaignScreen from './pages/EditCampaignScreen';
import CampaignDetailsScreen from './pages/CampaignDetailsScreen';
import AppliedCampaignsScreen from './pages/AppliedCampaignsScreen';

// Korumalı Route bileşeni
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#1c1c1e]">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-campaign"
              element={
                <ProtectedRoute>
                  <CreateCampaignScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-campaign/:campaignId"
              element={
                <ProtectedRoute>
                  <EditCampaignScreen />
                </ProtectedRoute>
              }
            /><Route
              path="/campaigns/:campaignId"
              element={
                <ProtectedRoute>
                  <CampaignDetailsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applied-campaigns"
              element={
                <ProtectedRoute>
                  <AppliedCampaignsScreen />
                </ProtectedRoute>
              }
            /> 
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
          </Routes>
         
          
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;