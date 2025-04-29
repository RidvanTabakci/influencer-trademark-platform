// screens/CreateCampaignScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const CreateCampaignScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);

  const addFeature = () => {
    if (featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const handleCreateCampaign = () => {
    if (title.trim() === "" || description.trim() === "") {
      Alert.alert("Eksik Bilgi", "Lütfen başlık ve açıklamayı doldurun.");
      return;
    }
  
    const campaignData = {
      title,
      description,
      features,
    };
  
    console.log("Oluşturulan İlan:", campaignData);
  
    Alert.alert("Başarılı", "İlan başarıyla oluşturuldu!");
  
    // Burada Home ekranına yeni kampanyayı gönderiyoruz
    navigation.navigate("Home", { newCampaign: campaignData });
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
          value={title}
          onChangeText={setTitle}
          placeholder="Kampanya başlığı girin"
          placeholderTextColor="#888"
          style={styles.input}
        />

        {/* Açıklama Input */}
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Kampanya açıklaması girin"
          placeholderTextColor="#888"
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          multiline
        />

        {/* Aranan Özellikler */}
        <Text style={styles.label}>Aranan Influencer Özellikleri</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={featureInput}
            onChangeText={setFeatureInput}
            placeholder="Özellik ekle (örn: 10k+ takipçi)"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addFeature}>
            <Text style={styles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Özellik Listesi */}
        {features.length > 0 ? (
          features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureText}>{feature}</Text>
              <TouchableOpacity onPress={() => removeFeature(index)}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noFeaturesText}>Henüz özellik eklenmedi.</Text>
        )}

        {/* İlanı Oluştur Butonu */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateCampaign}>
          <Text style={styles.createButtonText}>İlanı Oluştur</Text>
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
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#7c58c2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  featureItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2c2c2e",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  featureText: {
    color: "#fff",
    flex: 1,
  },
  removeButtonText: {
    color: "#ff6b6b",
    fontWeight: "bold",
    marginLeft: 10,
  },
  noFeaturesText: {
    color: "#888",
    fontStyle: "italic",
  },
  createButton: {
    backgroundColor: "#7c58c2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CreateCampaignScreen;