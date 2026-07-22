import { create } from "zustand";
import { Container } from "@core/di/Container";
import { SettingsRepository } from "../repositories/SettingsRepository";

export interface SettingsState {
  serverIp: string;
  autoSync: boolean;
  retentionDays: number;
  
  setServerIp: (ip: string) => void;
  setAutoSync: (autoSync: boolean) => void;
  setRetentionDays: (days: number) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  serverIp: "192.168.1.100", // Default fallback
  autoSync: true,
  retentionDays: 30, // Default 30 days retention

  loadSettings: async () => {
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      const ipRes = await repo.get("serverIp");
      const syncRes = await repo.get("autoSync");
      const retRes = await repo.get("retentionDays");
      
      const ip = ipRes.isSuccess ? ipRes.getValueOrThrow()?.value : undefined;
      const sync = syncRes.isSuccess ? syncRes.getValueOrThrow()?.value : undefined;
      const retention = retRes.isSuccess ? retRes.getValueOrThrow()?.value : undefined;
      
      set({ 
        serverIp: ip ?? "192.168.1.100", 
        autoSync: sync === "true",
        retentionDays: retention ? parseInt(retention, 10) : 30
      });
    } catch (e) {
      console.warn("Failed to load settings", e);
    }
  },

  setServerIp: async (ip: string) => {
    set({ serverIp: ip });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("serverIp", ip);
    } catch (e) {
      console.warn("Failed to persist serverIp", e);
    }
  },
  setAutoSync: async (autoSync: boolean) => {
    set({ autoSync });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("autoSync", autoSync ? "true" : "false");
    } catch (e) {
      console.warn("Failed to persist autoSync", e);
    }
  },
  setRetentionDays: async (retentionDays: number) => {
    set({ retentionDays });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("retentionDays", retentionDays.toString());
    } catch (e) {
      console.warn("Failed to persist retentionDays", e);
    }
  }
}));
