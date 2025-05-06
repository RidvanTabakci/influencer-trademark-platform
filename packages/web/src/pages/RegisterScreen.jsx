import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    // Şifre uzunluğu kontrolü
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login', { 
        state: { message: 'Kayıt başarılı! Giriş yapabilirsiniz.' }
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1c1e] px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white text-center">
            Kayıt Ol
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Hesabınızı oluşturun ve kampanyalara başlayın
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                placeholder="Adınız ve soyadınız"
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
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
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
                placeholder="En az 6 karakter"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-gray-400 hover:text-gray-300">
              Zaten hesabınız var mı? Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen; 