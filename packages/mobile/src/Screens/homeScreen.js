import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const [campaigns, setCampaigns] = useState([
    {
      title: "Kampanya #1",
      description: "Ünlü bir markadan yüksek bütçeli işbirliği fırsatı!",
    },
    {
      title: "Kampanya #2",
      description: "Moda kategorisinde 5 işbirliği yayında!",
    },
  ]);

  // Yeni ilanı dinamik olarak ekle
  useEffect(() => {
    if (isFocused && route.params?.newCampaign) {
      setCampaigns(prev => [route.params.newCampaign, ...prev]);
    }
  }, [isFocused, route.params]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1c1c1e" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hoş geldin 👋</Text>

        {/* İlan Oluştur Butonu */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("Create Campaign")}
        >
          <Text style={styles.createButtonText}>+ İlan Oluştur</Text>
        </TouchableOpacity>

        {/* Arama Kutusu */}
        <TextInput
          placeholder="Marka veya kampanya ara..."
          placeholderTextColor="#ccc"
          style={styles.searchInput}
        />

        {/* Kampanya Listesi */}
        <Text style={styles.sectionTitle}>Oluşturulan İlanlar</Text>

        {campaigns.length === 0 ? (
          <Text style={styles.noCampaignText}>Henüz ilan yok.</Text>
        ) : (
          campaigns.map((campaign, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{campaign.title}</Text>
              <Text style={styles.cardDesc}>{campaign.description}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("CampaignDetail", {
                    title: campaign.title,
                    description: campaign.description,
                    features: campaign.features || [],
                  })
                }
              >
                <Text style={styles.buttonText}>Detayları Gör</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#7c58c2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#2c2c2e",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#fff",
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  noCampaignText: {
    color: "#888",
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#323232",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  cardDesc: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#7c58c2",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeScreen;