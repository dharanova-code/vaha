import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, View, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Container } from "../../src/core/di/Container";
import { AudioRecordingService } from "../../src/features/captures/services/AudioRecordingService";
import { useCaptureStore } from "../../src/features/devices/stores/captureStore";
import { deleteAsync, documentDirectory } from "expo-file-system/legacy";
import { useSettingsStore } from "../../src/features/settings/stores/settingsStore";
import {
  Screen,
  Text,
  Card,
  Button,
  theme,
  Dialog,
} from "../../src/design-system";
import { Feather } from "@expo/vector-icons";

// ── AI Helper to Auto-Suggest Title using Groq ───────────────────────────────
async function suggestTitleUsingGroq(transcript: string, apiKey: string): Promise<string> {
  if (!apiKey || !transcript.trim()) return "";
  try {
    console.log("[GROQ] Generating title suggestion for transcript length:", transcript.length);
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a creative helper. Suggest a short, relevant 2-4 word title for a user's voice note. Do not repeat the prompt. Output ONLY the title itself, with no quote marks, no bullet points, and no intro text."
          },
          {
            role: "user",
            content: `Transcript: ${transcript}`
          }
        ],
        temperature: 0.7,
        max_tokens: 15,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      let title = data.choices[0]?.message?.content?.trim() || "";
      // Strip quotation marks if added
      title = title.replace(/^["']|["']$/g, '');
      console.log("[GROQ] Successfully generated title:", title);
      return title;
    } else {
      const errText = await response.text();
      console.warn("[GROQ] Title generation API error:", response.status, errText);
    }
  } catch (e) {
    console.warn("Failed to generate title using Groq:", e);
  }
  return "";
}

