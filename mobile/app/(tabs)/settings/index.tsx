import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Switch,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Screen,
  Text,
  SectionHeader,
  Card,
  theme,
  SettingsItem,
  Button,
  Avatar,
  Dialog,
} from "../../../src/design-system";
import { useSettingsStore } from "../../../src/features/settings/stores/settingsStore";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen() {
  const {
    autoSync,
    setAutoSync,
    retentionDays,
    setRetentionDays,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    userBio,
    setUserBio,
    userAvatarUri,
    setUserAvatarUri,
    serverIp,
    setServerIp,
    groqApiKey,
    setGroqApiKey,
    loadSettings,
  } = useSettingsStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  const [tempBio, setTempBio] = useState(userBio);
  const [tempAvatar, setTempAvatar] = useState(userAvatarUri);
  const [tempIp, setTempIp] = useState(serverIp);
  const [tempKey, setTempKey] = useState(groqApiKey);
  const [showKey, setShowKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  // Custom alert dialog state
  const [alertDialog, setAlertDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const showCustomAlert = (alertTitle: string, alertMessage: string) => {
    setAlertDialog({
      visible: true,
      title: alertTitle,
      message: alertMessage,
    });
  };

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setTempName(userName);
    setTempEmail(userEmail);
    setTempBio(userBio);
    setTempAvatar(userAvatarUri);
    setTempIp(serverIp);
    setTempKey(groqApiKey);
  }, [userName, userEmail, userBio, userAvatarUri, serverIp, groqApiKey]);

  const handlePickAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        showCustomAlert("Permission Required", "Please allow access to your photos to set a profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        setTempAvatar(uri);
        if (!isEditingProfile) {
          setUserAvatarUri(uri);
        }
      }
    } catch (e) {
      console.warn("Error picking image:", e);
    }
  };

  const getRetentionText = (days: number) => {
    if (days === 0) return "Forever";
    return `${days} Days`;
  };

  const handleCycleRetention = () => {
    const cycles = [7, 30, 90, 0];
    const currentIndex = cycles.indexOf(retentionDays);
    const nextIndex = currentIndex === -1 || currentIndex === cycles.length - 1 ? 0 : currentIndex + 1;
    setRetentionDays(cycles[nextIndex] as number);
  };

  const handleSaveProfile = () => {
    setUserName(tempName.trim());
    setUserEmail(tempEmail.trim());
    setUserBio(tempBio.trim());
    setUserAvatarUri(tempAvatar);
    setServerIp(tempIp.trim());
    setGroqApiKey(tempKey.trim());
    setIsEditingProfile(false);
    showCustomAlert("Profile Saved", "Your settings and profile have been updated successfully.");
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`http://${tempIp.trim()}:8080/api/v1/status`, {
        signal: controller.signal,
      });
      clearTimeout(id);
      if (res.ok) {
        showCustomAlert("Connection Successful", `Connected to Vaha device at ${tempIp.trim()}`);
      } else {
        showCustomAlert("Connection Failed", `Device returned HTTP status ${res.status}`);
      }
    } catch (e) {
      showCustomAlert("Connection Error", `Could not reach Vaha device at ${tempIp.trim()}. Make sure your device and phone are on the same Wi-Fi.`);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <Screen scrollable withMarginThread style={styles.container}>
      {/* Page Title & Profile Header */}
      <View style={styles.headerRow}>
        <SectionHeader title="Profile Settings" />
        {!isEditingProfile ? (
          <TouchableOpacity onPress={() => setIsEditingProfile(true)} style={styles.editBtn}>
            <Feather name="edit-2" size={16} color={theme.colors.accent.primary} />
            <Text variant="label-sm" style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSaveProfile} style={styles.editBtn}>
            <Feather name="check" size={16} color={theme.colors.semantic.success} />
            <Text variant="label-sm" style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Card */}
      <Card style={styles.card}>
        {!isEditingProfile ? (
          <View style={styles.profileView}>
            <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapper}>
              <Avatar
                initials={userName ? userName : "User"}
                imageUri={userAvatarUri || null}
                size={72}
              />
              <View style={styles.cameraBadge}>
                <Feather name="camera" size={12} color="#FFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text variant="headline-lg" style={styles.nameText}>
                {userName || "Your Name"}
              </Text>
              <Text variant="body-md" style={styles.emailText}>
                {userEmail || "Tap Edit Profile to set email"}
              </Text>
              {Boolean(userBio) && (
                <Text variant="meta-sm" style={styles.bioText}>
                  {userBio}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.editForm}>
            <View style={styles.avatarEditRow}>
              <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapperLarge}>
                <Avatar
                  initials={tempName || "User"}
                  imageUri={tempAvatar || null}
                  size={80}
                />
                <View style={styles.cameraOverlay}>
                  <Feather name="camera" size={18} color="#FFF" />
                  <Text variant="meta-sm" style={{ color: "#FFF", fontSize: 10, marginTop: 2 }}>Change</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text variant="label-sm" style={styles.inputLabel}>FULL NAME</Text>
            <TextInput
              style={styles.textInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="e.g. John Doe"
              placeholderTextColor={theme.colors.text.muted}
            />

            <Text variant="label-sm" style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.textInput}
              value={tempEmail}
              onChangeText={setTempEmail}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.text.muted}
            />

            <Text variant="label-sm" style={styles.inputLabel}>BIO / SHORT NOTE</Text>
            <TextInput
              style={[styles.textInput, { height: 70, textAlignVertical: "top" }]}
              value={tempBio}
              onChangeText={setTempBio}
              placeholder="Tell us a little about your voice notes..."
              multiline
              placeholderTextColor={theme.colors.text.muted}
            />
          </View>
        )}
      </Card>

      {/* Device Connection Settings */}
      <SectionHeader title="Device Connection" />
      <Card style={styles.card}>
        <Text variant="label-sm" style={styles.inputLabel}>VAHA DEVICE IP ADDRESS</Text>
        <View style={styles.ipRow}>
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            value={tempIp}
            onChangeText={setTempIp}
            placeholder="192.168.x.x"
            keyboardType="numeric"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.text.muted}
          />
          <Button
            variant="outline"
            onPress={handleTestConnection}
            disabled={testingConnection}
            style={{ minWidth: 100 }}
          >
            {testingConnection ? <ActivityIndicator size="small" color={theme.colors.accent.primary} /> : "Test IP"}
          </Button>
        </View>
        <Text variant="meta-sm" style={styles.hintText}>
          Enter the IP address of your Vaha Box on your local Wi-Fi.
        </Text>
      </Card>

      {/* Cloud Services Settings */}
      <SectionHeader title="Cloud Transcription (Optional)" />
      <Card style={styles.card}>
        <Text variant="body-md" style={styles.descriptionText}>
          Vaha transcribes audio on-device. If your Vaha device is offline, you can configure your free Groq API key for cloud fallback.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="label-sm" style={styles.inputLabel}>GROQ API KEY</Text>
          <TouchableOpacity onPress={() => setShowKey(!showKey)}>
            <Feather name={showKey ? "eye-off" : "eye"} size={16} color={theme.colors.text.muted} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          value={tempKey}
          onChangeText={setTempKey}
          placeholder="gsk_..."
          secureTextEntry={!showKey}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.text.muted}
        />
      </Card>

      {/* App Preferences */}
      <SectionHeader title="Preferences & Storage" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text variant="body-md" style={styles.label}>Auto-Sync Notes</Text>
            <Text variant="meta-sm" style={styles.mutedText}>Download new notes automatically when device connects</Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{
              false: theme.colors.accent.border,
              true: theme.colors.accent.primary,
            }}
          />
        </View>
        <SettingsItem
          label="Keep Notes Locally"
          value={getRetentionText(retentionDays)}
          onPress={handleCycleRetention}
        />
      </Card>

      {/* Save Button if Editing */}
      {isEditingProfile && (
        <Button variant="primary" onPress={handleSaveProfile} style={{ marginBottom: 24 }}>
          Save Profile & Settings
        </Button>
      )}

      {/* About Section */}
      <SectionHeader title="About" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="body-md" style={styles.label}>App Version</Text>
          <Text variant="body-md" style={styles.value}>1.1.0 (Commercial Baseline)</Text>
        </View>
      </Card>

      {/* Custom design system in-app dialog alert */}
      <Dialog
        visible={alertDialog.visible}
        title={alertDialog.title}
        message={alertDialog.message}
        confirmText="OK"
        onConfirm={() => setAlertDialog(prev => ({ ...prev, visible: false }))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 64,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: `${theme.colors.accent.primary}15`,
  },
  editText: {
    color: theme.colors.accent.primary,
    fontWeight: "600",
  },
  saveText: {
    color: theme.colors.semantic.success,
    fontWeight: "bold",
  },
  card: {
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  label: {
    color: theme.colors.text.primary,
  },
  value: {
    color: theme.colors.text.muted,
  },
  mutedText: {
    color: theme.colors.text.muted,
    fontSize: 12,
    marginTop: 2,
  },
  profileView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarWrapperLarge: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 12,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.accent.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditRow: {
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    marginBottom: 2,
  },
  emailText: {
    color: theme.colors.text.muted,
    fontSize: 14,
  },
  bioText: {
    color: theme.colors.text.primary,
    marginTop: 6,
    fontStyle: "italic",
  },
  editForm: {
    gap: 6,
  },
  inputLabel: {
    color: theme.colors.text.muted,
    marginTop: 8,
    marginBottom: 4,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.accent.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    fontSize: 15,
  },
  ipRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  hintText: {
    color: theme.colors.text.muted,
    marginTop: 6,
    fontSize: 12,
  },
  descriptionText: {
    color: theme.colors.text.muted,
    lineHeight: 20,
    marginBottom: 12,
  },
});
