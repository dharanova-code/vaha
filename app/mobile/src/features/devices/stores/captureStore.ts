import { create } from "zustand";
import { DeviceCaptureMetadata } from "../models/DeviceStatus";
import { Capture } from "@infra/database/schema/captures";
import { Container } from "@core/di/Container";
import { DeviceClient } from "../client/DeviceClient";
import { CaptureRepository } from "../../captures/repositories/CaptureRepository";
import { SyncService, SyncEvent } from "../../sync/services/SyncService";
import { DeviceTransport } from "../transport/DeviceTransport";
import { generateUUID } from "@core/utils/uuid";

export type CaptureWithTags = Capture & { tags?: string[] };

export interface CaptureState {
  captures: CaptureWithTags[];
  deviceCaptures: DeviceCaptureMetadata[];
  isLoading: boolean;
  isSyncing: boolean;
  syncProgress: number;
  
  loadLocalCaptures: () => Promise<void>;
  loadDeviceCaptures: () => Promise<void>;
  syncFromDevice: () => Promise<void>;
  deleteCapture: (id: number) => Promise<void>;
  deleteDeviceCapture: (txId: string) => Promise<void>;
  resumeSyncQueue: () => Promise<void>;
  searchCaptures: (query: string) => Promise<void>;
  createLocalCapture: (title: string, transcript: string, tagNames: string[]) => Promise<void>;
  updateLocalCapture: (id: number, fields: { title: string; transcript: string; tags: string[] }) => Promise<void>;
}

export const useCaptureStore = create<CaptureState>((set, get) => ({
  captures: [],
  deviceCaptures: [],
  isLoading: false,
  isSyncing: false,
  syncProgress: 0,

  loadLocalCaptures: async () => {
    set({ isLoading: true });
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    const result = await repo.findAll();
    const tagsResult = await repo.getAllCaptureTags();
    
    if (result.isSuccess) {
      const list = result.getValueOrThrow() as CaptureWithTags[];
      const tagsList = tagsResult.isSuccess ? tagsResult.getValueOrThrow() : [];
      
      const tagsMap = new Map<number, string[]>();
      for (const t of tagsList) {
        if (!tagsMap.has(t.captureId)) {
          tagsMap.set(t.captureId, []);
        }
        tagsMap.get(t.captureId)!.push(t.tagName);
      }
      
      for (const item of list) {
        item.tags = tagsMap.get(item.id) ?? [];
      }
      set({ captures: list });
    }
    set({ isLoading: false });
  },

  searchCaptures: async (query: string) => {
    set({ isLoading: true });
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    const result = await repo.search(query);
    const tagsResult = await repo.getAllCaptureTags();
    
    if (result.isSuccess) {
      const list = result.getValueOrThrow() as CaptureWithTags[];
      const tagsList = tagsResult.isSuccess ? tagsResult.getValueOrThrow() : [];
      
      const tagsMap = new Map<number, string[]>();
      for (const t of tagsList) {
        if (!tagsMap.has(t.captureId)) {
          tagsMap.set(t.captureId, []);
        }
        tagsMap.get(t.captureId)!.push(t.tagName);
      }
      
      for (const item of list) {
        item.tags = tagsMap.get(item.id) ?? [];
      }
      set({ captures: list });
    }
    set({ isLoading: false });
  },

  loadDeviceCaptures: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    if (!client.isConnected) return;
    
    set({ isLoading: true });
    const result = await client.getCaptures();
    if (result.isSuccess) {
      set({ deviceCaptures: result.getValueOrThrow() });
    }
    set({ isLoading: false });
  },

  syncFromDevice: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    if (!client.isConnected) return;
    
    set({ isSyncing: true, syncProgress: 0 });
    
    const syncService = Container.getInstance().resolve<SyncService>("SyncService");
    
    const unsubscribe = syncService.subscribe((event: SyncEvent) => {
        if (event.type === 'transfer_progress') {
            set({ syncProgress: event.progress.percentage });
        } else if (event.type === 'sync_complete') {
            set({ isSyncing: false, syncProgress: 100 });
            get().loadLocalCaptures();
            get().loadDeviceCaptures();
            unsubscribe();
        } else if (event.type === 'sync_error') {
            set({ isSyncing: false, syncProgress: 0 });
            unsubscribe();
        }
    });

    if (!client.transport) {
      set({ isSyncing: false });
      return;
    }

    const result = await syncService.syncFromDevice(client.transport);
    if (!result.isSuccess) {
       set({ isSyncing: false });
       unsubscribe();
     }
  },

  resumeSyncQueue: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    if (!client.isConnected || !client.transport) return;
    
    const syncService = Container.getInstance().resolve<SyncService>("SyncService");
    
    // Subscribe to listen to progress of the resumed queue
    const unsubscribe = syncService.subscribe((event: SyncEvent) => {
        if (event.type === 'transfer_progress') {
            set({ syncProgress: event.progress.percentage, isSyncing: true });
        } else if (event.type === 'sync_complete') {
            set({ isSyncing: false, syncProgress: 100 });
            get().loadLocalCaptures();
            get().loadDeviceCaptures();
            unsubscribe();
        } else if (event.type === 'sync_error') {
            set({ isSyncing: false, syncProgress: 0 });
            unsubscribe();
        }
    });

    await syncService.processQueue(client.transport).catch(() => {
        set({ isSyncing: false });
        unsubscribe();
    });
  },

  deleteCapture: async (id: number) => {
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    await repo.delete(id);
    await get().loadLocalCaptures();
  },

  deleteDeviceCapture: async (txId: string) => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    if (!client.isConnected) return;
    
    await client.deleteCapture(txId);
    await get().loadDeviceCaptures();
  },

  createLocalCapture: async (title: string, transcript: string, tagNames: string[]) => {
    set({ isLoading: true });
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    
    let finalTitle = title.trim();
    if (!finalTitle) {
      const match = transcript.match(/^[^.!?]+/);
      finalTitle = match ? match[0].trim() : "Untitled Capture";
    }
    
    const res = await repo.create({
      uuid: generateUUID(),
      title: finalTitle,
      transcript,
      syncState: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    if (res.isSuccess) {
      const inserted = res.getValueOrThrow();
      await repo.updateTagsForCapture(inserted.id, tagNames);
    }
    
    set({ isLoading: false });
    await get().loadLocalCaptures();
  },

  updateLocalCapture: async (id: number, fields: { title: string; transcript: string; tags: string[] }) => {
    set({ isLoading: true });
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    
    await repo.update(id, {
      title: fields.title,
      transcript: fields.transcript,
    });
    
    await repo.updateTagsForCapture(id, fields.tags);
    set({ isLoading: false });
    await get().loadLocalCaptures();
  }
}));
