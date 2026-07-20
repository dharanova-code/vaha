export const STORAGE_KEYS = {
  USER_SESSION: "vaha:session",
  IS_ONBOARDED: "vaha:onboarded",
  LAST_SYNC_TIMESTAMP: "vaha:last_sync",
} as const;

export const DATABASE = {
  NAME: "vaha_journal.db",
  VERSION: 1,
} as const;

export const ROUTES = {
  HOME: "/",
  ONBOARDING: "/onboarding",
  SETTINGS: "/settings",
  SEARCH: "/search",
  INSIGHTS: "/insights",
} as const;
