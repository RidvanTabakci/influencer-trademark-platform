import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert ,SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import API_URL from "../config";

const ProfileScreen = ({ navigation, setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const { logout } = useAuth(); 

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // context logout
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "influencer":
        return "İçerik Üreticisi";
      case "brand":
        return "Marka";
      case "admin":
        return "Yönetici";
      default:
        return role;
    }
  };

  const getPermissionText = (permission) => {
    const permissionMap = {
      view_campaigns: "Kampanyaları Görüntüleme",
      create_campaign: "Kampanya Oluşturma",
      edit_campaign: "Kampanya Düzenleme",
      delete_campaign: "Kampanya Silme",
      manage_users: "Kullanıcı Yönetimi",
      manage_platform: "Platform Yönetimi"
    };
    return permissionMap[permission] || permission;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kullanıcı bilgileri yüklenemedi</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Ad Soyad:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>E-posta:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Hesap Türü:</Text>
          <Text style={styles.value}>{getRoleText(user.role)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yetkiler</Text>
        {user.permissions.map((permission, index) => (
          <View key={index} style={styles.permissionItem}>
            <Text style={styles.permissionText}>
              • {getPermissionText(permission)}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView></SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    color: "#aaa",
    fontSize: 16,
  },
  value: {
    flex: 2,
    color: "#fff",
    fontSize: 16,
  },
  permissionItem: {
    marginBottom: 8,
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#7c58c2",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
