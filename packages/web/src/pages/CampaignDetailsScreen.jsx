import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { campaignService, authService } from '../services/api';

const CampaignDetailsScreen = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingProfile, setAnalyzingProfile] = useState(false);
  const [profileAnalysis, setProfileAnalysis] = useState(null);
  const [profileAnalysisError, setProfileAnalysisError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    minFollowers: '',
    category: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

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

  const handleAnalyzeApplications = async () => {
    try {
      setAnalyzing(true);
      setError('');
      const response = await campaignService.analyzeApplications(campaignId);
      setAiAnalysis(response.analysis);
    } catch (error) {
      setError(error.response?.data?.error || 'AI analizi sırasında bir hata oluştu');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeProfile = async (influencer) => {
    try {
      setAnalyzingProfile(true);
      setProfileAnalysisError('');
      const response = await authService.analyzeProfile(influencer);
      setProfileAnalysis(response.analysis);
    } catch (error) {
      setProfileAnalysisError(error.response?.data?.error || 'Profil analizi sırasında bir hata oluştu');
    } finally {
      setAnalyzingProfile(false);
    }
  };

  // Unique categories for filter
  const uniqueCategories = useMemo(() => {
    if (!campaign?.applications) return [];
    const cats = campaign.applications
      .flatMap(app => app.influencer?.influencerProfile?.categories || [])
      .filter(Boolean);
    return Array.from(new Set(cats));
  }, [campaign]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    if (!campaign?.applications) return [];
    return campaign.applications.filter(application => {
      if (!application) return false;
      // Status filter
      if (filters.status !== 'all' && application.status !== filters.status) return false;
      // Follower count filter
      if (filters.minFollowers && filters.minFollowers.trim() !== '') {
        const minFollowers = parseInt(filters.minFollowers.replace(/[^0-9]/g, ''));
        const influencerFollowers =
          application.influencer?.influencerProfile?.followers ??
          application.influencer?.influencerProfile?.highestFollowerCount ?? 0;
        if (isNaN(minFollowers) || influencerFollowers < minFollowers) return false;
      }
      // Category filter
      if (filters.category !== 'all' && application.influencer?.influencerProfile?.categories) {
        if (!application.influencer.influencerProfile.categories.includes(filters.category)) return false;
      }
      return true;
    });
  }, [campaign, filters]);

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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white mb-4">Başvurular</h3>
                <div className="flex gap-2">
                  {(user?.role === 'admin' || (user?.role === 'brand' && campaign.creator?._id === user._id)) && (
                    <>
                      <button
                        onClick={() => setShowFilters(f => !f)}
                        className="bg-[#7c58c2] text-white px-4 py-2 rounded-md hover:bg-[#8c68d2] focus:outline-none focus:ring-2 focus:ring-[#7c58c2]"
                      >
                        {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                      </button>
                      <button
                        onClick={handleAnalyzeApplications}
                        disabled={analyzing}
                        className={`bg-[#7c58c2] text-white px-4 py-2 rounded-md hover:bg-[#8c68d2] focus:outline-none focus:ring-2 focus:ring-[#7c58c2] ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {analyzing ? 'Analiz Ediliyor...' : 'AI ile Başvuruları Analiz Et'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {showFilters && (
                <div className="bg-[#232326] p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Durum</label>
                    <select
                      className="bg-[#2c2c2e] text-white rounded px-3 py-2 focus:outline-none"
                      value={filters.status}
                      onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                    >
                      <option value="all">Tümü</option>
                      <option value="Beklemede">Beklemede</option>
                      <option value="Kabul Edildi">Kabul Edildi</option>
                      <option value="Reddedildi">Reddedildi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Min. Takipçi</label>
                    <input
                      type="number"
                      className="bg-[#2c2c2e] text-white rounded px-3 py-2 focus:outline-none w-32"
                      placeholder="Örn: 10000"
                      value={filters.minFollowers}
                      onChange={e => setFilters(f => ({ ...f, minFollowers: e.target.value.replace(/[^0-9]/g, '') }))}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Kategori</label>
                    <select
                      className="bg-[#2c2c2e] text-white rounded px-3 py-2 focus:outline-none"
                      value={filters.category}
                      onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                    >
                      <option value="all">Tümü</option>
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {aiAnalysis && (
                <div className="bg-[#3c3c3e] p-4 rounded-lg mb-4">
                  <h4 className="text-white font-medium mb-2">AI Analiz Sonuçları</h4>
                  <div className="space-y-3">
                    {aiAnalysis.rankings.map((rank) => (
                      <div key={rank.influencerId} className="bg-[#2c2c2e] p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white font-medium">{rank.name}</h5>
                          <span className="text-[#7c58c2]">Sıra: {rank.rank}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{rank.explanation}</p>
                        <div className="flex flex-wrap gap-2">
                          {rank.keyFactors.map((factor, index) => (
                            <span key={index} className="bg-[#4c4c4e] text-gray-300 text-xs px-2 py-1 rounded">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-3 bg-[#2c2c2e] rounded-md">
                      <h5 className="text-white font-medium mb-2">Genel Değerlendirme</h5>
                      <p className="text-gray-300">{aiAnalysis.summary}</p>
                    </div>
                  </div>
                </div>
              )}
              {filteredApplications.length === 0 ? (
                <p className="text-gray-400">Filtrelere uygun başvuru bulunamadı</p>
              ) : (
                filteredApplications.map((application) => (
                  <div
                    key={application._id}
                    className="relative group bg-gradient-to-br from-[#232326] to-[#29293a] p-6 rounded-2xl mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 border border-[#28283a]/60 hover:border-[#7c58c2]/60"
                    style={{ minHeight: 140 }}
                  >
                    {/* Avatar & Info */}
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      {/* Avatar or Photo */}
                      {application.influencer?.profilePhoto ? (
                        <img
                          src={application.influencer.profilePhoto}
                          alt={application.influencer.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#7c58c2] shadow"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7c58c2] to-[#a088e6] flex items-center justify-center text-3xl font-bold text-white uppercase shadow">
                          {application.influencer?.name?.[0] || '?'}
                        </div>
                      )}
                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl font-bold text-white truncate max-w-[180px]">{application.influencer?.name || 'İsimsiz Kullanıcı'}</span>
                          <button
                            onClick={() => navigate(`/profile/${application.influencer._id}`)}
                            className="ml-1 text-[#7c58c2] hover:text-[#a088e6] text-xs underline font-medium"
                          >
                            Profili Gör
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                          <svg className="w-4 h-4 text-[#7c58c2]" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                          <span className="truncate">{application.influencer?.email || 'Email bilgisi yok'}</span>
                        </div>
                        {application.influencer?.influencerProfile && (
                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-300 items-center">
                            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-[#7c58c2]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" /></svg>Takipçi: <span className="font-semibold text-white ml-1">{application.influencer.influencerProfile.highestFollowerCount?.toLocaleString() || 'Belirtilmemiş'}</span></span>
                            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-[#7c58c2]" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h2V7H6zm4 0v2h2V7h-2z" /></svg>Kategoriler: <span className="font-semibold text-white ml-1">{application.influencer.influencerProfile.categories?.join(', ') || 'Belirtilmemiş'}</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3 min-w-[170px]">
                      <span className={`flex items-center gap-2 px-4 py-1 text-xs rounded-full font-semibold mb-1 shadow transition-all duration-200 ${
                        application.status === 'Kabul Edildi'
                          ? 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                          : application.status === 'Reddedildi'
                          ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900'
                      }`}>
                        {application.status === 'Kabul Edildi' && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        {application.status === 'Reddedildi' && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                        {application.status === 'Beklemede' && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>}
                        {application.status}
                      </span>
                      {user?.role === 'brand' && campaign.creator?._id === user._id && application.status === 'Beklemede' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateApplicationStatus(application._id, 'Kabul Edildi')}
                            className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Kabul Et
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(application._id, 'Reddedildi')}
                            className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            Reddet
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Message */}
                    <div className="w-full md:w-auto mt-4 md:mt-0 md:max-w-[340px]">
                      <blockquote className="bg-[#232336] border-l-4 border-[#7c58c2] rounded-xl p-4 text-gray-200 text-sm italic shadow-inner">
                        <span className="font-semibold text-[#7c58c2] not-italic">Başvuru Mesajı:</span><br />
                        {application.message ? (
                          <span className="text-gray-100">{application.message}</span>
                        ) : (
                          <span className="italic text-gray-500">Mesaj yok</span>
                        )}
                      </blockquote>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsScreen;