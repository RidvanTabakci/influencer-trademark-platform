import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

const ProfileScreen = ({ setIsLoggedIn }) => {
  const user = {
    name: "Kayra",
    email: "kayra@example.com",
  };

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Oturumu kapatmak istediğine emin misin?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Evet",
        onPress: () => {
          // AsyncStorage.removeItem('token') vs. eklenebilir
          setIsLoggedIn(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.options}>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Şifre Değiştir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Ayarlar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, { backgroundColor: "#ff4d4d" }]} onPress={handleLogout}>
          <Text style={[styles.optionText, { color: "#fff" }]}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 40,
  },
  options: {
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#2c2c2e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});

export { ProfileScreen };
