import { create } from "zustand";
import { DeviceCaptureMetadata } from "../models/DeviceStatus";
import { Capture } from "@infra/database/schema/captures";
import { Container } from "@core/di/Container";
import { DeviceClient } from "../client/DeviceClient";
import { CaptureRepository } from "../../captures/repositories/CaptureRepository";
import { SyncService, SyncEvent } from "../../sync/services/SyncService";
import { DeviceTransport } from "../transport/DeviceTransport";

export interface CaptureState {
  captures: Capture[];
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
    if (result.isSuccess) {
      set({ captures: result.getValueOrThrow() as unknown as Capture[] }); // type assertion for Phase E mismatch
    }
    set({ isLoading: false });
  },

  searchCaptures: async (query: string) => {
    set({ isLoading: true });
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    const result = await repo.search(query);
    if (result.isSuccess) {
      set({ captures: result.getValueOrThrow() as unknown as Capture[] });
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

    const result = await syncService.syncFromDevice(client as unknown as DeviceTransport); // casting DeviceClient to DeviceTransport for Phase F stub
    if (!result.isSuccess) {
       set({ isSyncing: false });
       unsubscribe();
    }
  },

  resumeSyncQueue: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    if (!client.isConnected) return;
    
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

    await syncService.processQueue(client as unknown as DeviceTransport).catch(() => {
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
  }
}));
