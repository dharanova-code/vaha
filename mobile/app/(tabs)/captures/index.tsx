import React, { useEffect, useCallback, useState } from "react";
import { FlatList, StyleSheet, RefreshControl, View, ScrollView, TouchableOpacity, Animated, PanResponder, TextInput } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  CaptureCard,
  SearchBar,
  EmptyState,
  Loading,
  Button,
  Text,
  theme,
  Dialog,
} from "../../../src/design-system";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCapturesData, FilterType } from "../../../src/features/captures/hooks/useCapturesData";
import type { CaptureWithTags } from "../../../src/features/devices/stores/captureStore";
import { Container } from "../../../src/core/di/Container";
import { CaptureRepository } from "../../../src/features/captures/repositories/CaptureRepository";
import { useSettingsStore } from "../../../src/features/settings/stores/settingsStore";
import { useCaptureStore } from "../../../src/features/devices/stores/captureStore";

// ── Groq Title Generator Helper (Same as modals/new-capture.tsx) ────────────
async function suggestTitleUsingGroq(transcript: string, apiKey: string): Promise<string> {
  if (!apiKey || !transcript.trim()) return "";
  try {
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
            content: "You are a creative helper. Suggest a short, combined 2-4 word title for a merged set of voice notes. Output ONLY the title itself, with no quote marks and no intro text."
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
      title = title.replace(/^["']|["']$/g, '');
      return title;
    }
  } catch (e) {
    console.warn("Failed to generate title using Groq:", e);
  }
  return "";
}

export default function CapturesScreen() {
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom > 0 ? insets.bottom : 16;

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = React.useState(1);
  const [layoutHeight, setLayoutHeight] = React.useState(1);

  const flatListRef = React.useRef<any>(null);
  const contentHeightRef = React.useRef(1);
  const layoutHeightRef = React.useRef(1);
  const currentScrollOffsetRef = React.useRef(0);
  const scrollStartOffset = React.useRef(0);

  contentHeightRef.current = contentHeight;
  layoutHeightRef.current = layoutHeight;

  // ── Multi-Select States ───────────────────────────────────────────────────
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  const selectionModeActive = selectedUuids.length > 0;

  // Dialog Trigger States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [showMergeConfirm, setShowMergeConfirm] = useState(false);
  
  // Custom dialog notifications
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

  React.useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      currentScrollOffsetRef.current = value;
    });
    return () => scrollY.removeListener(id);
  }, [scrollY]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scrollStartOffset.current = currentScrollOffsetRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        const maxScroll = contentHeightRef.current - layoutHeightRef.current;
        const trackRange = layoutHeightRef.current - 140;
        if (maxScroll > 0 && trackRange > 0) {
          const deltaScroll = (gestureState.dy / trackRange) * maxScroll;
          const newScroll = Math.max(0, Math.min(scrollStartOffset.current + deltaScroll, maxScroll));
          flatListRef.current?.scrollToOffset({ offset: newScroll, animated: false });
        }
      },
    })
  ).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

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

  // Clear selections when searches or filter changes
  useEffect(() => {
    setSelectedUuids([]);
  }, [query, filter]);

  // ── Multi-Select Actions ──────────────────────────────────────────────────
  const handleToggleSelect = useCallback((uuid: string) => {
    setSelectedUuids(prev => {
      if (prev.includes(uuid)) {
        return prev.filter(id => id !== uuid);
      } else {
        return [...prev, uuid];
      }
    });
  }, []);

  const handleLongPress = useCallback((uuid: string) => {
    setSelectedUuids(prev => {
      if (prev.includes(uuid)) return prev;
      return [...prev, uuid];
    });
  }, []);

  const handleSelectAll = () => {
    if (selectedUuids.length === captures.length) {
      setSelectedUuids([]);
    } else {
      setSelectedUuids(captures.map(c => c.uuid));
    }
  };

  // Batch delete logic
  const handleBatchDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
      for (const uuid of selectedUuids) {
        const capResult = await repo.findByUuid(uuid);
        if (capResult.isSuccess && capResult.getValueOrThrow()) {
          const id = capResult.getValueOrThrow()!.id;
          await repo.delete(id);
        }
      }
      setSelectedUuids([]);
      onRefresh();
      showCustomAlert("Notes Deleted", "The selected notes have been permanently removed.");
    } catch (e) {
      showCustomAlert("Error", "Could not delete some selected notes.");
    }
  };

  // Batch tag append logic
  const handleBatchAddTag = async () => {
    const trimmedTag = newTagName.trim();
    if (!trimmedTag) return;
    setShowTagDialog(false);
    setNewTagName("");
    try {
      const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
      for (const uuid of selectedUuids) {
        const capResult = await repo.findByUuid(uuid);
        if (capResult.isSuccess && capResult.getValueOrThrow()) {
          const cap = capResult.getValueOrThrow()!;
          
          // Get existing tag names
          const tagsResult = await repo.getTagsForCapture(cap.id);
          const existingTags = tagsResult.isSuccess ? tagsResult.getValueOrThrow() : [];
          
          if (!existingTags.includes(trimmedTag)) {
            await repo.updateTagsForCapture(cap.id, [...existingTags, trimmedTag]);
          }
        }
      }
      setSelectedUuids([]);
      onRefresh();
      showCustomAlert("Tags Updated", `Added tag "${trimmedTag}" to selected captures.`);
    } catch (e) {
      showCustomAlert("Error", "Could not add tag to captures.");
    }
  };

  // Batch merge notes logic
  const handleBatchMerge = async () => {
    setShowMergeConfirm(false);
    if (selectedUuids.length < 2) {
      showCustomAlert("Merge Error", "Please select at least 2 notes to merge.");
      return;
    }

    try {
      const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
      const capsToMerge: CaptureWithTags[] = [];
      
      for (const uuid of selectedUuids) {
        const capResult = await repo.findByUuid(uuid);
        if (capResult.isSuccess && capResult.getValueOrThrow()) {
          capsToMerge.push(capResult.getValueOrThrow()! as CaptureWithTags);
        }
      }

      // Sort by creation date
      capsToMerge.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      // Combine transcripts
      const mergedText = capsToMerge
        .map(c => {
          const timeStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "";
          return `[${timeStr} - ${c.title || "Untitled"}]\n${c.transcript}`;
        })
        .join("\n\n---\n\n");

      // Generate a new combined title using AI/Groq
      let mergedTitle = "Merged Note";
      const groqKey = useSettingsStore.getState().groqApiKey;
      if (groqKey) {
        const suggested = await suggestTitleUsingGroq(mergedText, groqKey);
        if (suggested) mergedTitle = suggested;
      }

      // Collect all tags from merged notes
      const allTags = new Set<string>();
      for (const cap of capsToMerge) {
        const tagsResult = await repo.getTagsForCapture(cap.id);
        if (tagsResult.isSuccess) {
          tagsResult.getValueOrThrow().forEach(t => allTags.add(t));
        }
      }
      allTags.add("merged");

      // Save merged capture
      await useCaptureStore.getState().createLocalCapture(mergedTitle, mergedText, Array.from(allTags));
      
      setSelectedUuids([]);
      onRefresh();
      showCustomAlert("Notes Merged", "A new combined note has been created with all selected transcripts.");
    } catch (e) {
      showCustomAlert("Error", "Could not complete note merging.");
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: CaptureWithTags }) => {
      const isSelected = selectedUuids.includes(item.uuid);
      return (
        <CaptureCard
          key={item.uuid}
          title={item.title ?? item.transcript?.substring(0, 45) ?? "Voice Note"}
          excerpt={item.transcript ?? "No text recorded."}
          timestamp={item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today"}
          selected={isSelected}
          selectionModeActive={selectionModeActive}
          onPress={() => {
            if (selectionModeActive) {
              handleToggleSelect(item.uuid);
            } else {
              router.push({ pathname: "/(modals)/capture-details", params: { uuid: item.uuid } });
            }
          }}
          onLongPress={() => {
            handleLongPress(item.uuid);
          }}
        />
      );
    },
    [selectedUuids, selectionModeActive, handleToggleSelect, handleLongPress],
  );

  const keyExtractor = useCallback((item: CaptureWithTags) => item.uuid, []);

  const maxScroll = contentHeight - layoutHeight;
  const indicatorTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(maxScroll, 1)],
    outputRange: [0, Math.max(layoutHeight - 140, 0)],
    extrapolate: "clamp",
  });

  return (
    <Screen withMarginThread style={styles.container}>
      {/* CONDITIONAL HEADER: Custom Batch Actions Toolbar or Standard Page Header */}
      {selectionModeActive ? (
        <View style={styles.actionBar}>
          <View style={styles.actionBarLeft}>
            <TouchableOpacity onPress={() => setSelectedUuids([])} style={styles.actionCloseBtn}>
              <Feather name="x" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.actionCount}>{selectedUuids.length} selected</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionScroll}>
            <TouchableOpacity onPress={handleSelectAll} style={styles.actionPill}>
              <Text style={styles.actionPillText}>
                {selectedUuids.length === captures.length ? "Deselect All" : "Select All"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowTagDialog(true)} style={styles.actionPill}>
              <Feather name="tag" size={12} color={theme.colors.accent.primary} style={{ marginRight: 4 }} />
              <Text style={styles.actionPillText}>Tag</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowMergeConfirm(true)} style={styles.actionPill}>
              <Feather name="git-merge" size={12} color={theme.colors.accent.primary} style={{ marginRight: 4 }} />
              <Text style={styles.actionPillText}>Merge</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDeleteConfirm(true)} style={[styles.actionPill, styles.actionPillDanger]}>
              <Feather name="trash" size={12} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={[styles.actionPillText, { color: "#FFF" }]}>Delete</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        /* Standard Header Row */
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.titleText}>
              My Notes <Text style={styles.countText}>({totalCount})</Text>
            </Text>
          </View>
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
      )}

      {/* Search Toolbar (Hides during multi-select for clarity) */}
      {!selectionModeActive && (
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
      )}

      {/* Spacious Filter Chips Row (Hides during multi-select) */}
      {!selectionModeActive && (
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
      )}

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
          <Animated.FlatList<CaptureWithTags>
            ref={flatListRef}
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
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.scrollIndicator,
                  {
                    transform: [{ translateY: indicatorTranslateY }],
                  },
                ]}
              />
            </View>
          )}
        </View>
      )}

      {/* Floating Record Action Button (Hides during multi-select) */}
      {!selectionModeActive && (
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
      )}

      {/* ── Dialogs for Batch Operations ────────────────────────────────────── */}
      
      {/* Batch Delete Confirmation */}
      <Dialog
        visible={showDeleteConfirm}
        title="Delete Selected Notes?"
        message={`Are you sure you want to permanently delete these ${selectedUuids.length} selected notes? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleBatchDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Batch Merge Confirmation */}
      <Dialog
        visible={showMergeConfirm}
        title="Merge Selected Notes?"
        message={`This will combine the transcripts of these ${selectedUuids.length} selected notes chronologically into a single combined note. The original notes will remain intact.`}
        confirmText="Merge"
        cancelText="Cancel"
        onConfirm={handleBatchMerge}
        onCancel={() => setShowMergeConfirm(false)}
      />

      {/* Batch Add Tag Dialog */}
      <Dialog
        visible={showTagDialog}
        title="Add Tag to Selected"
        message="Enter a tag name to apply to all selected notes:"
        confirmText="Add Tag"
        cancelText="Cancel"
        onConfirm={handleBatchAddTag}
        onCancel={() => {
          setShowTagDialog(false);
          setNewTagName("");
        }}
      >
        <TextInput
          style={styles.dialogInput}
          value={newTagName}
          onChangeText={setNewTagName}
          placeholder="e.g. work, family, ideas"
          placeholderTextColor={theme.colors.text.muted}
          autoFocus
        />
      </Dialog>

      {/* Standard custom design system notification dialog */}
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
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  countText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.muted,
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
  filtersWrapper: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: theme.layout.mobileMargin,
    gap: 8,
  },
  filterChip: {
    minWidth: 80,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
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
    paddingBottom: 100,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  footer: {
    height: 40,
  },
  fabContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  fabButton: {
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fabInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  fabText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  // Custom Scroll Progress Sidebar Styles
  scrollTrack: {
    width: 6,
    marginVertical: 4,
    marginRight: 6,
    backgroundColor: `${theme.colors.accent.border}40`,
    borderRadius: 3,
    position: "relative",
  },
  scrollIndicator: {
    width: 6,
    height: 120,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.primary,
    opacity: 0.85,
  },
  // Multi-Select Action Bar Styles
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.layout.mobileMargin,
    marginBottom: 16,
    height: 56,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.accent.border,
  },
  actionBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  actionCloseBtn: {
    padding: 6,
    marginRight: 8,
  },
  actionCount: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  actionScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 4,
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
  },
  actionPillDanger: {
    backgroundColor: theme.colors.semantic.error,
    borderColor: theme.colors.semantic.error,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  dialogInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.accent.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    marginTop: 12,
    width: "100%",
    fontSize: 15,
  },
});
