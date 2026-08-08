import React from "react";
import { Redirect } from "expo-router";
import { getStorageService } from "../src/infrastructure/storage/KeyValueStorage";
import { STORAGE_KEYS } from "../src/core/constants";

export default function EntryRedirect() {
  const mmkv = getStorageService();
  const isOnboarded = mmkv.getString(STORAGE_KEYS.IS_ONBOARDED) === "true";

  if (!isOnboarded && !__DEV__) {
    return <Redirect href={"/onboarding" as any} />;
  }

  return <Redirect href="/(tabs)/home" />;
}
