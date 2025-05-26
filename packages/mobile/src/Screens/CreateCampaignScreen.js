// screens/CreateCampaignScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { campaignService } from '../services/api';

const RequirementCard = ({ requirement, onUpdate, onDelete, onTypeChange }) => {
  return (
    <View style={styles.requirementCard}>
      <View style={styles.requirementHeader}>
        {requirement.type === 'Özel' ? (
          <TextInput
            value={requirement.type}
            onChangeText={(text) => onTypeChange(requirement.id, text)}
            placeholder="Gereksinim türü"
            placeholderTextColor="#888"
            style={[styles.requirementTitle, { flex: 1, marginRight: 8 }]}
          />
        ) : (
          <Text style={styles.requirementTitle}>{requirement.type}</Text>
        )}
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.deleteButton}>Sil</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        value={requirement.value}
        onChangeText={(value) => onUpdate(requirement.id, value)}
        placeholder={`${requirement.type} değerini girin`}
        placeholderTextColor="#888"
        style={styles.requirementInput}
      />
    </View>
  );
};

const CreateCampaignScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    budget: '',
  });

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addRequirement = (type) => {
    const newRequirement = {
      id: Date.now().toString(),
      type,
      value: '',
    };
    setRequirements([...requirements, newRequirement]);
  };

  const updateRequirement = (id, value) => {
    setRequirements(requirements.map(req => 
      req.id === id ? { ...req, value } : req
    ));
  };

  const deleteRequirement = (id) => {
    setRequirements(requirements.filter(req => req.id !== id));
  };

  const addCustomRequirement = () => {
    const newRequirement = {
      id: Date.now().toString(),
      type: 'Özel',
      value: '',
    };
    setRequirements([...requirements, newRequirement]);
  };

  const handleTypeChange = (id, newType) => {
    setRequirements(requirements.map(req => req.id === id ? { ...req, type: newType } : req));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.brand || !formData.budget) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir bütçe girin');
      return;
    }

    if (requirements.length === 0) {
      Alert.alert('Hata', 'Lütfen en az bir gereksinim ekleyin');
      return;
    }

    setLoading(true);

    try {
      // Convert requirements array to string format
      const requirementsString = requirements
        .map(req => `${req.type}: ${req.value}`)
        .join('\n');

      const campaignData = {
        ...formData,
        budget: Number(formData.budget),
        requirements: requirementsString
      };

      await campaignService.createCampaign(campaignData);
      Alert.alert('Başarılı', 'Kampanya başarıyla oluşturuldu', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', error.response?.data?.error || 'Kampanya oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container1}>
        <Text style={styles.label}>Başlık</Text>
        <TextInput
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Kampanya başlığı girin"
          placeholderTextColor="#888"
          style={styles.input}
          editable={!loading}
        />

        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Kampanya açıklaması girin"
          placeholderTextColor="#888"
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <Text style={styles.label}>Marka</Text>
        <TextInput
          value={formData.brand}
          onChangeText={(value) => handleChange('brand', value)}
          placeholder="Marka adı"
          placeholderTextColor="#888"
          style={styles.input}
          editable={!loading}
        />

        <Text style={styles.label}>Bütçe (TL)</Text>
        <TextInput
          value={formData.budget}
          onChangeText={(value) => handleChange('budget', value)}
          placeholder="Örn: 1000"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="numeric"
          editable={!loading}
        />

        <Text style={styles.label}>Gereksinimler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={styles.requirementButtons}>
            <TouchableOpacity 
              style={styles.addRequirementButton}
              onPress={() => addRequirement('Cinsiyet')}
            >
              <Text style={styles.addRequirementButtonText}>Cinsiyet Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addRequirementButton}
              onPress={() => addRequirement('Minimum Takipçi')}
            >
              <Text style={styles.addRequirementButtonText}>Takipçi Sayısı Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addRequirementButton}
              onPress={() => addRequirement('Yaş Aralığı')}
            >
              <Text style={styles.addRequirementButtonText}>Yaş Aralığı Ekle</Text>
            </TouchableOpacity>
          </View>
          
        </View><TouchableOpacity onPress={addCustomRequirement} style={{ backgroundColor: '#7c58c2', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>+</Text>
          </TouchableOpacity></ScrollView>
        {requirements.map((requirement) => (
          <RequirementCard
            key={requirement.id}
            requirement={requirement}
            onUpdate={updateRequirement}
            onDelete={() => deleteRequirement(requirement.id)}
            onTypeChange={handleTypeChange}
          />
        ))}

        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>İlanı Oluştur</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
  },
  container1: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    padding: 10,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#2c2c2e",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
    marginBottom: 20,
    height: 40,
  },
  requirementButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  addRequirementButton: {
    backgroundColor: '#3c3c3e',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addRequirementButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  requirementCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  requirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    color: '#ff3b30',
    fontSize: 14,
  },
  requirementInput: {
    backgroundColor: '#3c3c3e',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
    height: 40,
  },
  createButton: {
    backgroundColor: "#7c58c2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CreateCampaignScreen;