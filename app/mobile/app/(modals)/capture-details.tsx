import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCaptureDetailsData } from "../../src/features/captures/hooks/useCaptureDetailsData";
import {
  Screen,
  SectionHeader,
  Text,
  Button,
  Loading,
  EmptyState,
  theme,
  Tag,
  Divider
} from "../../src/design-system";

export default function CaptureDetailsModal() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { capture, tags, isLoading, error, handleDelete, handleUpdate } = useCaptureDetailsData(uuid ?? "");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTranscript, setEditTranscript] = useState("");
  const [editTags, setEditTags] = useState("");

  // Sync state with capture data when loaded
  useEffect(() => {
    if (capture) {
      setEditTitle(capture.title ?? "");
      setEditTranscript(capture.transcript ?? "");
      setEditTags(tags.join(", "));
    }
  }, [capture, tags]);

  if (isLoading) {
    return (
      <Screen withMarginThread style={styles.container}>
        <Loading />
      </Screen>
    );
  }

  if (error || !capture) {
    return (
      <Screen withMarginThread style={styles.container}>
        <EmptyState
          variant="captures"
          title="Capture Not Found"
          message={error ?? "This capture could not be loaded or has been deleted."}
        />
      </Screen>
    );
  }

  const title = capture.title ?? "Untitled Capture";
  const date = capture.createdAt.toLocaleString();
  const sourceLabel = capture.deviceId === null ? "MOBILE" : "DEVICE";

  const handleSave = async () => {
    const tagList = editTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    await handleUpdate({
      title: editTitle,
      transcript: editTranscript,
      tags: tagList
    });
    setIsEditing(false);
  };

  return (
    <Screen withMarginThread style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {isEditing ? (
          <View style={styles.editSection}>
            <Text variant="mono-bold" style={styles.label}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              placeholderTextColor={theme.colors.text.muted}
            />

            <Text variant="mono-bold" style={styles.label}>Transcript</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={editTranscript}
              onChangeText={setEditTranscript}
              multiline
              numberOfLines={8}
              placeholder="Transcript text..."
              placeholderTextColor={theme.colors.text.muted}
            />

            <Text variant="mono-bold" style={styles.label}>Tags (Comma separated)</Text>
            <TextInput
              style={styles.textInput}
              value={editTags}
              onChangeText={setEditTags}
              placeholder="e.g. personal, ideas, work"
              placeholderTextColor={theme.colors.text.muted}
            />

            <View style={styles.editActions}>
              <Button variant="primary" onPress={handleSave}>
                Save Changes
              </Button>
              <Button variant="ghost" onPress={() => setIsEditing(false)}>
                Cancel
              </Button>
            </View>
          </View>
        ) : (
          <>
            <SectionHeader title={title} />
            
            <View style={styles.metaRow}>
              <Text variant="meta-sm" style={styles.dateText}>
                {date}
              </Text>
              <Tag label={sourceLabel} variant={sourceLabel === "MOBILE" ? "neutral" : "info"} />
            </View>

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map(tag => (
                  <View key={tag} style={styles.tagItem}>
                    <Tag label={tag} variant="neutral" />
                  </View>
                ))}
              </View>
            )}

            <Divider style={styles.divider} />

            {capture.summary && (
              <View style={styles.section}>
                <Text variant="headline-lg" style={styles.sectionTitle}>Summary</Text>
                <Text variant="body-md" style={styles.transcript}>{capture.summary}</Text>
              </View>
            )}

            {capture.transcript ? (
              <View style={styles.section}>
                <Text variant="headline-lg" style={styles.sectionTitle}>Transcript</Text>
                <Text variant="body-md" style={styles.transcript}>{capture.transcript}</Text>
              </View>
            ) : (
              <View style={styles.section}>
                <Text variant="body-md" style={styles.transcript}>No transcript available.</Text>
              </View>
            )}

            <View style={styles.actions}>
              <Button variant="primary" onPress={() => setIsEditing(true)} style={styles.actionBtn}>
                Edit Capture
              </Button>
              <Button variant="outline" onPress={handleDelete} accessibilityLabel="Delete capture" style={styles.actionBtn}>
                Delete Capture
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  scrollContent: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateText: {
    opacity: 0.7,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tagItem: {
    marginRight: 4,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  transcript: {
    lineHeight: 24,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  actionBtn: {
    width: "100%",
  },
  editSection: {
    gap: 16,
  },
  label: {
    color: theme.colors.text.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    fontSize: 16,
  },
  textArea: {
    height: 160,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  }
});
