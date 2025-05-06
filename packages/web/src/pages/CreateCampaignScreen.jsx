import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CreateCampaignScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    budget: '',
    requirements: '',
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
    setLoading(true);

    try {
      // Bütçeyi sayıya çevir
      const campaignData = {
        ...formData,
        budget: Number(formData.budget),
      };

      await campaignService.createCampaign(campaignData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Kampanya oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Yeni Kampanya Oluştur
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            İptal
          </button>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-300 mb-2">
              Kampanya Başlığı
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              placeholder="Örn: Instagram Reklam Kampanyası"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-300 mb-2">
              Kampanya Açıklaması
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="Kampanya hakkında detaylı bilgi verin"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-gray-300 mb-2">
              Marka
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              required
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              value={formData.brand}
              onChange={handleChange}
              disabled={loading}
              placeholder="Marka adı"
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-gray-300 mb-2">
              Bütçe (TL)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              required
              min="0"
              step="100"
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              value={formData.budget}
              onChange={handleChange}
              disabled={loading}
              placeholder="Örn: 1000"
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-gray-300 mb-2">
              Gereksinimler
            </label>
            <textarea
              id="requirements"
              name="requirements"
              required
              rows="4"
              className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              value={formData.requirements}
              onChange={handleChange}
              disabled={loading}
              placeholder="Kampanya için gerekli şartları belirtin"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#7c58c2] text-white rounded-lg px-6 py-3 font-bold hover:bg-[#6a4ba3] focus:outline-none focus:ring-2 focus:ring-[#6a4ba3] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Kampanya Oluşturuluyor...' : 'Kampanya Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignScreen; 