export default function NewCaptureModal() {
  const router = useRouter();
  const { createLocalCapture } = useCaptureStore();

  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const recordSecs = useRef(0);
  const [timerText, setTimerText] = useState("00:00");
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const startTimer = () => {
    recordSecs.current = 0;
    setTimerText("00:00");
    timerInterval.current = setInterval(() => {
      recordSecs.current += 1;
      const mins = Math.floor(recordSecs.current / 60).toString().padStart(2, "0");
      const secs = (recordSecs.current % 60).toString().padStart(2, "0");
      setTimerText(`${mins}:${secs}`);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const handleStartRecording = async () => {
    const audioService = Container.getInstance().resolve<AudioRecordingService>("AudioRecordingService");
    const hasPermission = await audioService.requestPermissions();
    if (!hasPermission) {
      showCustomAlert("Permission Denied", "Microphone access is required to capture voice.");
      return;
    }

    const result = await audioService.startRecording();
    if (result.isSuccess) {
      setIsRecording(true);
      startTimer();
    } else {
      showCustomAlert("Error", "Could not start audio recording.");
    }
  };

  const handleStopRecording = async () => {
    stopTimer();
    setIsRecording(false);
    setIsTranscribing(true);

    const audioService = Container.getInstance().resolve<AudioRecordingService>("AudioRecordingService");
    const stopResult = await audioService.stopRecording();
    
    if (stopResult.isSuccess) {
      const uuid = stopResult.getValueOrThrow();
      const localWavPath = `${documentDirectory}vaha/audio/${uuid}.wav`;
      
      try {
        const transcriptionService = Container.getInstance().resolve<any>("TranscriptionService");
        const uploadResult = await transcriptionService.transcribe(localWavPath);
        
        try {
          await deleteAsync(localWavPath, { idempotent: true });
        } catch (e) {
          // ignore cleanup failures
        }

        if (uploadResult.isSuccess) {
          const text = uploadResult.getValueOrThrow();
          setTranscript(prev => prev ? prev + "\n" + text : text);

          // Auto-suggest Title using Groq!
          const groqKey = useSettingsStore.getState().groqApiKey;
          if (groqKey && text.trim()) {
            const suggested = await suggestTitleUsingGroq(text, groqKey);
            if (suggested) {
              setTitle(suggested);
            }
          }
        } else {
          showCustomAlert("Transcription Failed", "Could not transcribe audio. You can still type your note manually.");
        }
      } catch (e) {
        showCustomAlert("Error", "An error occurred during transcription.");
      }
    } else {
      showCustomAlert("Error", "Failed to retrieve audio recording.");
    }
    setIsTranscribing(false);
  };

  const handleSave = async () => {
    if (!transcript.trim()) {
      showCustomAlert("Empty Capture", "Please record some speech or write a transcript before saving.");
      return;
    }

    const tagList = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    await createLocalCapture(title, transcript, tagList);
    router.back();
  };

  // CONDITIONAL RENDER: Dedicated Full Screen Recording Mode
  if (isRecording) {
    return (
      <Screen style={styles.container}>
        <View style={styles.recordingContainer}>
          <Text style={styles.recordingHeader}>Voice Note Recording</Text>
          
          <View style={styles.pulseWrapper}>
            <View style={styles.micCircle}>
              <Feather name="mic" size={44} color={theme.colors.semantic.error} />
            </View>
          </View>

          <View style={styles.timerWrapper}>
            <Text style={styles.largeTimer}>{timerText}</Text>
            <Text style={styles.listeningSubtitle}>Listening to your voice... Speak clearly.</Text>
          </View>

          <View style={styles.recordingActions}>
            <Button variant="danger" onPress={handleStopRecording} style={[styles.recordingBtnLarge, { backgroundColor: theme.colors.semantic.error }]}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Feather name="square" size={16} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>Stop Recording</Text>
              </View>
            </Button>
          </View>
        </View>
      </Screen>
    );
  }

  // Standard Post-Recording Form UI
  return (
    <Screen style={styles.container}>
      {/* Premium Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>New Voice Note</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveHeaderBtn}>
          <Text style={styles.saveHeaderText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Single Integrated Input Form Card */}
        <Card style={styles.inputCard}>
          <Text variant="label-sm" style={styles.inputLabel}>TITLE (OPTIONAL)</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Ideas for Vaha"
            placeholderTextColor={theme.colors.text.muted}
          />

          <View style={{ height: 16 }} />

          <Text variant="label-sm" style={styles.inputLabel}>TRANSCRIPT / TEXT</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={transcript}
              onChangeText={setTranscript}
              multiline
              placeholder="Start typing your thought here, or tap dictate below..."
              placeholderTextColor={theme.colors.text.muted}
            />
            {isTranscribing && (
              <View style={styles.transcribingOverlay}>
                <ActivityIndicator color={theme.colors.accent.primary} size="small" />
                <Text variant="meta-sm" style={styles.transcribingText}>Transcribing audio...</Text>
              </View>
            )}
          </View>

          <View style={{ height: 16 }} />

          <Text variant="label-sm" style={styles.inputLabel}>TAGS (COMMA SEPARATED)</Text>
          <TextInput
            style={styles.textInput}
            value={tagsInput}
            onChangeText={setTagsInput}
            placeholder="e.g. work, ideas, reminder"
            placeholderTextColor={theme.colors.text.muted}
          />
        </Card>

        {/* Start Dictation Controls */}
        <View style={styles.voiceSection}>
          <Button variant="primary" onPress={handleStartRecording} style={styles.micBtn}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="mic" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={{ color: "#FFF", fontWeight: "700" }}>Dictate Note</Text>
            </View>
          </Button>
        </View>

        {/* Action Button */}
        <Button variant="outline" onPress={handleSave} style={styles.saveBtn}>
          Save Note
        </Button>
      </ScrollView>

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
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  topNav: {
    flexDirection: "row",
    height: 56,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.layout.mobileMargin,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.accent.border,
  },
  closeBtn: {
    padding: 8,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  saveHeaderBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  saveHeaderText: {
    color: theme.colors.accent.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  scrollContent: {
    padding: theme.layout.mobileMargin,
    paddingBottom: 48,
  },
  inputCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
  },
  inputLabel: {
    color: theme.colors.text.muted,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.accent.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    fontSize: 15,
  },
  textAreaContainer: {
    position: "relative",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.accent.border,
    borderRadius: 10,
    backgroundColor: theme.colors.background.primary,
    padding: 10,
  },
  textArea: {
    height: 130,
    textAlignVertical: "top",
    color: theme.colors.text.primary,
    fontSize: 15,
    padding: 4,
  },
  transcribingOverlay: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.accent.border,
    paddingTop: 8,
  },
  transcribingText: {
    color: theme.colors.accent.primary,
    fontSize: 12,
  },
  voiceSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  micBtn: {
    width: "100%",
    maxWidth: 260,
    height: 48,
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  saveBtn: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    marginTop: 8,
  },
  // Dedicated Recording Screen Styles
  recordingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.background.primary,
  },
  recordingHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text.muted,
    letterSpacing: 0.5,
  },
  pulseWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  micCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: `${theme.colors.semantic.error}15`,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: `${theme.colors.semantic.error}30`,
  },
  timerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  largeTimer: {
    fontSize: 56,
    fontWeight: "800",
    color: theme.colors.text.primary,
    letterSpacing: 2,
    lineHeight: 64, // Fix timer text clipping at top and bottom
    fontFamily: "System",
    textAlign: "center",
    paddingVertical: 8,
  },
  listeningSubtitle: {
    fontSize: 14,
    color: theme.colors.text.muted,
    textAlign: "center",
  },
  recordingActions: {
    width: "100%",
    alignItems: "center",
  },
  recordingBtnLarge: {
    width: "100%",
    maxWidth: 260,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    elevation: 4,
    shadowColor: theme.colors.semantic.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
