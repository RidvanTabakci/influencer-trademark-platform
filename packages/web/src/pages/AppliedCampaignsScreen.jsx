import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { campaignService } from '../services/api';

const AppliedCampaignsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'influencer') {
      navigate('/');
      return;
    }
    fetchAppliedCampaigns();
  }, [user]);

  const fetchAppliedCampaigns = async () => {
    try {
      const campaigns = await campaignService.getAllCampaigns();
      // Filter campaigns where the user has applied
      const applied = campaigns.filter(campaign => 
        campaign.applications?.some(app => 
          app.influencer._id === user._id
        )
      );
      setAppliedCampaigns(applied);
      setLoading(false);
    } catch (error) {
      setError('Kampanyalar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const getApplicationStatus = (campaign) => {
    const application = campaign.applications.find(app => app.influencer._id === user._id);
    return application?.status || 'Beklemede';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Başvurduğum Kampanyalar</h1>
        </div>

        {appliedCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Henüz hiçbir kampanyaya başvurmadınız.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedCampaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-[#2c2c2e] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">{campaign.title}</h2>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      getApplicationStatus(campaign) === 'Kabul Edildi'
                        ? 'bg-green-600 text-white'
                        : getApplicationStatus(campaign) === 'Reddedildi'
                        ? 'bg-red-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {getApplicationStatus(campaign)}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-4">Marka: {campaign.brand}</p>
                  
                  <div className="mb-4">
                    <p className="text-gray-300 line-clamp-3">{campaign.description}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">
                      <p>Bütçe: {campaign.budget.toLocaleString()} TL</p>
                    </div>
                    <button
                      onClick={() => navigate(`/campaigns/${campaign._id}`)}
                      className="bg-[#7c58c2] text-white px-4 py-2 rounded-md hover:bg-[#8c68d2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c58c2] transition-colors duration-200"
                    >
                      Detayları Gör
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedCampaignsScreen; 