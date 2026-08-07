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
  title: "Project Ideas & Voice Notes",
  excerpt: "Key thoughts on making the user experience super simple and friendly for everyone...",
  timestamp: "12:15 PM",
  duration: "1m 45s",
  status: "unfinished",
};

export const recentCaptures: CaptureItem[] = [
  {
    id: "cap-1",
    title: "Morning Meeting Notes",
    excerpt: "Discussed team goals, product updates, and next steps for the upcoming release...",
    timestamp: "8:30 AM",
    duration: "45s",
    status: "completed",
  },
  {
    id: "cap-2",
    title: "Shopping & Task List",
    excerpt: "Pick up milk, coffee beans, and review the project design feedback with the team...",
    timestamp: "Yesterday",
    duration: "2m 15s",
    status: "completed",
  },
  {
    id: "cap-3",
    title: "Voice Memo on App Features",
    excerpt: "Keep the design clean, friendly, and easy to use without complicated technical jargon...",
    timestamp: "July 18",
    duration: "5m 12s",
    status: "completed",
  },
];
