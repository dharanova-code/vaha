import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, View, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Container } from "../../src/core/di/Container";
import { AudioRecordingService } from "../../src/features/captures/services/AudioRecordingService";
import { DeviceClient } from "../../src/features/devices/client/DeviceClient";
import { useCaptureStore } from "../../src/features/devices/stores/captureStore";
import * as FS from "expo-file-system";
import { appConfig } from "../../src/core/config/AppConfig";
import {
  Screen,
  Text,
  Card,
  Button,
  theme,
  Icon,
  Input,
  TopBar
} from "../../src/design-system";

const FileSystem = FS as any;

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
      const localWavPath = `${FileSystem.documentDirectory}vaha/audio/${uuid}.wav`;
      
      try {
        const { TranscriptionService } = require("../../src/features/captures/services/TranscriptionService");
        const transcriptionService = Container.getInstance().resolve<any>("TranscriptionService");
        
        const uploadResult = await transcriptionService.transcribe(localWavPath);
        
        // PRIVACY FIRST: Delete local audio file immediately after transcribing
        try {
          await FileSystem.deleteAsync(localWavPath, { idempotent: true });
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
      <TopBar 
        title="New Capture"
        leftAction={(
          <Button variant="ghost" onPress={() => router.back()} style={styles.navBtn}>
            <Text variant="label-sm">Cancel</Text>
          </Button>
        )}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Text variant="mono-bold" style={styles.label}>Title (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Morning thoughts"
            placeholderTextColor={theme.colors.text.muted}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="mono-bold" style={styles.label}>Transcript</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={transcript}
            onChangeText={setTranscript}
            multiline
            numberOfLines={6}
            placeholder="Type your thought here, or tap the microphone below to dictate..."
            placeholderTextColor={theme.colors.text.muted}
          />
          {isTranscribing && (
            <View style={styles.transcribingOverlay}>
              <ActivityIndicator color={theme.colors.accent.primary} />
              <Text variant="meta-sm" style={styles.transcribingText}>Transcribing offline...</Text>
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <Text variant="mono-bold" style={styles.label}>Tags (Comma separated)</Text>
          <TextInput
            style={styles.textInput}
            value={tagsInput}
            onChangeText={setTagsInput}
            placeholder="e.g. work, ideas, personal"
            placeholderTextColor={theme.colors.text.muted}
          />
        </Card>

        <View style={styles.voiceSection}>
          {isRecording ? (
            <View style={styles.recordingState}>
              <Text variant="mono-bold" style={styles.timer}>{timerText}</Text>
              <Button variant="danger" onPress={handleStopRecording}>
                Stop Recording
              </Button>
            </View>
          ) : (
            <Button variant="primary" onPress={handleStartRecording} style={styles.micBtn}>
              <Icon name="mic" color="#FFF" />
              <Text variant="mono-bold" style={styles.micBtnText}>Dictate Thought</Text>
            </Button>
          )}
        </View>

        <View style={styles.actionContainer}>
          <Button variant="outline" onPress={handleSave} style={styles.saveBtn}>
            Save Capture
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 64,
  },
  card: {
    padding: 16,
    marginBottom: 20,
  },
  label: {
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    fontFamily: "System",
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  transcribingOverlay: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  transcribingText: {
    color: theme.colors.accent.primary,
  },
  voiceSection: {
    alignItems: "center",
    marginVertical: 12,
  },
  recordingState: {
    alignItems: "center",
    gap: 12,
  },
  timer: {
    fontSize: 24,
    color: theme.colors.semantic.error,
  },
  micBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  micBtnText: {
    color: "#FFF",
  },
  actionContainer: {
    marginTop: 12,
  },
  saveBtn: {
    width: "100%",
  },
  navBtn: {
    paddingHorizontal: 8,
  }
});
