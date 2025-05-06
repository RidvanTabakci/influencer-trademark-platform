import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    // Influencer alanları
    bio: '',
    followers: '',
    following: '',
    posts: '',
    socialMedia: {
      instagram: '',
      youtube: '',
      tiktok: '',
    },
    categories: [],
    // Marka alanları
    companyName: '',
    industry: '',
    website: '',
    location: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        followers: user.followers || '',
        following: user.following || '',
        posts: user.posts || '',
        socialMedia: user.socialMedia || {
          instagram: '',
          youtube: '',
          tiktok: '',
        },
        categories: user.categories || [],
        companyName: user.companyName || '',
        industry: user.industry || '',
        website: user.website || '',
        location: user.location || '',
        description: user.description || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Şifre değişikliği yapılacaksa
      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          setError('Yeni şifre en az 6 karakter olmalıdır');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Yeni şifreler eşleşmiyor');
          return;
        }
        if (!formData.currentPassword) {
          setError('Mevcut şifrenizi girmelisiniz');
          return;
        }
      }

      // Temel profil güncelleme
      await authService.updateProfile({
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // Kullanıcı tipine göre özel profil güncelleme
      if (user.type === 'influencer') {
        await authService.updateInfluencerProfile({
          bio: formData.bio,
          followers: Number(formData.followers),
          following: Number(formData.following),
          posts: Number(formData.posts),
          socialMedia: formData.socialMedia,
          categories: formData.categories,
        });
      } else if (user.type === 'brand') {
        await authService.updateBrandProfile({
          companyName: formData.companyName,
          industry: formData.industry,
          website: formData.website,
          location: formData.location,
          description: formData.description,
        });
      }

      setSuccess('Profil başarıyla güncellendi');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setError(error.response?.data?.error || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Profil Bilgileri
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            Geri Dön
          </button>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-6 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Temel Bilgiler
            </h3>
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Influencer Profil Alanları */}
          {user?.type === 'influencer' && (
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Influencer Bilgileri
              </h3>

              <div>
                <label htmlFor="bio" className="block text-gray-300 mb-2">
                  Biyografi
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Kendinizi tanıtın"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="followers" className="block text-gray-300 mb-2">
                    Takipçi Sayısı
                  </label>
                  <input
                    type="number"
                    id="followers"
                    name="followers"
                    className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                    value={formData.followers}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="following" className="block text-gray-300 mb-2">
                    Takip Edilen
                  </label>
                  <input
                    type="number"
                    id="following"
                    name="following"
                    className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                    value={formData.following}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="posts" className="block text-gray-300 mb-2">
                    Gönderi Sayısı
                  </label>
                  <input
                    type="number"
                    id="posts"
                    name="posts"
                    className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                    value={formData.posts}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-semibold text-white">
                  Sosyal Medya Hesapları
                </h4>

                <div>
                  <label htmlFor="instagram" className="block text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="socialMedia.instagram"
                    className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                    value={formData.socialMedia.instagram}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="@kullaniciadi"
                  />
                </div>

                <div>
                  <label htmlFor="youtube" className="block text-gray-300 mb-2">
                    YouTube
                  </label>
                  <input
                    type="text"
                    id="youtube"
                    name="socialMedia.youtube"
                    className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                    value={formData.socialMedia.youtube}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Kanal URL'si"
                  />
                </div>

                <div>
                  <label htmlFor="tiktok" className="block text-gray-300 mb-2">
                    TikTok
                  </label>
                  <input
                    type="text"
                    id="tiktok"
                    name="socialMedia.tiktok"
                    className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                    value={formData.socialMedia.tiktok}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="@kullaniciadi"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Marka Profil Alanları */}
          {user?.type === 'brand' && (
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Marka Bilgileri
              </h3>

              <div>
                <label htmlFor="companyName" className="block text-gray-300 mb-2">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-gray-300 mb-2">
                  Sektör
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  required
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.industry}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Örn: Moda, Teknoloji, Gıda"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="https://www.example.com"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-gray-300 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Şehir, Ülke"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-300 mb-2">
                  Marka Açıklaması
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Markanız hakkında bilgi verin"
                />
              </div>
            </div>
          )}

          {/* Şifre Değiştirme */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Şifre Değiştir
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-gray-300 mb-2">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Mevcut şifrenizi girin"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-gray-300 mb-2">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Yeni şifrenizi girin"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                  Yeni Şifre Tekrar
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-400"
            >
              Çıkış Yap
            </button>
            <button
              type="submit"
              className="bg-[#7c58c2] text-white rounded-lg px-6 py-3 font-bold hover:bg-[#6a4ba3] focus:outline-none focus:ring-2 focus:ring-[#6a4ba3] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen; 