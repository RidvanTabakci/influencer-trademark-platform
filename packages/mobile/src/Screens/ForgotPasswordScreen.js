import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import API_URL from "../config";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      Alert.alert("Başarılı", response.data.message);
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.error || "Bir hata oluştu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifre Sıfırlama</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta adresinizi girin"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Şifre Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 15, borderBottomWidth: 1, marginBottom: 15 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ForgotPasswordScreen;
