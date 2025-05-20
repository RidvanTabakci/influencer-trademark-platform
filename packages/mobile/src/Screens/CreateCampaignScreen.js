// screens/CreateCampaignScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { campaignService } from '../services/api';

const CreateCampaignScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    budget: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Form validasyonu
    if (!formData.title || !formData.description || !formData.brand || !formData.budget || !formData.requirements) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    // Bütçe kontrolü
    if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir bütçe girin');
      return;
    }

    setLoading(true);

    try {
      const campaignData = {
        ...formData,
        budget: Number(formData.budget),
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
      <ScrollView>
        {/* Geri Tuşu */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>

        {/* Başlık Input */}
        <Text style={styles.label}>Başlık</Text>
        <TextInput
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Kampanya başlığı girin"
          placeholderTextColor="#888"
          style={styles.input}
          editable={!loading}
        />

        {/* Açıklama Input */}
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

        {/* Marka Input */}
        <Text style={styles.label}>Marka</Text>
        <TextInput
          value={formData.brand}
          onChangeText={(value) => handleChange('brand', value)}
          placeholder="Marka adı"
          placeholderTextColor="#888"
          style={styles.input}
          editable={!loading}
        />

        {/* Bütçe Input */}
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

        {/* Gereksinimler Input */}
        <Text style={styles.label}>Gereksinimler</Text>
        <TextInput
          value={formData.requirements}
          onChangeText={(value) => handleChange('requirements', value)}
          placeholder="Kampanya için gerekli şartları belirtin"
          placeholderTextColor="#888"
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        {/* İlanı Oluştur Butonu */}
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
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: "#7c58c2",
    fontSize: 16,
    fontWeight: "bold",
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