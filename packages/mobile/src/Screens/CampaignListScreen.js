import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { campaignService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const CampaignListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await campaignService.getAllCampaigns();
      setCampaigns(data);
      setError('');
    } catch (error) {
      setError('Kampanyalar yüklenirken bir hata oluştu');
      Alert.alert('Hata', 'Kampanyalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCampaigns();
    }, [])
  );

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCampaignItem = ({ item }) => (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={() => navigation.navigate('CampaignDetail', { campaignId: item._id })}
    >
      <View style={styles.campaignHeader}>
        <Text style={styles.campaignTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'active' ? '#4CAF50' : '#9E9E9E' },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Aktif' : 'Pasif'}
          </Text>
        </View>
      </View>
      <Text style={styles.campaignDescription}>{item.description}</Text>
      <View style={styles.campaignFooter}>
        <Text style={styles.campaignInfo}>Marka: {item.brand}</Text>
        <Text style={styles.campaignInfo}>Bütçe: {item.budget} TL</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c58c2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hoş Geldin, {user?.name}</Text>
        <Text style={styles.subtitle}>
          Mevcut kampanyaları görüntüle veya yeni bir kampanya oluştur
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Kampanya ara..."
          placeholderTextColor="#666"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredCampaigns}
          renderItem={renderCampaignItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz kampanya bulunmuyor'}
            </Text>
          }
        />
      )}

      {user?.role === 'brand' && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateCampaign')}
        >
          <Text style={styles.createButtonText}>Yeni Kampanya</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  header: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  campaignCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  campaignDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campaignInfo: {
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#7c58c2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CampaignListScreen;