import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { authService, aiService } from '../services/api';
import InstagramIcon from '../Assets/icons/instagram.png';
import YoutubeIcon from '../Assets/icons/youtube.png';
import TiktokIcon from '../Assets/icons/tiktok.png';


const UserProfileScreen = ({ route }) => {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getUserProfile(userId);
      setUser(response);
    } catch (error) {
      setError('Kullanıcı profili yüklenirken bir hata oluştu');
      Alert.alert('Hata', 'Kullanıcı profili yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'influencer':
        return 'İnfluencer';
      case 'brand':
        return 'Marka';
      case 'admin':
        return 'Yönetici';
      default:
        return role;
    }
  };

  const openLink = (url) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {
      Alert.alert('Hata', 'Bağlantı açılamadı');
    });
  };

  const handleAnalyzeProfile = async () => {
    setAiLoading(true);
    setAiResult(null);
    console.log('AI analiz butonuna tıklandı');
    console.log('user:', user);
    try {
      const result = await aiService.analyzeProfile(user);
      console.log('AI Profile Analysis Result:', result);
      setAiResult(result.analysis || result);
    } catch (e) {
      console.log('AI analiz hatası:', e);
      setAiResult({ oran: null, aciklama: 'Analiz başarısız.' });
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c58c2" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Kullanıcı bulunamadı'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{getRoleText(user.role)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
        <Text style={styles.infoText}>Email: {user.email}</Text>
      
      </View>

      {user.role === 'influencer' && user.influencerProfile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İnfluencer Profili</Text>
          {user.influencerProfile.bio ? (
            <Text style={styles.infoText}>Biyografi: {user.influencerProfile.bio}</Text>
          ) : null}
          <Text style={styles.infoText}>
            En Yüksek Takipçi Sayısı: {user.influencerProfile.highestFollowerCount || 'Belirtilmemiş'}
          </Text>
          {user.influencerProfile.socialMedia && (
            <ScrollView horizontal style={styles.socialMediaLinks}>
              {user.influencerProfile.socialMedia.instagram ? (
                <TouchableOpacity style={styles.socialLink} onPress={() => openLink(user.influencerProfile.socialMedia.instagram)}>
                  <Image source={InstagramIcon} style={styles.socialIcon} />
                  <Text style={styles.socialText}>Instagram</Text>
                </TouchableOpacity>
              ) : null}
              {user.influencerProfile.socialMedia.youtube ? (
                <TouchableOpacity style={styles.socialLink} onPress={() => openLink(user.influencerProfile.socialMedia.youtube)}>
                  <Image source={YoutubeIcon} style={styles.socialIcon} />
                  <Text style={styles.socialText}>YouTube</Text>
                </TouchableOpacity>
              ) : null}
              {user.influencerProfile.socialMedia.tiktok ? (
                <TouchableOpacity style={styles.socialLink} onPress={() => openLink(user.influencerProfile.socialMedia.tiktok)}>
                  <Image source={TiktokIcon} style={styles.socialIcon} />
                  <Text style={styles.socialText}>TikTok</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          )}
        </View>
      )}

      {user.role === 'brand' && user.brandProfile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marka Bilgileri</Text>
          <Text style={styles.infoText}>
            Marka Adı: {user.brandProfile.companyName || 'Belirtilmemiş'}
          </Text>
          <Text style={styles.infoText}>
            Sektör: {user.brandProfile.industry || 'Belirtilmemiş'}
          </Text>
          <Text style={styles.infoText}>
            Web Sitesi: {user.brandProfile.website || 'Belirtilmemiş'}
          </Text>
          <Text style={styles.infoText}>
            Lokasyon: {user.brandProfile.location || 'Belirtilmemiş'}
          </Text>
          <Text style={styles.infoText}>
            Açıklama: {user.brandProfile.description || 'Belirtilmemiş'}
          </Text>
        </View>
      )}

      <View style={{paddingHorizontal:20, marginTop:24}}>
        <TouchableOpacity onPress={handleAnalyzeProfile} style={{backgroundColor:'#7c58c2',padding:12,borderRadius:8,marginBottom:12}}>
          <Text style={{color:'#fff',fontWeight:'bold',textAlign:'center'}}>
            {aiLoading ? 'Analiz Ediliyor...' : 'Yapay Zeka ile Analiz Et'}
          </Text>
        </TouchableOpacity>
        {aiResult && (
          <View style={{backgroundColor:'#2c2c2e',padding:12,borderRadius:8,marginBottom:12}}>
            <Text style={{color:'#fff',fontWeight:'bold'}}>Doğruluk Oranı: {aiResult.oran !== undefined && aiResult.oran !== null ? `${aiResult.oran}%` : 'Bilinmiyor'}</Text>
            <Text style={{color:'#fff'}}>{aiResult.aciklama || aiResult.summary || 'Açıklama yok.'}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#23232a',
    alignItems: 'center',
    backgroundColor: '#23232a',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#7c58c2',
    fontWeight: '600',
  },
  section: {
    padding: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#23232a',
    backgroundColor: '#1c1c1e',
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 6,
  },
  socialMediaLinks: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 10,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232a',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  socialIcon: {
    width: 32,
    height: 32,
    marginRight: 6,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  socialText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  }
});

export default UserProfileScreen; 