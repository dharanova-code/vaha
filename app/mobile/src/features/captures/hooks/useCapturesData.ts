import { useState, useCallback, useMemo, useEffect } from "react";
import { useCaptureStore, CaptureWithTags } from "../../devices/stores/captureStore";

export type FilterType = "all" | "mobile" | "uno_q" | "synced" | "unsynced";
export type SortOrder = "newest" | "oldest" | "alphabetical";

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
    deleteCapture,
  } = useCaptureStore();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Pull-to-refresh delegates directly to existing store action
  const onRefresh = useCallback(async () => {
    await loadLocalCaptures();
  }, [loadLocalCaptures]);

  const onClearSearch = useCallback(() => setQuery(""), []);

  // Effect to load captures on mount
  useEffect(() => {
    loadLocalCaptures();
  }, [loadLocalCaptures]);

  // Combined search, filter, and sort logic in memory
  const processedCaptures = useMemo<CaptureWithTags[]>(() => {
    let result = [...captures];

    // 1. Search Query (title, transcript, tags)
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(c => {
        const titleMatch = c.title?.toLowerCase().includes(q) ?? false;
        const transcriptMatch = c.transcript?.toLowerCase().includes(q) ?? false;
        const tagsMatch = c.tags?.some(t => t.toLowerCase().includes(q)) ?? false;
        return titleMatch || transcriptMatch || tagsMatch;
      });
    }

    // 2. Filters (mobile vs device, synced vs unsynced)
    if (filter === "mobile") {
      result = result.filter(c => c.deviceId === null);
    } else if (filter === "uno_q") {
      result = result.filter(c => c.deviceId !== null);
    } else if (filter === "synced") {
      result = result.filter(c => c.syncState === "synced");
    } else if (filter === "unsynced") {
      result = result.filter(c => c.syncState !== "synced");
    }

    // 3. Sorting (newest, oldest, alphabetical)
    result.sort((a, b) => {
      const tA = a.createdAt.getTime();
      const tB = b.createdAt.getTime();
      if (sortOrder === "newest") {
        return tB - tA;
      } else if (sortOrder === "oldest") {
        return tA - tB;
      } else {
        const titleA = a.title ?? "";
        const titleB = b.title ?? "";
        return titleA.localeCompare(titleB);
      }
    });

    return result;
  }, [captures, query, filter, sortOrder]);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteCapture(id);
    },
    [deleteCapture],
  );

  return {
    captures: processedCaptures,
    totalCount: processedCaptures.length,
    isLoading,
    isSyncing,
    isEmpty: !isLoading && captures.length === 0,
    isEmptySearch: !isLoading && query.trim().length > 0 && processedCaptures.length === 0,
    query,
    setQuery,
    onClearSearch,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    onRefresh,
    handleDelete,
  };
}
