import React from "react";
import { Redirect } from "expo-router";
import { MMKV } from "react-native-mmkv";
import { STORAGE_KEYS } from "../src/core/constants";

export default function EntryRedirect() {
  const mmkv = new MMKV();
  const isOnboarded = mmkv.getString(STORAGE_KEYS.IS_ONBOARDED) === "true";

  if (!isOnboarded) {
    return <Redirect href={"/onboarding" as any} />;
  }

  return <Redirect href="/(tabs)/home" />;
}
