import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import API_URL from "../config";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
      Alert.alert("Başarılı", "Giriş yapıldı!");
      console.log("Token:", response.data.token);
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.error || "Giriş başarısız!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1e", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: { width: "100%", backgroundColor: "#7c58c2", padding: 15, borderRadius: 10, marginBottom: 15, color: "#fff", fontSize: 16 },
  button: { backgroundColor: "#7c58c2", padding: 15, borderRadius: 10, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default LoginScreen;
