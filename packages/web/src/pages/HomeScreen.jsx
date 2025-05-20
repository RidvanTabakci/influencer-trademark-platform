import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await campaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      setError('Kampanyalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Hoş Geldin, {user?.name}
            </h2>
            <p className="text-gray-400 mt-1">
              Mevcut kampanyaları görüntüle veya yeni bir kampanya oluştur
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {user?.role === 'influencer' && (
              <button
                onClick={() => navigate('/applied-campaigns')}
                className="bg-[#2c2c2e] text-white rounded-lg px-6 py-3 font-bold hover:bg-[#3c3c3e] focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              >
                Başvurduğum Kampanyalar
              </button>
            )}
            <button
              onClick={() => navigate('/profile')}
              className="bg-[#2c2c2e] text-white rounded-lg px-6 py-3 font-bold hover:bg-[#3c3c3e] focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
            >
              Profil
            </button>
            {user?.role === 'brand' && (
              <button
                onClick={() => navigate('/create-campaign')}
                className="bg-[#7c58c2] text-white rounded-lg px-6 py-3 font-bold hover:bg-[#6a4ba3] focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
              >
                Yeni Kampanya
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Kampanya ara..."
            className="w-full bg-[#7c58c2] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6a4ba3]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredCampaigns.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz kampanya bulunmuyor'}
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-[#2c2c2e] rounded-lg p-6 hover:bg-[#3c3c3e] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{campaign.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-400">
                        Marka: {campaign.brand}
                      </span>
                      <span className="text-gray-400">
                        Bütçe: {campaign.budget} TL
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          campaign.status === 'active'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/campaigns/${campaign._id}`}
                    className="text-[#7c58c2] hover:text-[#6a4ba3]"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 