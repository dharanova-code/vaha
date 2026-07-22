import { useState, useCallback, useMemo, useEffect } from "react";
import { useCaptureStore } from "../../devices/stores/captureStore";
import { Capture } from "@infra/database/schema/captures";

export type SortOrder = "newest" | "oldest";

/**
 * useCapturesData — presentation hook for the Captures library screen.
 *
 * Encapsulates all data composition, search filtering, and sort logic.
 * The screen consumes only this hook — no direct store or repository access.
 */
export function useCapturesData() {
  const {
    captures,
    isLoading,
    isSyncing,
    loadLocalCaptures,
    searchCaptures,
    deleteCapture,
  } = useCaptureStore();

  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Pull-to-refresh delegates directly to existing store action
  const onRefresh = useCallback(async () => {
    await loadLocalCaptures();
  }, [loadLocalCaptures]);

  const onClearSearch = useCallback(() => setQuery(""), []);

  const toggleSort = useCallback(() => {
    setSortOrder(prev => (prev === "newest" ? "oldest" : "newest"));
  }, []);

  // Effect for debounced search using SQLite
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      loadLocalCaptures();
      return;
    }
    const timer = setTimeout(() => {
      searchCaptures(q);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, loadLocalCaptures, searchCaptures]);

  // Sorting — applied directly to the captures from the store
  const sorted = useMemo<Capture[]>(() => {
    return [...captures].sort((a, b) => {
      const tA = a.createdAt.getTime();
      const tB = b.createdAt.getTime();
      return sortOrder === "newest" ? tB - tA : tA - tB;
    });
  }, [captures, sortOrder]);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteCapture(id);
    },
    [deleteCapture],
  );

  return {
    // List data
    captures: sorted,
    totalCount: captures.length,
    // State
    isLoading,
    isSyncing,
    isEmpty: !isLoading && captures.length === 0,
    isEmptySearch: !isLoading && query.trim().length > 0 && sorted.length === 0,
    // Search
    query,
    setQuery,
    onClearSearch,
    // Sort
    sortOrder,
    toggleSort,
    // Actions
    onRefresh,
    handleDelete,
  };
}
