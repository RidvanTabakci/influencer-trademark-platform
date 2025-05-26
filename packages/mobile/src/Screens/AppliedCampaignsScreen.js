import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { campaignService } from '../services/api';

const AppliedCampaignsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'influencer') {
      navigation.replace('Main');
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
      Alert.alert('Hata', 'Kampanyalar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const getApplicationStatus = (campaign) => {
    const application = campaign.applications.find(app => app.influencer._id === user._id);
    return application?.status || 'Beklemede';
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

  const renderCampaignItem = ({ item }) => (
    <View style={styles.campaignCard}>
      <View style={styles.campaignHeader}>
        <Text style={styles.campaignTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(getApplicationStatus(item)) },
          ]}
        >
          <Text style={styles.statusText}>
            {getApplicationStatus(item)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.brandText}>Marka: {item.brand}</Text>
      
      <Text style={styles.description} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.budgetText}>
          Bütçe: {item.budget.toLocaleString()} TL
        </Text>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('CampaignDetail', { campaignId: item._id })}
        >
          <Text style={styles.detailsButtonText}>Detayları Gör</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c58c2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Başvurduğum Kampanyalar</Text>
      </View>

      {appliedCampaigns.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Henüz hiçbir kampanyaya başvurmadınız.
          </Text>
        </View>
      ) : (
        <FlatList
          data={appliedCampaigns}
          renderItem={renderCampaignItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  campaignCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  brandText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    color: '#999',
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: '#7c58c2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AppliedCampaignsScreen; 