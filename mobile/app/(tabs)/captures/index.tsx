import React, { useEffect, useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl, View, ScrollView, TouchableOpacity } from "react-native";
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
  Tag,
} from "../../../src/design-system";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCapturesData, FilterType } from "../../../src/features/captures/hooks/useCapturesData";
import type { CaptureWithTags } from "../../../src/features/devices/stores/captureStore";

export default function CapturesScreen() {
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom > 0 ? insets.bottom : 16;

  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(1);
  const [layoutHeight, setLayoutHeight] = React.useState(1);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const maxScroll = contentHeight - layoutHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(Math.max(offsetY / maxScroll, 0), 1));
    }
  }, [contentHeight, layoutHeight]);

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
  } = useCapturesData();

  // Load captures on mount
  useEffect(() => {
    onRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: CaptureWithTags }) => {
      return (
        <CaptureCard
          key={item.uuid}
          title={item.title ?? item.transcript?.substring(0, 45) ?? "Voice Note"}
          excerpt={item.transcript ?? "No text recorded."}
          timestamp={item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today"}
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
      {/* Spacious Screen Title & Sort Action */}
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>My Notes ({totalCount})</Text>
        <TouchableOpacity
          onPress={() => {
            if (sortOrder === "newest") setSortOrder("oldest");
            else if (sortOrder === "oldest") setSortOrder("alphabetical");
            else setSortOrder("newest");
          }}
          style={styles.headerSortButton}
        >
          <Feather name="arrow-down" size={14} color={theme.colors.accent.primary} style={{ marginRight: 4 }} />
          <Text style={styles.sortButtonText}>
            {sortOrder === "newest" ? "Newest" : sortOrder === "oldest" ? "Oldest" : "A-Z"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Toolbar (Takes full width of row) */}
      <View style={styles.toolbar}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={onClearSearch}
            placeholder="Search voice notes..."
            accessibilityLabel="Search notes"
          />
        </View>
      </View>

      {/* Spacious Filter Chips Row */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {(["all", "mobile", "uno_q", "synced", "unsynced"] as FilterType[]).map((f) => {
            const labelMap: Record<string, string> = {
              all: "All Notes",
              mobile: "Phone Memos",
              uno_q: "Vaha Device",
              synced: "Saved",
              unsynced: "Pending",
            };
            const isSelected = filter === f;
            return (
              <Button
                key={f}
                variant={isSelected ? "primary" : "ghost"}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  isSelected ? styles.filterChipActive : styles.filterChipInactive,
                ]}
              >
                <Text
                  variant="label-sm"
                  style={{
                    color: isSelected ? "#FFF" : theme.colors.text.muted,
                    fontWeight: isSelected ? "700" : "500",
                  }}
                >
                  {labelMap[f] ?? f.toUpperCase()}
                </Text>
              </Button>
            );
          })}
        </ScrollView>
      </View>

      {/* Loading State */}
      {isLoading && <Loading />}

      {/* Empty Library State */}
      {!isLoading && isEmpty && (
        <View style={styles.emptyContainer}>
          <EmptyState
            variant="captures"
            title="No voice notes yet"
            message="Speak to your Vaha device or tap Record Note to add your first note."
          />
        </View>
      )}

      {/* Empty Search Results State */}
      {!isLoading && isEmptySearch && (
        <View style={styles.emptyContainer}>
          <EmptyState
            variant="search"
            title="No notes found"
            message={`Nothing matched "${query}". Try searching for another keyword.`}
          />
        </View>
      )}

      {/* Uncluttered Spacious Capture List */}
      {!isLoading && !isEmpty && (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <FlatList<CaptureWithTags>
            data={captures}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onContentSizeChange={(_, height) => setContentHeight(height)}
            onLayout={(event) => setLayoutHeight(event.nativeEvent.layout.height)}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={isSyncing}
                onRefresh={onRefresh}
                tintColor={theme.colors.accent.primary}
              />
            }
            ListFooterComponent={<View style={styles.footer} />}
            style={{ flex: 1 }}
          />

          {/* Custom Scroll Progress Sidebar Indicator */}
          {contentHeight > layoutHeight && (
            <View style={styles.scrollTrack}>
              <View
                style={[
                  styles.scrollIndicator,
                  {
                    top: scrollProgress * (layoutHeight - 80),
                  },
                ]}
              />
            </View>
          )}
        </View>
      )}

      {/* Floating Record Action Button */}
      <View style={[styles.fabContainer, { bottom: bottomOffset + 6 }]}>
        <Button
          variant="primary"
          onPress={() => router.push("/(modals)/new-capture" as any)}
          accessibilityLabel="Record new note"
          style={styles.fabButton}
        >
          <View style={styles.fabInner}>
            <Feather name="mic" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.fabText}>Record Note</Text>
          </View>
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.layout.mobileMargin,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  headerSortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: `${theme.colors.accent.primary}15`,
  },
  sortButtonText: {
    color: theme.colors.accent.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  toolbar: {
    marginBottom: 16,
    paddingHorizontal: theme.layout.mobileMargin,
  },
  searchWrapper: {
    width: "100%",
  },
  sortButton: {
    minWidth: 86,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
  },
  filtersWrapper: {
    marginBottom: 20,
    height: 38,
  },
  filtersContent: {
    paddingHorizontal: theme.layout.mobileMargin,
    gap: 10,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 16,
    height: 36,
    justifyContent: "center",
    borderRadius: 18,
  },
  filterChipActive: {
    backgroundColor: theme.colors.accent.primary,
  },
  filterChipInactive: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
  },
  list: {
    paddingHorizontal: theme.layout.mobileMargin,
    paddingBottom: 120,
  },
  emptyContainer: {
    paddingHorizontal: theme.layout.mobileMargin,
    marginTop: 32,
  },
  footer: {
    height: 100,
  },
  fabContainer: {
    position: "absolute",
    left: theme.layout.mobileMargin,
    right: theme.layout.mobileMargin,
    alignItems: "center",
  },
  fabButton: {
    width: "100%",
    maxWidth: 340,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  fabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  scrollTrack: {
    position: "absolute",
    right: 4,
    top: 10,
    bottom: 90, // End above floating FAB
    width: 2,
    backgroundColor: `${theme.colors.accent.border}60`,
    borderRadius: 1,
  },
  scrollIndicator: {
    position: "absolute",
    width: 6,
    height: 40,
    backgroundColor: theme.colors.accent.primary,
    borderRadius: 3,
    left: -2, // Center on 2px track
  },
});
