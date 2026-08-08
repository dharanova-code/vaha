import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getStorageService } from "../src/infrastructure/storage/KeyValueStorage";
import { Audio } from "expo-av";
import {
  Screen,
  Text,
  Card,
  Button,
  theme,
  Icon,
  Divider,
  OnboardingHeader,
  Dialog
} from "../src/design-system";
import { STORAGE_KEYS } from "../src/core/constants";
import { appConfig } from "../src/core/config/AppConfig";

const STEPS = [
  "Welcome",
  "Privacy",
  "How it Works",
  "Permissions",
  "Mode Selection",
  "Mock Device",
  "All Set"
];

export default function OnboardingScreen() {
  const router = useRouter();
  const mmkv = getStorageService();

  // State
  const [step, setStep] = useState(0);
  const [captureMode, setCaptureMode] = useState<"mobile" | "uno_q">("mobile");
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  
  // Permissions State
  const [micStatus, setMicStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  const [notifStatus, setNotifStatus] = useState<"prompt" | "granted" | "denied">("prompt");

  // Load initial selection if any
  useEffect(() => {
    const savedMode = mmkv.getString("vaha:capture_mode");
    if (savedMode === "mobile" || savedMode === "uno_q") {
      setCaptureMode(savedMode);
    }
  }, []);

  // Automatic mock device transition in development
  useEffect(() => {
    if (step === 5) {
      if (appConfig.useMockDevice && captureMode === "uno_q") {
        const timer = setTimeout(() => {
          setStep(6);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        // If not using mock device, or selected mobile-only, skip mock setup
        setStep(6);
      }
    }
    return;
  }, [step, captureMode]);

  const requestMicPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setMicStatus(status === "granted" ? "granted" : "denied");
    } catch (e) {
      setMicStatus("denied");
    }
  };

  const requestNotifPermission = async () => {
    let isExpoGo = false;
    try {
      const Constants = require("expo-constants").default || require("expo-constants");
      isExpoGo = Constants.executionEnvironment === "store-client" || Constants.appOwnership === "expo";
    } catch (e) {
      // ignore
    }

    if (isExpoGo) {
      setNotifStatus("denied");
      return;
    }

    try {
      const Notifications = require("expo-notifications");
      const { status } = await Notifications.requestPermissionsAsync();
      setNotifStatus(status === "granted" ? "granted" : "denied");
    } catch (e) {
      setNotifStatus("denied");
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      // Step checks
      if (step === 3 && micStatus === "prompt") {
        setShowPermissionDialog(true);
        return;
      }
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    mmkv.set(STORAGE_KEYS.IS_ONBOARDED, "true");
    mmkv.set("vaha:capture_mode", captureMode);
    router.replace("/(tabs)/home");
  };

  const selectMode = (mode: "mobile" | "uno_q") => {
    setCaptureMode(mode);
    mmkv.set("vaha:capture_mode", mode);
  };

  const progressPercentage = (step / (STEPS.length - 1)) * 100;

  return (
    <Screen style={styles.container}>
      <OnboardingHeader
        title={STEPS[step]}
        leftAction={step > 0 ? (
          <Button variant="ghost" onPress={handleBack} style={styles.navBtn}>
            <Icon name="chevron-left" />
          </Button>
        ) : undefined}
        rightAction={step < STEPS.length - 1 ? (
          <Button variant="ghost" onPress={handleFinish} style={styles.navBtn}>
            <Text variant="label-sm">Skip</Text>
          </Button>
        ) : undefined}
      />

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 0 && (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Icon name="mic" size={64} color={theme.colors.accent.primary} />
            </View>
            <Text variant="display-lg" style={styles.title}>Welcome to VAHA</Text>
            <Text variant="body-md" style={styles.subtitle}>
              Your context-aware offline-first voice journal. Capture your thoughts silently, securely, and without any cloud dependencies.
            </Text>
            <Card style={styles.card}>
              <Text variant="label-sm" style={styles.featureTitle}>✓ Capture Thoughts Instantly</Text>
              <Text variant="body-md" style={styles.featureDesc}>Speak your mind, and let VAHA transcribe it accurately in real-time.</Text>
              <Divider style={styles.divider} />
              <Text variant="label-sm" style={styles.featureTitle}>✓ Privacy-First Design</Text>
              <Text variant="body-md" style={styles.featureDesc}>Your data remains entirely yours. Offline transcription processing keeps your audio secret.</Text>
            </Card>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Icon name="shield" size={64} color={theme.colors.semantic.success} />
            </View>
            <Text variant="display-lg" style={styles.title}>Absolute Privacy</Text>
            <Text variant="body-md" style={styles.subtitle}>
              VAHA is engineered around the principle of absolute privacy.
            </Text>
            <Card style={styles.card}>
              <View style={styles.bulletRow}>
                <Icon name="check-circle" size={20} color={theme.colors.semantic.success} />
                <Text variant="body-md" style={styles.bulletText}>Transcripts are saved only on your local device.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Icon name="check-circle" size={20} color={theme.colors.semantic.success} />
                <Text variant="body-md" style={styles.bulletText}>All temporary voice audio is deleted immediately after transcription.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Icon name="check-circle" size={20} color={theme.colors.semantic.success} />
                <Text variant="body-md" style={styles.bulletText}>Optional Notion database synchronization: you retain complete control over credentials.</Text>
              </View>
            </Card>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Icon name="activity" size={64} color={theme.colors.accent.primary} />
            </View>
            <Text variant="display-lg" style={styles.title}>How VAHA Works</Text>
            <Text variant="body-md" style={styles.subtitle}>
              Voice processing flows seamlessly through local stages.
            </Text>
            
            <Card style={styles.flowCard}>
              <View style={styles.flowStep}>
                <View style={styles.flowBadge}><Text variant="mono-bold" style={styles.flowBadgeText}>1</Text></View>
                <Text variant="body-md" style={styles.flowText}>Speak your thought into the microphone.</Text>
              </View>
              <View style={styles.flowLine} />
              <View style={styles.flowStep}>
                <View style={styles.flowBadge}><Text variant="mono-bold" style={styles.flowBadgeText}>2</Text></View>
                <Text variant="body-md" style={styles.flowText}>Offline AI transcribes audio on the device.</Text>
              </View>
              <View style={styles.flowLine} />
              <View style={styles.flowStep}>
                <View style={styles.flowBadge}><Text variant="mono-bold" style={styles.flowBadgeText}>3</Text></View>
                <Text variant="body-md" style={styles.flowText}>Stored securely in your local repository.</Text>
              </View>
              <View style={styles.flowLine} />
              <View style={styles.flowStep}>
                <View style={styles.flowBadge}><Text variant="mono-bold" style={styles.flowBadgeText}>4</Text></View>
                <Text variant="body-md" style={styles.flowText}>Optionally synced to your custom Notion integration.</Text>
              </View>
            </Card>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Icon name="key" size={64} color={theme.colors.text.primary} />
            </View>
            <Text variant="display-lg" style={styles.title}>System Permissions</Text>
            <Text variant="body-md" style={styles.subtitle}>
              VAHA requires permissions to perform captures and sync with your local network.
            </Text>

            <Card style={styles.card}>
              <View style={styles.permissionRow}>
                <View style={styles.permissionInfo}>
                  <Text variant="mono-bold">Microphone Access</Text>
                  <Text variant="meta-sm" style={styles.mutedText}>Required to capture and record thoughts.</Text>
                </View>
                <Button 
                  variant={micStatus === "granted" ? "secondary" : "primary"}
                  onPress={requestMicPermission}
                  disabled={micStatus === "granted"}
                >
                  {micStatus === "granted" ? "Granted" : "Allow"}
                </Button>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.permissionRow}>
                <View style={styles.permissionInfo}>
                  <Text variant="mono-bold">Notifications</Text>
                  <Text variant="meta-sm" style={styles.mutedText}>Alerts for sync completion and battery warnings.</Text>
                </View>
                <Button 
                  variant={notifStatus === "granted" ? "secondary" : "primary"}
                  onPress={requestNotifPermission}
                  disabled={notifStatus === "granted"}
                >
                  {notifStatus === "granted" ? "Granted" : "Allow"}
                </Button>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.permissionRow}>
                <View style={styles.permissionInfo}>
                  <Text variant="mono-bold">Local Network</Text>
                  <Text variant="meta-sm" style={styles.mutedText}>Required to automatically detect the Uno Q device.</Text>
                </View>
                <Text variant="meta-sm" style={styles.grantedText}>Auto-requested by OS</Text>
              </View>
            </Card>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Icon name="cpu" size={64} color={theme.colors.accent.primary} />
            </View>
            <Text variant="display-lg" style={styles.title}>Select Capture Mode</Text>
            <Text variant="body-md" style={styles.subtitle}>
              Choose how you want to record and save thoughts.
            </Text>

            <Card 
              style={[styles.modeCard, captureMode === "mobile" && styles.selectedModeCard]}
              onPress={() => selectMode("mobile")}
            >
              <View style={styles.modeRow}>
                <Icon name="phone" size={32} color={captureMode === "mobile" ? theme.colors.accent.primary : theme.colors.text.muted} />
                <View style={styles.modeText}>
                  <Text variant="mono-bold">Option A: Mobile Only</Text>
                  <Text variant="meta-sm" style={styles.mutedText}>Manual recording and transcription handled directly inside this app.</Text>
                </View>
              </View>
            </Card>

            <Card 
              style={[styles.modeCard, captureMode === "uno_q" && styles.selectedModeCard]}
              onPress={() => selectMode("uno_q")}
            >
              <View style={styles.modeRow}>
                <Icon name="cpu" size={32} color={captureMode === "uno_q" ? theme.colors.accent.primary : theme.colors.text.muted} />
                <View style={styles.modeText}>
                  <Text variant="mono-bold">Option B: Mobile + Uno Q</Text>
                  <Text variant="meta-sm" style={styles.mutedText}>Record thoughts using the hands-free VAHA Uno Q edge hardware device. Automatically syncs captures to your phone.</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {step === 5 && (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Icon name="refresh-cw" size={64} color={theme.colors.semantic.info} />
            </View>
            <Text variant="display-lg" style={styles.title}>Connecting Uno Q...</Text>
            <Text variant="body-md" style={styles.subtitle}>
              Searching local network for VAHA edge server.
            </Text>
            
            <Card style={styles.connectionCard}>
              <Icon name="check-circle" size={48} color={theme.colors.semantic.success} />
              <Text variant="mono-bold" style={styles.connStatus}>Mock Device Connected</Text>
              <Text variant="meta-sm" style={styles.connDesc}>
                Simulated Uno Q device found at IP 192.168.1.150. Initiating sync loop.
              </Text>
            </Card>
          </View>
        )}

        {step === 6 && (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Icon name="award" size={64} color={theme.colors.semantic.success} />
            </View>
            <Text variant="display-lg" style={styles.title}>All Set!</Text>
            <Text variant="body-md" style={styles.subtitle}>
              Your VAHA workspace is fully initialized.
            </Text>
            
            <Card style={styles.card}>
              <Text variant="body-md" style={styles.readyText}>
                Press the finish button to access your captures log. You can change your capture mode or settings anytime from the Settings tab.
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          variant="primary" 
          onPress={handleNext}
          style={styles.actionBtn}
        >
          {step === STEPS.length - 1 ? "Finish" : "Continue"}
        </Button>
      </View>

      <Dialog
        visible={showPermissionDialog}
        title="Permissions Recommended"
        message="We recommend enabling microphone access for local voice capture. You can skip if you want."
        confirmText="Enable Mic"
        cancelText="Skip for Now"
        onConfirm={() => {
          setShowPermissionDialog(false);
          requestMicPermission();
        }}
        onCancel={() => {
          setShowPermissionDialog(false);
          setStep(step + 1);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.background.secondary,
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.accent.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
  },
  stepContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: theme.colors.text.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  card: {
    width: "100%",
    padding: 20,
  },
  featureTitle: {
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  featureDesc: {
    color: theme.colors.text.muted,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  bulletText: {
    color: theme.colors.text.primary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  flowCard: {
    width: "100%",
    padding: 20,
  },
  flowStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  flowBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  flowBadgeText: {
    color: "#FFFFFF",
  },
  flowText: {
    color: theme.colors.text.primary,
    marginLeft: 16,
    flex: 1,
  },
  flowLine: {
    height: 20,
    width: 2,
    backgroundColor: theme.colors.accent.border,
    marginLeft: 13,
    marginVertical: 4,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  permissionInfo: {
    flex: 1,
    marginRight: 16,
  },
  mutedText: {
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  grantedText: {
    color: theme.colors.semantic.success,
    fontSize: 14,
    fontWeight: "600",
  },
  modeCard: {
    width: "100%",
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedModeCard: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: theme.colors.background.secondary,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeText: {
    flex: 1,
    marginLeft: 16,
  },
  connectionCard: {
    width: "100%",
    padding: 24,
    alignItems: "center",
  },
  connStatus: {
    color: theme.colors.semantic.success,
    marginVertical: 12,
  },
  connDesc: {
    color: theme.colors.text.muted,
    textAlign: "center",
    lineHeight: 18,
  },
  readyText: {
    color: theme.colors.text.primary,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: theme.colors.background.primary,
  },
  actionBtn: {
    width: "100%",
  },
  navBtn: {
    paddingHorizontal: 8,
  }
});
