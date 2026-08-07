import { create } from "zustand";
import { Container } from "@core/di/Container";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { appConfig } from "@core/config/AppConfig";

export interface SettingsState {
  serverIp: string;
  autoSync: boolean;
  retentionDays: number;
  userName: string;
  userEmail: string;
  userBio: string;
  userAvatarUri: string;
  groqApiKey: string;
  
  setServerIp: (ip: string) => void;
  setAutoSync: (autoSync: boolean) => void;
  setRetentionDays: (days: number) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserBio: (bio: string) => void;
  setUserAvatarUri: (uri: string) => void;
  setGroqApiKey: (key: string) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  serverIp: appConfig.defaultDeviceIp, // Default fallback
  autoSync: true,
  retentionDays: 30, // Default 30 days retention
  userName: "",
  userEmail: "",
  userBio: "",
  userAvatarUri: "",
  groqApiKey: "",

  loadSettings: async () => {
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      const ipRes = await repo.get("serverIp");
      const syncRes = await repo.get("autoSync");
      const retRes = await repo.get("retentionDays");
      const nameRes = await repo.get("userName");
      const emailRes = await repo.get("userEmail");
      const bioRes = await repo.get("userBio");
      const avatarRes = await repo.get("userAvatarUri");
      const keyRes = await repo.get("groqApiKey");
      
      const ip = ipRes.isSuccess ? ipRes.getValueOrThrow()?.value : undefined;
      const sync = syncRes.isSuccess ? syncRes.getValueOrThrow()?.value : undefined;
      const retention = retRes.isSuccess ? retRes.getValueOrThrow()?.value : undefined;
      const name = nameRes.isSuccess ? nameRes.getValueOrThrow()?.value : undefined;
      const email = emailRes.isSuccess ? emailRes.getValueOrThrow()?.value : undefined;
      const bio = bioRes.isSuccess ? bioRes.getValueOrThrow()?.value : undefined;
      const avatar = avatarRes.isSuccess ? avatarRes.getValueOrThrow()?.value : undefined;
      const key = keyRes.isSuccess ? keyRes.getValueOrThrow()?.value : undefined;
      
      set({ 
        serverIp: ip ?? appConfig.defaultDeviceIp, 
        autoSync: sync === "true",
        retentionDays: retention ? parseInt(retention, 10) : 30,
        userName: name ?? "",
        userEmail: email ?? "",
        userBio: bio ?? "",
        userAvatarUri: avatar ?? "",
        groqApiKey: key ?? "",
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
  },
  setUserName: async (userName: string) => {
    set({ userName });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("userName", userName);
    } catch (e) {
      console.warn("Failed to persist userName", e);
    }
  },
  setUserEmail: async (userEmail: string) => {
    set({ userEmail });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("userEmail", userEmail);
    } catch (e) {
      console.warn("Failed to persist userEmail", e);
    }
  },
  setUserBio: async (userBio: string) => {
    set({ userBio });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("userBio", userBio);
    } catch (e) {
      console.warn("Failed to persist userBio", e);
    }
  },
  setUserAvatarUri: async (userAvatarUri: string) => {
    set({ userAvatarUri });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("userAvatarUri", userAvatarUri);
    } catch (e) {
      console.warn("Failed to persist userAvatarUri", e);
    }
  },
  setGroqApiKey: async (groqApiKey: string) => {
    set({ groqApiKey });
    try {
      const repo = Container.getInstance().resolve<SettingsRepository>("SettingsRepository");
      await repo.set("groqApiKey", groqApiKey);
    } catch (e) {
      console.warn("Failed to persist groqApiKey", e);
    }
  }
}));
