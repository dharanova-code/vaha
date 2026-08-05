import React, { useState } from "react";
import { StyleSheet, View, Switch, TextInput, TouchableOpacity } from "react-native";
import {
  Screen,
  Text,
  SectionHeader,
  Card,
  theme,
  SettingsItem,
  Button,
} from "../../../src/design-system";
import { useSettingsStore } from "../../../src/features/settings/stores/settingsStore";
import { Feather } from "@expo/vector-icons";

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
    groqApiKey,
    setGroqApiKey,
  } = useSettingsStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  const [tempKey, setTempKey] = useState(groqApiKey);
  const [showKey, setShowKey] = useState(false);

  const getRetentionText = (days: number) => {
    if (days === 0) return "Forever";
    return `${days} Days`;
  };

  const handleCycleRetention = () => {
    const cycles = [7, 30, 90, 0]; // 0 means forever
    const currentIndex = cycles.indexOf(retentionDays);
    const nextIndex = currentIndex === -1 || currentIndex === cycles.length - 1 ? 0 : currentIndex + 1;
    setRetentionDays(cycles[nextIndex] as number);
  };

  const handleSaveProfile = () => {
    setUserName(tempName);
    setUserEmail(tempEmail);
    setGroqApiKey(tempKey);
    setIsEditingProfile(false);
  };

  const handleEditProfile = () => {
    setTempName(userName);
    setTempEmail(userEmail);
    setTempKey(groqApiKey);
    setIsEditingProfile(true);
  };

  return (
    <Screen scrollable withMarginThread style={styles.container}>
      <View style={styles.headerRow}>
        <SectionHeader title="Profile" />
        {!isEditingProfile ? (
          <TouchableOpacity onPress={handleEditProfile} style={styles.editBtn}>
            <Feather name="edit-2" size={16} color={theme.colors.accent.primary} />
            <Text variant="label-sm" style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSaveProfile} style={styles.editBtn}>
            <Text variant="label-sm" style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      <Card style={styles.card}>
        {!isEditingProfile ? (
          <View style={styles.profileView}>
            <View style={styles.avatarCircle}>
              <Text variant="headline-lg" style={styles.avatarText}>
                {userName ? userName.charAt(0).toUpperCase() : "V"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text variant="headline-lg" style={styles.nameText}>
                {userName || "Guest User"}
              </Text>
              <Text variant="body-md" style={styles.emailText}>
                {userEmail || "No email set"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.editForm}>
            <Text variant="label-sm" style={styles.inputLabel}>NAME</Text>
            <TextInput
              style={styles.textInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Your Name"
              placeholderTextColor={theme.colors.text.muted}
            />
            
            <Text variant="label-sm" style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.textInput}
              value={tempEmail}
              onChangeText={setTempEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.text.muted}
            />
          </View>
        )}
      </Card>

      <SectionHeader title="Cloud Services" />
      <Card style={styles.card}>
        <Text variant="body-md" style={styles.descriptionText}>
          VAHA prioritizes local edge processing. However, if your UNO Q device is offline, we can use Groq to transcribe your recordings over the internet for free.
        </Text>
        
        {!isEditingProfile ? (
          <View style={styles.keyDisplayRow}>
             <Text variant="body-md" style={styles.label}>Groq API Key</Text>
             <Text variant="mono-bold" style={styles.value}>
               {groqApiKey ? "••••••••••••••••" : "Not configured"}
             </Text>
          </View>
        ) : (
          <View style={styles.editForm}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
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
          </View>
        )}
      </Card>

      <SectionHeader title="Preferences" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="body-md" style={styles.label}>
            Auto-Sync on Connect
          </Text>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{
              false: theme.colors.accent.border,
              true: theme.colors.text.primary,
            }}
          />
        </View>
        <SettingsItem
          label="Privacy Retention Timer"
          value={getRetentionText(retentionDays)}
          onPress={handleCycleRetention}
        />
      </Card>

      <SectionHeader title="About" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="body-md" style={styles.label}>
            App Version
          </Text>
          <Text variant="body-md" style={styles.value}>
            1.0.0 (Phase E)
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 4,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    marginBottom: 8,
  },
  editText: {
    color: theme.colors.accent.primary,
  },
  saveText: {
    color: theme.colors.text.primary,
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
  },
  label: {
    color: theme.colors.text.primary,
  },
  value: {
    color: theme.colors.text.muted,
  },
  profileView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${theme.colors.accent.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.accent.primary,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    marginBottom: 4,
  },
  emailText: {
    color: theme.colors.text.muted,
  },
  editForm: {
    gap: 8,
  },
  inputLabel: {
    color: theme.colors.text.muted,
    marginTop: 8,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.accent.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    fontSize: 16,
  },
  descriptionText: {
    color: theme.colors.text.muted,
    lineHeight: 20,
    marginBottom: 16,
  },
  keyDisplayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.accent.border,
    paddingTop: 16,
  }
});
