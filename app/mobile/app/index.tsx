import React from "react";
import { Redirect } from "expo-router";

export default function EntryRedirect() {
  return <Redirect href="/(tabs)/home" />;
}
