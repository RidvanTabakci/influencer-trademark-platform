import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Şifre sıfırlama işlemleri burada yapılacak
    console.log('Password reset attempt:', email);
    setMessage('Şifre sıfırlama bağlantısı email adresinize gönderildi.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1c1e] px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white text-center">
            Şifremi Unuttum
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Email adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && (
            <div className="text-center text-green-400">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 font-bold hover:bg-[#6a4ba3] focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
            >
              Şifre Sıfırlama Bağlantısı Gönder
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-gray-400 hover:text-gray-300">
              Giriş sayfasına dön
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen; 