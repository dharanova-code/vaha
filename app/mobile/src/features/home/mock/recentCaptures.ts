export interface CaptureItem {
  id: string;
  title: string;
  excerpt: string;
  timestamp: string;
  duration: string;
  status: "completed" | "unfinished";
}

export const continuingAnchor: CaptureItem = {
  id: "anchor-1",
  title: "A Quiet Clearing",
  excerpt: "The wind through the pines has a distinct resonance. I began drafting a Stoic ledger reflection on boundaries...",
  timestamp: "12:15 PM",
  duration: "1m 45s",
  status: "unfinished",
};

export const recentCaptures: CaptureItem[] = [
  {
    id: "cap-1",
    title: "Morning Coffee Contemplation",
    excerpt: "Why does the warm paper texture soothe the eye? There's an alignment between design limits and local storage constraints...",
    timestamp: "8:30 AM",
    duration: "45s",
    status: "completed",
  },
  {
    id: "cap-2",
    title: "Stitch Interface Notes",
    excerpt: "Synchronization with Muji aesthetic rules is completed. Design tokens map to clean variables, reducing visual noise...",
    timestamp: "Yesterday",
    duration: "2m 15s",
    status: "completed",
  },
  {
    id: "cap-3",
    title: "Local SQLite Health",
    excerpt: "No corrupted headers found in SQLite wal files. The runtime audit is successful. Verified with test containers...",
    timestamp: "July 18",
    duration: "5m 12s",
    status: "completed",
  },
];
