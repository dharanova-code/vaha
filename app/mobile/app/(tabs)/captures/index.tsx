import React, { useEffect, useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl, View, ScrollView } from "react-native";
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
  theme,
  Tag
} from "../../../src/design-system";
import { useCapturesData, FilterType } from "../../../src/features/captures/hooks/useCapturesData";
import type { CaptureWithTags } from "../../../src/features/devices/stores/captureStore";

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
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    onRefresh,
    handleDelete,
  } = useCapturesData();

  // Load captures on mount once
  useEffect(() => {
    onRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: CaptureWithTags }) => {
      const sourceLabel = item.deviceId === null ? "MOBILE" : "DEVICE";
      return (
        <CaptureCard
          key={item.uuid}
          title={item.title ?? item.transcript?.substring(0, 40) ?? "Untitled Capture"}
          excerpt={item.transcript ?? "No transcript available."}
          timestamp={item.createdAt.toLocaleString()}
          onPress={() => {
            router.push({ pathname: "/(modals)/capture-details", params: { uuid: item.uuid } });
          }}
        />
      );
    },
    [],
  );

  const keyExtractor = useCallback((item: CaptureWithTags) => item.uuid, []);

  return (
    <Screen withMarginThread style={styles.container}>
      <SectionHeader title={`Library${totalCount > 0 ? ` (${totalCount})` : ""}`} />

      {/* Search + Sort toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={onClearSearch}
            placeholder="Search title, transcript, tags..."
            accessibilityLabel="Search captures"
          />
        </View>
        <Button
          variant="ghost"
          onPress={() => {
            if (sortOrder === "newest") setSortOrder("oldest");
            else if (sortOrder === "oldest") setSortOrder("alphabetical");
            else setSortOrder("newest");
          }}
          accessibilityLabel="Cycle sorting"
          style={styles.sortButton}
        >
          {sortOrder === "newest" ? "↓ Newest" : sortOrder === "oldest" ? "↑ Oldest" : "A-Z"}
        </Button>
      </View>

      {/* Filters Row */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {(["all", "mobile", "uno_q", "synced", "unsynced"] as FilterType[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "ghost"}
              onPress={() => setFilter(f)}
              style={styles.filterChip}
            >
              <Text variant="mono-bold" color={filter === f ? "#FFF" : theme.colors.text.muted}>
                {f.toUpperCase().replace("_", " ")}
              </Text>
            </Button>
          ))}
        </ScrollView>
      </View>

      {/* Loading state */}
      {isLoading && <Loading />}

      {/* Empty library state */}
      {!isLoading && isEmpty && (
        <EmptyState
          variant="captures"
          title="No captures yet"
          message="Connect to your device or create a manual capture to get started."
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

      {/* Capture list */}
      {!isLoading && !isEmpty && (
        <FlatList<CaptureWithTags>
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
          variant="primary"
          onPress={() => router.push("/(modals)/new-capture" as any)}
          accessibilityLabel="Create manual capture"
        >
          New Capture
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
    paddingHorizontal: 24,
  },
  searchWrapper: {
    flex: 1,
  },
  sortButton: {
    minWidth: 80,
  },
  filtersWrapper: {
    marginBottom: 16,
    height: 40,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 12,
    height: 32,
    justifyContent: "center",
    borderRadius: 16,
  },
  list: {
    paddingBottom: 48,
    paddingHorizontal: 24,
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
