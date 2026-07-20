module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/src/core/$1",
    "^@infra/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@platform/(.*)$": "<rootDir>/src/platform/$1",
    "\\.sql$": "<rootDir>/tests/mocks/sqlMock.js",
    // expo-sqlite/next was removed in SDK 54; drizzle-orm still references it internally
    "^expo-sqlite/next$": "<rootDir>/node_modules/expo-sqlite",
  },
  setupFilesAfterEnv: [],
};

