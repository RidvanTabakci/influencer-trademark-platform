import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#2c2c2e] p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Influencer - Marka
          </h1>
          <p className="text-xl text-[#7c58c2] font-semibold mb-4">
            İşbirliği Platformu
          </p>
          <div className="h-1 w-20 bg-[#7c58c2] mx-auto rounded-full mb-6"></div>
          <h2 className="text-2xl font-bold text-white">
            Giriş Yap
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Hesabınıza giriş yapın ve kampanyalara başlayın
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow-lg">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg text-center shadow-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-[#3c3c3e] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7c58c2] transition-all duration-200"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-[#3c3c3e] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7c58c2] transition-all duration-200"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7c58c2] to-[#6a4ba3] text-white rounded-lg px-4 py-3 font-bold hover:from-[#6a4ba3] hover:to-[#5a3b93] focus:outline-none focus:ring-2 focus:ring-[#7c58c2] disabled:opacity-50 transition-all duration-200 shadow-lg"
              disabled={loading}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Link to="/forgot-password" className="text-[#7c58c2] hover:text-[#6a4ba3] transition-colors duration-200">
              Şifremi Unuttum
            </Link>
            <div className="text-gray-400">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-[#7c58c2] hover:text-[#6a4ba3] font-medium transition-colors duration-200">
                Kayıt Ol
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen; 