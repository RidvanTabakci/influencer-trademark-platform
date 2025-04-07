import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1c1c1e" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hoş geldin 👋</Text>

        <TextInput
          placeholder="Marka veya kampanya ara..."
          placeholderTextColor="#ccc"
          style={styles.searchInput}
        />

        <Text style={styles.sectionTitle}>Senin İçin Önerilenler</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kampanya #1</Text>
          <Text style={styles.cardDesc}>Ünlü bir markadan yüksek bütçeli işbirliği fırsatı!</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kampanya #2</Text>
          <Text style={styles.cardDesc}>Moda kategorisinde 5 işbirliği yayında!</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kampanya #2</Text>
          <Text style={styles.cardDesc}>Moda kategorisinde 5 işbirliği yayında!</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kampanya #2</Text>
          <Text style={styles.cardDesc}>Moda kategorisinde 5 işbirliği yayında!</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kampanya #2</Text>
          <Text style={styles.cardDesc}>Moda kategorisinde 5 işbirliği yayında!</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kampanya #2</Text>
          <Text style={styles.cardDesc}>Moda kategorisinde 5 işbirliği yayında!</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kampanya #2</Text>
          <Text style={styles.cardDesc}>Moda kategorisinde 5 işbirliği yayında!</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>
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
