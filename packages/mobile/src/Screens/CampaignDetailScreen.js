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
} from 'react-native';
import { campaignService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CampaignDetailScreen = ({ route, navigation }) => {
  const { campaignId } = route.params;
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      const data = await campaignService.getCampaign(campaignId);
      setCampaign(data);
    } catch (error) {
      setError('Kampanya detayları yüklenirken bir hata oluştu');
      Alert.alert('Hata', 'Kampanya detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Kampanyayı Sil',
      'Bu kampanyayı silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await campaignService.deleteCampaign(campaignId);
              Alert.alert('Başarılı', 'Kampanya başarıyla silindi', [
                {
                  text: 'Tamam',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Hata', 'Kampanya silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c58c2" />
      </View>
    );
  }

  if (error || !campaign) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Kampanya bulunamadı'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{campaign.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: campaign.status === 'active' ? '#4CAF50' : '#9E9E9E' },
            ]}
          >
            <Text style={styles.statusText}>
              {campaign.status === 'active' ? 'Aktif' : 'Pasif'}
            </Text>
          </View>
        </View>
        {user?.role === 'brand' && campaign.brand === user.name && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditCampaign', { campaignId })}
            >
              <Text style={styles.editButtonText}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kampanya Detayları</Text>
        <Text style={styles.description}>{campaign.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marka</Text>
        <Text style={styles.infoText}>{campaign.brand}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bütçe</Text>
        <Text style={styles.infoText}>{campaign.budget} TL</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gereksinimler</Text>
        <Text style={styles.infoText}>{campaign.requirements}</Text>
      </View>

      {user?.role === 'influencer' && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate('ApplyCampaign', { campaignId })}
        >
          <Text style={styles.applyButtonText}>Başvur</Text>
        </TouchableOpacity>
      )}
    </ScrollView></SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#7c58c2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#999',
  },
  applyButton: {
    backgroundColor: '#7c58c2',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CampaignDetailScreen; 