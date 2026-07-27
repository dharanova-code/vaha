const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow .sql files to be imported as text modules (Drizzle migrations)
config.resolver.sourceExts.push('sql');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'sql');

// Map expo-sqlite/next to expo-sqlite (removed in SDK 54 but drizzle-orm still references it)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-sqlite/next') {
    return context.resolveRequest(context, 'expo-sqlite', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
