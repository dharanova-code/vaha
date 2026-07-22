import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_NAME: z.string().default("vaha_journal.db"),
  SECURE_KEYSTORE_ALIAS: z.string().default("vaha_secure_vault"),
  USE_MOCK_DEVICE: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .default(false),
});

const rawProcessEnv = {
  NODE_ENV: process.env["NODE_ENV"],
  DATABASE_NAME: process.env["DATABASE_NAME"],
  SECURE_KEYSTORE_ALIAS: process.env["SECURE_KEYSTORE_ALIAS"],
  USE_MOCK_DEVICE: process.env["EXPO_PUBLIC_USE_MOCK_DEVICE"] ?? process.env["USE_MOCK_DEVICE"],
};

const parsedEnv = envSchema.parse(rawProcessEnv);

export interface DatabaseConfig {
  readonly name: string;
}

export interface StorageConfig {
  readonly keystoreAlias: string;
}

export interface AppConfig {
  readonly env: "development" | "production" | "test";
  readonly database: DatabaseConfig;
  readonly storage: StorageConfig;
  readonly useMockDevice: boolean;
}

export const appConfig: AppConfig = Object.freeze({
  env: parsedEnv.NODE_ENV,
  database: Object.freeze({
    name: parsedEnv.DATABASE_NAME,
  }),
  storage: Object.freeze({
    keystoreAlias: parsedEnv.SECURE_KEYSTORE_ALIAS,
  }),
  useMockDevice: parsedEnv.USE_MOCK_DEVICE,
});
export type { AppConfig as AppConfigType };
