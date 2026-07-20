import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_NAME: z.string().default("vaha_journal.db"),
  SECURE_KEYSTORE_ALIAS: z.string().default("vaha_secure_vault"),
});

const rawProcessEnv = {
  NODE_ENV: process.env["NODE_ENV"],
  DATABASE_NAME: process.env["DATABASE_NAME"],
  SECURE_KEYSTORE_ALIAS: process.env["SECURE_KEYSTORE_ALIAS"],
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
}

export const appConfig: AppConfig = Object.freeze({
  env: parsedEnv.NODE_ENV,
  database: Object.freeze({
    name: parsedEnv.DATABASE_NAME,
  }),
  storage: Object.freeze({
    keystoreAlias: parsedEnv.SECURE_KEYSTORE_ALIAS,
  }),
});
export type { AppConfig as AppConfigType };
