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
    <div className="min-h-screen flex items-center justify-center bg-[#1c1c1e] px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white text-center">
            Giriş Yap
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Hesabınıza giriş yapın ve kampanyalara başlayın
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
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
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 font-bold hover:bg-[#6a4ba3] focus:outline-none focus:ring-2 focus:ring-[#6a4ba3] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-gray-400 hover:text-gray-300">
              Hesabınız yok mu? Kayıt Ol
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen; 