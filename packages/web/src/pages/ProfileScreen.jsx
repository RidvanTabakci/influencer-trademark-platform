import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser, logout, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socialMedia, setSocialMedia] = useState({
    instagram: '',
    youtube: '',
    tiktok: ''
  });
  const [highestFollowerCount, setHighestFollowerCount] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      // Fetch other user's profile
      fetchUserProfile(userId);
    } else {
      // Use current user's data
      setUser(currentUser);
      setLoading(false);
      setSocialMedia({
        instagram: currentUser?.influencerProfile?.socialMedia?.instagram || '',
        youtube: currentUser?.influencerProfile?.socialMedia?.youtube || '',
        tiktok: currentUser?.influencerProfile?.socialMedia?.tiktok || ''
      });
      setHighestFollowerCount(currentUser?.influencerProfile?.highestFollowerCount || '');
    }
  }, [userId, currentUser]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await authService.getUserProfile(userId);
      setUser(response.user);
      setSocialMedia({
        instagram: response.user?.influencerProfile?.socialMedia?.instagram || '',
        youtube: response.user?.influencerProfile?.socialMedia?.youtube || '',
        tiktok: response.user?.influencerProfile?.socialMedia?.tiktok || ''
      });
      setHighestFollowerCount(response.user?.influencerProfile?.highestFollowerCount || '');
    } catch (error) {
      setError('Kullanıcı profili yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSaveSocialMedia = async () => {
    try {
      setLoading(true);
      setError('');

      // URL formatı kontrolü
      const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
      
      if (socialMedia.instagram && !urlPattern.test(socialMedia.instagram)) {
        setError('Geçersiz Instagram URL formatı. Örnek: https://www.instagram.com/kullaniciadi');
        return;
      }
      if (socialMedia.youtube && !urlPattern.test(socialMedia.youtube)) {
        setError('Geçersiz YouTube URL formatı. Örnek: https://www.youtube.com/@kanaladi');
        return;
      }
      if (socialMedia.tiktok && !urlPattern.test(socialMedia.tiktok)) {
        setError('Geçersiz TikTok URL formatı. Örnek: https://www.tiktok.com/@kullaniciadi');
        return;
      }

      const response = await authService.updateInfluencerProfile({
        socialMedia: {
          instagram: socialMedia.instagram,
          youtube: socialMedia.youtube,
          tiktok: socialMedia.tiktok
        },
        highestFollowerCount: parseInt(highestFollowerCount) || 0
      });
      
      if (response.user) {
        updateUser(response.user);
        setError('');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Sosyal medya güncellenirken hata:', error);
      setError(error.response?.data?.error || 'Sosyal medya bilgileri kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'influencer':
        return 'İçerik Üreticisi';
      case 'brand':
        return 'Marka';
      case 'admin':
        return 'Yönetici';
      default:
        return role;
    }
  };

  const getPermissionText = (permission) => {
    const permissionMap = {
      view_campaigns: 'Kampanyaları Görüntüleme',
      create_campaign: 'Kampanya Oluşturma',
      edit_campaign: 'Kampanya Düzenleme',
      delete_campaign: 'Kampanya Silme',
      manage_users: 'Kullanıcı Yönetimi',
      manage_platform: 'Platform Yönetimi'
    };
    return permissionMap[permission] || permission;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-red-500 text-lg">Kullanıcı bilgileri yüklenemedi</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#2c2c2e] rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Profil</h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex">
                  <span className="text-gray-400 w-32">Ad Soyad:</span>
                  <span className="text-white">{user.name}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-32">E-posta:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-32">Hesap Türü:</span>
                  <span className="text-white">{getRoleText(user.role)}</span>
                </div>
              </div>
            </div>

            {user.permissions && user.permissions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Yetkiler</h3>
                <div className="space-y-2">
                  {user.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-[#7c58c2] mr-2">•</span>
                      <span className="text-white">{getPermissionText(permission)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user.role === 'influencer' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Sosyal Medya Hesapları</h3>
                  {!userId && currentUser._id === user._id && !isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[#7c58c2] hover:text-[#8c68d2] focus:outline-none"
                    >
                      Düzenle
                    </button>
                  ) : !userId && currentUser._id === user._id && isEditing ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-gray-400 hover:text-white focus:outline-none"
                      >
                        İptal
                      </button>
                      <button
                        onClick={handleSaveSocialMedia}
                        disabled={loading}
                        className="text-[#7c58c2] hover:text-[#8c68d2] focus:outline-none disabled:opacity-50"
                      >
                        Kaydet
                      </button>
                    </div>
                  ) : null}
                </div>
                
                {error && (
                  <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-white w-32">En Yüksek Takipçi:</span>
                    {isEditing && currentUser._id === user._id ? (
                      <input
                        type="number"
                        value={highestFollowerCount}
                        onChange={(e) => setHighestFollowerCount(e.target.value)}
                        placeholder="Takipçi sayısı"
                        className="flex-1 bg-[#3c3c3e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c58c2]"
                      />
                    ) : (
                      <div className="flex-1">
                        {highestFollowerCount ? (
                          <span className="text-white">{highestFollowerCount.toLocaleString()} takipçi</span>
                        ) : (
                          <span className="text-gray-400">Takipçi sayısı girilmemiş</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaInstagram className="text-[#E1306C] text-xl" />
                    {isEditing && currentUser._id === user._id ? (
                      <input
                        type="text"
                        value={socialMedia.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        placeholder="https://www.instagram.com/kullaniciadi"
                        className="flex-1 bg-[#3c3c3e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c58c2]"
                      />
                    ) : (
                      <div className="flex-1">
                        {socialMedia.instagram ? (
                          <a
                            href={socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7c58c2] hover:text-[#8c68d2]"
                          >
                            {socialMedia.instagram}
                          </a>
                        ) : (
                          <span className="text-gray-400">Instagram hesabı eklenmemiş</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaYoutube className="text-[#FF0000] text-xl" />
                    {isEditing && currentUser._id === user._id ? (
                      <input
                        type="text"
                        value={socialMedia.youtube}
                        onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                        placeholder="https://www.youtube.com/@kanaladi"
                        className="flex-1 bg-[#3c3c3e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c58c2]"
                      />
                    ) : (
                      <div className="flex-1">
                        {socialMedia.youtube ? (
                          <a
                            href={socialMedia.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7c58c2] hover:text-[#8c68d2]"
                          >
                            {socialMedia.youtube}
                          </a>
                        ) : (
                          <span className="text-gray-400">YouTube kanalı eklenmemiş</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaTiktok className="text-[#000000] text-xl" />
                    {isEditing && currentUser._id === user._id ? (
                      <input
                        type="text"
                        value={socialMedia.tiktok}
                        onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                        placeholder="https://www.tiktok.com/@kullaniciadi"
                        className="flex-1 bg-[#3c3c3e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c58c2]"
                      />
                    ) : (
                      <div className="flex-1">
                        {socialMedia.tiktok ? (
                          <a
                            href={socialMedia.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7c58c2] hover:text-[#8c68d2]"
                          >
                            {socialMedia.tiktok}
                          </a>
                        ) : (
                          <span className="text-gray-400">TikTok hesabı eklenmemiş</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              {!userId && (
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#7c58c2] text-white py-2 px-4 rounded-md hover:bg-[#8c68d2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c58c2]"
                >
                  Çıkış Yap
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen; 