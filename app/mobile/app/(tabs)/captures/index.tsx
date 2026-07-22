import React, { useEffect, useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl, View } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  SectionHeader,
  CaptureCard,
  SearchBar,
  EmptyState,
  Loading,
  Button,
  Text,
} from "../../../src/design-system";
import { useCapturesData } from "../../../src/features/captures/hooks/useCapturesData";
import { useAudioRecording } from "../../../src/features/captures/hooks/useAudioRecording";
import type { Capture } from "../../../src/infrastructure/database/schema/captures";
import { theme } from "../../../src/design-system";

export default function CapturesScreen() {
  const {
    captures,
    totalCount,
    isLoading,
    isSyncing,
    isEmpty,
    isEmptySearch,
    query,
    setQuery,
    onClearSearch,
    sortOrder,
    toggleSort,
    onRefresh,
    handleDelete,
  } = useCapturesData();

  const { isRecording, startRecording, stopRecording, error: recordingError } = useAudioRecording();

  // Load captures on mount once
  useEffect(() => {
    onRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Capture }) => (
      <CaptureCard
        key={item.uuid}
        title={item.title ?? item.transcript?.substring(0, 40) ?? "Untitled Capture"}
        excerpt={item.transcript ?? "No transcript available."}
        timestamp={item.createdAt.toLocaleString()}
        onPress={() => {
          router.push({ pathname: "/(modals)/capture-details", params: { uuid: item.uuid } });
        }}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Capture) => item.uuid, []);

  return (
    <Screen withMarginThread style={styles.container}>
      {/* Header */}
      <SectionHeader title={`Library${totalCount > 0 ? ` (${totalCount})` : ""}`} />

      {/* Search + Sort toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={onClearSearch}
            placeholder="Search captures..."
            accessibilityLabel="Search captures"
          />
        </View>
        <Button
          variant="ghost"
          onPress={toggleSort}
          accessibilityLabel={`Sort ${sortOrder === "newest" ? "oldest first" : "newest first"}`}
          style={styles.sortButton}
        >
          {sortOrder === "newest" ? "↓ Newest" : "↑ Oldest"}
        </Button>
      </View>

      {recordingError && (
        <Text variant="meta-sm" style={{ color: "red", marginBottom: 12 }}>
          {recordingError}
        </Text>
      )}

      {/* Loading state */}
      {isLoading && <Loading />}

      {/* Empty library state */}
      {!isLoading && isEmpty && (
        <EmptyState
          variant="captures"
          title="No captures yet"
          message="Connect to your device and sync to see your voice notes here."
        />
      )}

      {/* Empty search results state */}
      {!isLoading && isEmptySearch && (
        <EmptyState
          variant="search"
          title="No results"
          message={`Nothing matched "${query}". Try a different search term.`}
        />
      )}

      {/* Capture list — virtualized with FlatList */}
      {!isLoading && !isEmpty && (
        <FlatList<Capture>
          data={captures}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isSyncing}
              onRefresh={onRefresh}
              tintColor={theme.colors.accent.primary}
            />
          }
          ListFooterComponent={<View style={styles.footer} />}
        />
      )}

      <View style={styles.fabContainer}>
        <Button
          variant={isRecording ? "primary" : "secondary"}
          onPress={isRecording ? stopRecording : startRecording}
          accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? "Stop Recording" : "Record Voice Note"}
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  searchWrapper: {
    flex: 1,
  },
  sortButton: {
    minWidth: 80,
  },
  list: {
    paddingBottom: 48,
  },
  footer: {
    height: 80,
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  }
});
