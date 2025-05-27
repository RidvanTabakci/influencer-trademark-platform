import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/api";
import InstagramIcon from '../Assets/icons/instagram.png';
import YoutubeIcon from '../Assets/icons/youtube.png';
import TiktokIcon from '../Assets/icons/tiktok.png';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, loading, updateUser } = useAuth();
  console.log(user)
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    highestFollowerCount: user?.influencerProfile?.highestFollowerCount?.toString() || '',
  });
  const [socialMedia, setSocialMedia] = useState(user?.influencerProfile?.socialMedia || {
    instagram: '',
    youtube: '',
    tiktok: '',
  });
  const [brandProfile, setBrandProfile] = useState({
    companyName: user?.brandProfile?.companyName || '',
    industry: user?.brandProfile?.industry || '',
    website: user?.brandProfile?.website || '',
    description: user?.brandProfile?.description || '',
  });

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
      manage_platform: "Platform Yönetimi",
    };
    return permissionMap[permission] || permission;
  };

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleSaveSocialMedia = async () => {
    try {
      // Mevcut influencerProfile'dan diğer alanları da al
      const influencerProfile = {
        ...user.influencerProfile,
        socialMedia,
      };
      const response = await authService.updateInfluencerProfile(influencerProfile);
      const updatedUser = await authService.getMe();
      updateUser(updatedUser); // context'teki user'ı güncelle
      setError("");
      setIsEditing(false);
      Alert.alert("Başarılı", "Sosyal medya bilgileriniz güncellendi.");
    } catch (error) {
      setError("Sosyal medya bilgileri kaydedilemedi");
      Alert.alert("Hata", "Sosyal medya bilgileri kaydedilemedi.");
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandProfileChange = (field, value) => {
    setBrandProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      // Burada kişisel bilgileri güncelleyen bir API çağrısı olmalı
      // Örneğin: await authService.updatePersonalInfo(personalInfo);
      // Şimdilik örnek olarak sadece Alert gösteriyorum
      setIsEditingPersonal(false);
      setError("");
      Alert.alert("Başarılı", "Kişisel bilgileriniz güncellendi.");
    } catch (error) {
      setError("Kişisel bilgiler kaydedilemedi");
      Alert.alert("Hata", "Kişisel bilgiler kaydedilemedi.");
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7c58c2" />
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            {!isEditingPersonal ? (
              <TouchableOpacity onPress={() => setIsEditingPersonal(true)}>
                <Text style={styles.editButton}>Düzenle</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editButtons}>
                <TouchableOpacity onPress={() => setIsEditingPersonal(false)}>
                  <Text style={styles.cancelButton}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSavePersonalInfo}>
                  <Text style={styles.saveButton}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <InfoRow 
            label="Ad Soyad" 
            value={personalInfo.name} 
            editable={isEditingPersonal}
            onChangeText={(val) => handlePersonalInfoChange('name', val)}
          />
          <InfoRow 
            label="E-posta" 
            value={personalInfo.email} 
            editable={isEditingPersonal}
            onChangeText={(val) => handlePersonalInfoChange('email', val)}
          />
          <InfoRow 
            label="Hesap Türü" 
            value={getRoleText(user.role)} 
            editable={false}
          />
          {user.role === "influencer" && (
            <InfoRow
              label="En Yüksek Takipçi Sayısı"
              value={personalInfo.highestFollowerCount}
              editable={isEditingPersonal}
              onChangeText={(val) => handlePersonalInfoChange('highestFollowerCount', val.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
          )}
          {user.role === "brand" && (
            <>
              <InfoRow
                label="Şirket Adı"
                value={brandProfile.companyName}
                editable={isEditingPersonal}
                onChangeText={(val) => handleBrandProfileChange('companyName', val)}
              />
              <InfoRow
                label="Sektör"
                value={brandProfile.industry}
                editable={isEditingPersonal}
                onChangeText={(val) => handleBrandProfileChange('industry', val)}
              />
              <InfoRow
                label="Web Sitesi"
                value={brandProfile.website}
                editable={isEditingPersonal}
                onChangeText={(val) => handleBrandProfileChange('website', val)}
              />
              <InfoRow
                label="Açıklama"
                value={brandProfile.description}
                editable={isEditingPersonal}
                onChangeText={(val) => handleBrandProfileChange('description', val)}
              />
            </>
          )}
        </View>

        {user.permissions?.length > 0 && (
          <View style={styles.permissionsContainer}>
            <Text style={styles.sectionTitle}>Yetkiler</Text>
            {user.permissions.map((permission, index) => (
              <View key={index} style={styles.permissionItem}>
                <Icon name="circle" size={8} color="#7c58c2" style={styles.bullet} />
                <Text style={styles.permissionText}>{getPermissionText(permission)}</Text>
              </View>
            ))}
          </View>
        )}

        {user.role === "influencer" && (
          <View style={styles.socialMediaContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sosyal Medya Hesapları</Text>
              {!isEditing ? (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.editButton}>Düzenle</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(false)}>
                    <Text style={styles.cancelButton}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveSocialMedia}>
                    <Text style={styles.saveButton}>Kaydet</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <SocialMediaInput
              icon="instagram"
              color="#E1306C"
              value={socialMedia.instagram}
              editable={isEditing}
              placeholder="Instagram linki"
              onChangeText={(val) => handleSocialMediaChange("instagram", val)}
            />
            <SocialMediaInput
              icon="youtube"
              color="#FF0000"
              value={socialMedia.youtube}
              editable={isEditing}
              placeholder="YouTube linki"
              onChangeText={(val) => handleSocialMediaChange("youtube", val)}
            />
            <SocialMediaInput
              icon="tiktok"
              color="#000"
              value={socialMedia.tiktok}
              editable={isEditing}
              placeholder="TikTok linki"
              onChangeText={(val) => handleSocialMediaChange("tiktok", val)}
            />
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, editable, onChangeText, keyboardType }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}:</Text>
    {editable ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#666"
        keyboardType={keyboardType || 'default'}
      />
    ) : (
      <Text style={styles.value}>{value}</Text>
    )}
  </View>
);

const SocialMediaInput = ({ icon, color, value, editable, placeholder, onChangeText }) => {
  let iconSource;
  if (icon === 'instagram') iconSource = InstagramIcon;
  else if (icon === 'youtube') iconSource = YoutubeIcon;
  else if (icon === 'tiktok') iconSource = TiktokIcon;

  return (
    <View style={styles.socialMediaItem}>
      <Image source={iconSource} style={{ width: 24, height: 24, borderRadius: 6 }} />
      {editable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#666"
        />
      ) : (
        <Text style={styles.socialMediaLink}>
          {value || `${icon.charAt(0).toUpperCase() + icon.slice(1)} hesabı eklenmemiş`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1e" },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#2c2c2e" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#2c2c2e" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  infoContainer: { flexDirection: "row", marginBottom: 10 },
  label: { flex: 1, color: "#aaa", fontSize: 16 },
  value: { flex: 2, color: "#fff", fontSize: 16 },
  permissionsContainer: { marginTop: 24, paddingHorizontal: 20 },
  permissionItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  bullet: { marginRight: 8 },
  permissionText: { color: "#fff" },
  socialMediaContainer: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  editButton: { color: "#7c58c2" },
  editButtons: { flexDirection: "row", gap: 12 },
  cancelButton: { color: "#999" },
  saveButton: { color: "#7c58c2" },
  socialMediaItem: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#3c3c3e",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
  },
  socialMediaLink: { flex: 1, color: "#999" },
  logoutButton: {
    backgroundColor: "#7c58c2",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "#ff4444", fontSize: 16, textAlign: "center", marginBottom: 12 },
});

export default ProfileScreen;