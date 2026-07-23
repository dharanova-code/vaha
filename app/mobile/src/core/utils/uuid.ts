import * as Crypto from "expo-crypto";

/**
 * Generates a cryptographically secure random UUID (v4) using the expo-crypto library.
 * This is the centralized UUID abstraction for the mobile application.
 */
export function generateUUID(): string {
  return Crypto.randomUUID();
}
