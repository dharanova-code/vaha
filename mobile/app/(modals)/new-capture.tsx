import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, View, ScrollView, TextInput, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Container } from "../../src/core/di/Container";
import { AudioRecordingService } from "../../src/features/captures/services/AudioRecordingService";
import { useCaptureStore } from "../../src/features/devices/stores/captureStore";
import { deleteAsync, documentDirectory } from "expo-file-system/legacy";
import {
  Screen,
  Text,
  Card,
  Button,
  theme,
  Avatar,
} from "../../src/design-system";
import { Feather } from "@expo/vector-icons";

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
      Alert.alert("Permission Denied", "Microphone access is required to capture voice.");
      return;
    }

    const result = await audioService.startRecording();
    if (result.isSuccess) {
      setIsRecording(true);
      startTimer();
    } else {
      Alert.alert("Error", "Could not start audio recording.");
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
        } else {
          Alert.alert("Transcription Failed", "Could not transcribe audio. You can still type your capture manually.");
        }
      } catch (e) {
        Alert.alert("Error", "An error occurred during transcription.");
      }
    } else {
      Alert.alert("Error", "Failed to retrieve audio recording.");
    }
    setIsTranscribing(false);
  };

  const handleSave = async () => {
    if (!transcript.trim()) {
      Alert.alert("Empty Capture", "Please record some speech or write a transcript before saving.");
      return;
    }

    const tagList = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    await createLocalCapture(title, transcript, tagList);
    router.back();
  };

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

        {/* Dictation & Recording Controller */}
        <View style={styles.voiceSection}>
          {isRecording ? (
            <View style={styles.recordingState}>
              <View style={styles.pulseContainer}>
                <Text variant="mono-bold" style={styles.timer}>{timerText}</Text>
                <Text variant="meta-sm" style={styles.recordingLabel}>Listening to your voice...</Text>
              </View>
              <Button variant="danger" onPress={handleStopRecording} style={styles.recordingBtn}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather name="square" size={16} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: "#FFF", fontWeight: "700" }}>Stop Recording</Text>
                </View>
              </Button>
            </View>
          ) : (
            <Button variant="primary" onPress={handleStartRecording} style={styles.micBtn}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="mic" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={{ color: "#FFF", fontWeight: "700" }}>Dictate Note</Text>
              </View>
            </Button>
          )}
        </View>

        {/* Action Button */}
        <Button variant="outline" onPress={handleSave} style={styles.saveBtn}>
          Save Note
        </Button>
      </ScrollView>
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
  recordingState: {
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  pulseContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  timer: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.semantic.error,
    letterSpacing: 1,
  },
  recordingLabel: {
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  recordingBtn: {
    width: "100%",
    maxWidth: 260,
    height: 48,
    borderRadius: 24,
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
});
