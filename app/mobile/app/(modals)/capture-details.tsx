import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCaptureDetailsData } from "../../src/features/captures/hooks/useCaptureDetailsData";
import {
  Screen,
  SectionHeader,
  Text,
  Button,
  Loading,
  EmptyState,
} from "../../src/design-system";

export default function CaptureDetailsModal() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { capture, isLoading, error, handleDelete } = useCaptureDetailsData(uuid ?? "");

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

  return (
    <Screen withMarginThread style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionHeader title={title} />
        
        <Text variant="meta-sm" style={styles.dateText}>
          {date}
        </Text>

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
          <Button variant="outline" onPress={handleDelete} accessibilityLabel="Delete capture">
            Delete Capture
          </Button>
        </View>
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
  },
  dateText: {
    marginBottom: 24,
    opacity: 0.7,
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
    alignItems: "flex-start",
  },
});
