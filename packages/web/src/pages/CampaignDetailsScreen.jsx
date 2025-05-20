import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { campaignService } from '../services/api';

const CampaignDetailsScreen = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await campaignService.getCampaign(campaignId);
      setCampaign(response.campaign);
    } catch (error) {
      setError('Kampanya detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      if (!applicationMessage.trim()) {
        setError('Lütfen başvuru mesajınızı yazın');
        return;
      }

      await campaignService.applyToCampaign(campaignId, { message: applicationMessage });
      setShowApplicationForm(false);
      setApplicationMessage('');
      fetchCampaignDetails(); // Başvuru sonrası başvuruları yenile
      alert('Başvurunuz başarıyla alındı!');
    } catch (error) {
      setError(error.response?.data?.error || 'Başvuru yapılırken bir hata oluştu');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await campaignService.updateApplicationStatus(campaignId, applicationId, { status });
      fetchCampaignDetails();
      alert(`Başvuru durumu ${status} olarak güncellendi`);
    } catch (error) {
      setError(error.response?.data?.error || 'Başvuru durumu güncellenirken bir hata oluştu');
    }
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

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-white text-lg">Kampanya bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#2c2c2e] rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">{campaign.title}</h2>
            <p className="text-gray-400 mt-2">Marka: {campaign.brand}</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Kampanya Detayları</h3>
              <p className="text-gray-300">{campaign.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-400 mb-1">Bütçe</h4>
                <p className="text-white">{campaign.budget.toLocaleString()} TL</p>
              </div>
              <div>
                <h4 className="text-gray-400 mb-1">Durum</h4>
                <p className="text-white">{campaign.status}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Gereksinimler</h3>
              <p className="text-gray-300">{campaign.requirements}</p>
            </div>
            
            {campaign.status === 'Aktif' && user?.role === 'influencer' && (
              <div>
                {!showApplicationForm ? (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-[#7c58c2] text-white py-2 px-4 rounded-md hover:bg-[#8c68d2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c58c2] transition-colors duration-200"
                  >
                    Başvur
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="applicationMessage" className="block text-sm font-medium text-gray-300 mb-2">
                        Başvuru Mesajınız
                      </label>
                      <textarea
                        id="applicationMessage"
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        placeholder="Kendinizi tanıtın ve neden bu kampanya için uygun olduğunuzu açıklayın..."
                        className="w-full bg-[#3c3c3e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c58c2] min-h-[150px] resize-y"
                      />
                      {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleApply}
                        disabled={!applicationMessage.trim()}
                        className={`flex-1 bg-[#7c58c2] text-white py-2 px-4 rounded-md hover:bg-[#8c68d2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c58c2] transition-colors duration-200 ${
                          !applicationMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Başvuruyu Gönder
                      </button>
                      <button
                        onClick={() => {
                          setShowApplicationForm(false);
                          setApplicationMessage('');
                          setError('');
                        }}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors duration-200"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Başvurular</h3>
              {campaign.applications?.length === 0 ? (
                <p className="text-gray-400">Henüz başvuru yok</p>
              ) : (
                <div className="space-y-4">
                  {campaign.applications.map((application) => (
                    <div key={application._id} className="bg-[#3c3c3e] p-4 rounded-lg">
                      {user?.role === 'influencer' ? (
                        // Influencer görünümü - sadece isim ve durum
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-white font-medium">
                              {application.influencer?.name || 'İsimsiz Kullanıcı'}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              application.status === 'Kabul Edildi' 
                                ? 'bg-green-600 text-white' 
                                : application.status === 'Reddedildi'
                                ? 'bg-red-600 text-white'
                                : 'bg-yellow-600 text-white'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                        </div>
                      ) : (
                        // Brand ve Admin görünümü - tüm detaylar
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 
                                className="text-white font-medium cursor-pointer hover:text-[#7c58c2] transition-colors duration-200"
                                onClick={() => navigate(`/profile/${application.influencer._id}`)}
                              >
                                {application.influencer?.name || 'İsimsiz Kullanıcı'}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                application.status === 'Kabul Edildi' 
                                  ? 'bg-green-600 text-white' 
                                  : application.status === 'Reddedildi'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-yellow-600 text-white'
                              }`}>
                                {application.status}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">
                              {application.influencer?.email || 'Email bilgisi yok'}
                            </p>
                            {application.influencer?.influencerProfile && (
                              <div className="mt-2 text-sm text-gray-300">
                                <p>Takipçi: {application.influencer.influencerProfile.followers?.toLocaleString() || 'Belirtilmemiş'}</p>
                                <p>Kategoriler: {application.influencer.influencerProfile.categories?.join(', ') || 'Belirtilmemiş'}</p>
                              </div>
                            )}
                            <div className="mt-3 p-3 bg-[#2c2c2e] rounded-md">
                              <p className="text-gray-300">{application.message}</p>
                            </div>
                          </div>
                          {(user?.role === 'admin' || (user?.role === 'brand' && campaign.creator?._id === user._id)) && application.status === 'Beklemede' && (
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handleUpdateApplicationStatus(application._id, 'Kabul Edildi')}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors duration-200"
                              >
                                Kabul Et
                              </button>
                              <button
                                onClick={() => handleUpdateApplicationStatus(application._id, 'Reddedildi')}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors duration-200"
                              >
                                Reddet
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsScreen;