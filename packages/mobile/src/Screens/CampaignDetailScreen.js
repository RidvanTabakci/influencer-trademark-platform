import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { campaignService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CampaignDetailScreen = ({ route, navigation }) => {
  const { campaignId } = route.params;
  const { user, loading: userLoading } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Add filter states
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
      console.log('Campaign response:', response);
      setCampaign(response.campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setError('Kampanya detayları yüklenirken bir hata oluştu');
      Alert.alert('Hata', 'Kampanya detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaign && user) {
      const creatorId =
        typeof campaign.creator === 'string'
          ? campaign.creator
          : campaign.creator?._id;
      const owner =
        user?.role === 'admin' ||
        (user?.role === 'brand' && String(creatorId) === String(user._id));
      setIsOwner(owner);

      // Debug log
      console.log('user._id:', user._id);
      console.log('creatorId:', creatorId);
      console.log('isOwner:', owner);
    }
  }, [campaign, user]);

  const handleApply = async () => {
    try {
      if (!applicationMessage.trim()) {
        Alert.alert('Hata', 'Lütfen başvuru mesajınızı yazın');
        return;
      }

      setSubmitting(true);
      await campaignService.applyToCampaign(campaignId, { message: applicationMessage });
      setShowApplicationForm(false);
      setApplicationMessage('');
      fetchCampaignDetails();
      Alert.alert('Başarılı', 'Başvurunuz başarıyla alındı!');
    } catch (error) {
      Alert.alert('Hata', error.response?.data?.error || 'Başvuru yapılırken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await campaignService.updateApplicationStatus(campaignId, applicationId, { status });
      fetchCampaignDetails();
      Alert.alert('Başarılı', `Başvuru durumu ${status} olarak güncellendi`);
    } catch (error) {
      Alert.alert('Hata', error.response?.data?.error || 'Başvuru durumu güncellenirken bir hata oluştu');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Kabul Edildi':
        return '#4CAF50';
      case 'Reddedildi':
        return '#f44336';
      default:
        return '#FFC107';
    }
  };

  const handleAnalyzeApplications = async () => {
    try {
      setAnalyzing(true);
      const response = await campaignService.analyzeApplications(campaignId);
      setAiAnalysis(response.analysis);
    } catch (error) {
      Alert.alert('Hata', error.response?.data?.error || 'Başvurular analiz edilirken bir hata oluştu');
    } finally {
      setAnalyzing(false);
    }
  };

  const getFilteredApplications = () => {
    console.log('Campaign in getFilteredApplications:', campaign);
    if (!campaign) return [];
    if (!Array.isArray(campaign.applications)) {
      console.log('Applications is not an array:', campaign.applications);
      return [];
    }
    
    return campaign.applications.filter(application => {
      if (!application) return false;
      
      // Status filter
      if (filters.status !== 'all' && application.status !== filters.status) {
        return false;
      }

      // Follower count filter
      if (filters.minFollowers && filters.minFollowers.trim() !== '') {
        const minFollowers = parseInt(filters.minFollowers.replace(/[^0-9]/g, ''));
        const influencerFollowers =
          application.influencer?.influencerProfile?.followers ??
          application.influencer?.influencerProfile?.highestFollowerCount ?? 0;
        
        if (isNaN(minFollowers) || influencerFollowers < minFollowers) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && application.influencer?.influencerProfile?.categories) {
        if (!application.influencer.influencerProfile.categories.includes(filters.category)) {
          return false;
        }
      }

      return true;
    });
  };

  const getUniqueCategories = () => {
    if (!campaign) return [];
    if (!Array.isArray(campaign.applications)) return [];
    
    const categories = new Set();
    campaign.applications.forEach(application => {
      if (application?.influencer?.influencerProfile?.categories) {
        application.influencer.influencerProfile.categories.forEach(category => {
          categories.add(category);
        });
      }
    });
    return Array.from(categories);
  };

  if (userLoading || loading || !user || !campaign) {
    console.log('Loading state:', { userLoading, loading, user: !!user, campaign: !!campaign });
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c58c2" />
      </View>
    );
  }

  const filteredApplications = getFilteredApplications();
  console.log('Filtered applications:', filteredApplications);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{campaign.title}</Text>
          <Text style={styles.brand}>Marka: {campaign.brand}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kampanya Detayları</Text>
          <Text style={styles.description}>{campaign.description}</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Bütçe</Text>
            <Text style={styles.infoValue}>{campaign.budget.toLocaleString()} TL</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Durum</Text>
            <Text style={styles.infoValue}>{campaign.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gereksinimler</Text>
          <Text style={styles.description}>{campaign.requirements}</Text>
        </View>

        {campaign.status === 'Aktif' && user?.role === 'influencer' && (
          <View style={styles.section}>
            {!showApplicationForm ? (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowApplicationForm(true)}
              >
                <Text style={styles.applyButtonText}>Başvur</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.applicationForm}>
                <Text style={styles.formLabel}>Başvuru Mesajınız</Text>
                <TextInput
                  style={styles.messageInput}
                  value={applicationMessage}
                  onChangeText={setApplicationMessage}
                  placeholder="Kendinizi tanıtın ve neden bu kampanya için uygun olduğunuzu açıklayın..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                  editable={!submitting}
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.submitButton, !applicationMessage.trim() && styles.buttonDisabled]}
                    onPress={handleApply}
                    disabled={!applicationMessage.trim() || submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Başvuruyu Gönder</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowApplicationForm(false);
                      setApplicationMessage('');
                    }}
                    disabled={submitting}
                  >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {isOwner && campaign.applications?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Analizi</Text>
              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={handleAnalyzeApplications}
                disabled={analyzing}
              >
                {analyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.analyzeButtonText}>Başvuruları Analiz Et</Text>
                )}
              </TouchableOpacity>
            </View>

            {aiAnalysis && Array.isArray(aiAnalysis.rankings) && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisSummary}>{aiAnalysis.summary}</Text>
                {aiAnalysis.rankings.map((ranking) => (
                  <View key={ranking.influencerId} style={styles.rankingCard}>
                    <View style={styles.rankingHeader}>
                      <Text style={styles.rankingTitle}>
                        #{ranking.rank} - {ranking.name}
                      </Text>
                    </View>
                    <Text style={styles.rankingExplanation}>{ranking.explanation}</Text>
                    <View style={styles.keyFactorsContainer}>
                      {ranking.keyFactors.map((factor, index) => (
                        <View key={index} style={styles.keyFactorBadge}>
                          <Text style={styles.keyFactorText}>{factor}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Başvurular</Text>
            {isOwner && (
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Text style={styles.filterButtonText}>
                  {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isOwner && showFilters && (
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Durum:</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.status === 'all' && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, status: 'all' })}
                  >
                    <Text style={styles.filterOptionText}>Tümü</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.status === 'Beklemede' && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, status: 'Beklemede' })}
                  >
                    <Text style={styles.filterOptionText}>Beklemede</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.status === 'Kabul Edildi' && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, status: 'Kabul Edildi' })}
                  >
                    <Text style={styles.filterOptionText}>Kabul Edildi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.status === 'Reddedildi' && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, status: 'Reddedildi' })}
                  >
                    <Text style={styles.filterOptionText}>Reddedildi</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Min. Takipçi:</Text>
                <TextInput
                  style={styles.filterInput}
                  value={filters.minFollowers}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setFilters({ ...filters, minFollowers: numericValue });
                  }}
                  placeholder="Örn: 10000"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Kategori:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.category === 'all' && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, category: 'all' })}
                  >
                    <Text style={styles.filterOptionText}>Tümü</Text>
                  </TouchableOpacity>
                  {getUniqueCategories().map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterOption,
                        filters.category === category && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilters({ ...filters, category })}
                    >
                      <Text style={styles.filterOptionText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {!Array.isArray(filteredApplications) ? (
            <Text style={styles.emptyText}>Başvuru verisi yüklenemedi</Text>
          ) : filteredApplications.length === 0 ? (
            <Text style={styles.emptyText}>Filtrelere uygun başvuru bulunamadı</Text>
          ) : (
            filteredApplications.map((application) => {
              if (!application || !application.influencer) {
                console.log('Invalid application:', application);
                return null;
              }
              
              return (
                <View key={application._id} style={styles.applicationCard}>
                  {user?.role === 'influencer' ? (
                    <View style={styles.applicationHeader}>
                      <Text style={styles.applicantName}>
                        {application.influencer?.name || 'İsimsiz Kullanıcı'}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(application.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{application.status}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.applicationContent}>
                      <View style={styles.applicationHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <Text
                            style={styles.applicantName}
                            onPress={() => navigation.navigate('UserProfile', { userId: application.influencer._id })}
                          >
                            {application.influencer?.name || 'İsimsiz Kullanıcı'}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusColor(application.status), marginLeft: 8 },
                            ]}
                          >
                            <Text style={styles.statusText}>{application.status}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.applicantEmail}>
                        {application.influencer?.email || 'Email bilgisi yok'}
                      </Text>
                      {application.influencer?.influencerProfile && (
                        <View style={styles.profileInfo}>
                          <Text style={styles.profileText}>
                            Takipçi: {
                              (
                                application.influencer.influencerProfile.followers ??
                                application.influencer.influencerProfile.highestFollowerCount
                              )
                                ? (application.influencer.influencerProfile.followers ?? application.influencer.influencerProfile.highestFollowerCount).toLocaleString('tr-TR')
                                : 'Belirtilmemiş'
                            }
                          </Text>
                          <Text style={styles.profileText}>
                            Kategoriler: {application.influencer.influencerProfile.categories?.join(', ') || 'Belirtilmemiş'}
                          </Text>
                          {application.influencer.influencerProfile.engagementRate && (
                            <Text style={styles.profileText}>
                              Etkileşim Oranı: %{application.influencer.influencerProfile.engagementRate.toFixed(2)}
                            </Text>
                          )}
                          {application.influencer.influencerProfile.averageLikes && (
                            <Text style={styles.profileText}>
                              Ortalama Beğeni: {application.influencer.influencerProfile.averageLikes.toLocaleString('tr-TR')}
                            </Text>
                          )}
                        </View>
                      )}
                      <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{application.message}</Text>
                      </View>
                      <View style={styles.applicationActions}>
                        {isOwner && application.status === 'Beklemede' && (
                          <View style={styles.statusButtons}>
                            <TouchableOpacity
                              style={[styles.statusButton, { backgroundColor: '#4CAF50' }]}
                              onPress={() => handleUpdateApplicationStatus(application._id, 'Kabul Edildi')}
                            >
                              <Text style={styles.statusButtonText}>Kabul Et</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.statusButton, { backgroundColor: '#f44336' }]}
                              onPress={() => handleUpdateApplicationStatus(application._id, 'Reddedildi')}
                            >
                              <Text style={styles.statusButtonText}>Reddet</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: '#999',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#7c58c2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applicationForm: {
    backgroundColor: '#2c2c2e',
    padding: 16,
    borderRadius: 8,
  },
  formLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: '#3c3c3e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7c58c2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#3c3c3e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  applicationCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  applicationContent: {
    flex: 1,
  },
  applicantEmail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  profileInfo: {
    marginBottom: 12,
  },
  profileText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  messageContainer: {
    backgroundColor: '#3c3c3e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
  },
  applicationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  applicationActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#7c58c2',
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderRadius: 5,
  },
  messageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: '#7c58c2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  analysisContainer: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 16,
  },
  analysisSummary: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  rankingCard: {
    backgroundColor: '#3c3c3e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  rankingHeader: {
    marginBottom: 8,
  },
  rankingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankingExplanation: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  keyFactorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyFactorBadge: {
    backgroundColor: '#7c58c2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keyFactorText: {
    color: '#fff',
    fontSize: 12,
  },
  filterButton: {
    backgroundColor: '#7c58c2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    backgroundColor: '#3c3c3e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterOptionActive: {
    backgroundColor: '#7c58c2',
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 14,
  },
  filterInput: {
    backgroundColor: '#3c3c3e',
    borderRadius: 8,
    padding: 8,
    color: '#fff',
    width: '100%',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
});

export default CampaignDetailScreen; 