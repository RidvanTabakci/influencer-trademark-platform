import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import API_URL from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation, setIsLoggedIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("influencer"); // Varsayılan rol
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Form validasyonu
    if (!name || !email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Hata", "Geçerli bir email adresi giriniz!");
      return;
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password,
        role
      });

      // Token'ı kaydet
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      Alert.alert("Başarılı", "Kayıt tamamlandı, giriş yapılıyor...");
      console.log("Kayıtlı Kullanıcı:", response.data);

      // Otomatik giriş
      setIsLoggedIn(true);

    } catch (error) {
      console.error("Kayıt Hatası:", error.response?.data || error.message);
      
      // Hata mesajını göster
      const errorMessage = error.response?.data?.error || "Kayıt sırasında bir hata oluştu.";
      Alert.alert("Hata", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="Adınız"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Hesap Türü:</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "influencer" && styles.roleButtonActive
            ]}
            onPress={() => setRole("influencer")}
            disabled={loading}
          >
            <Text style={[
              styles.roleButtonText,
              role === "influencer" && styles.roleButtonTextActive
            ]}>Influencer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "brand" && styles.roleButtonActive
            ]}
            onPress={() => setRole("brand")}
            disabled={loading}
          >
            <Text style={[
              styles.roleButtonText,
              role === "brand" && styles.roleButtonTextActive
            ]}>Marka</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Login")}
        disabled={loading}
      >
        <Text style={styles.loginLink}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1c1c1e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#7c58c2",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#2c2c2e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7c58c2",
  },
  roleButtonActive: {
    backgroundColor: "#7c58c2",
    borderColor: "#7c58c2",
  },
  roleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  roleButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#7c58c2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default RegisterScreen;

