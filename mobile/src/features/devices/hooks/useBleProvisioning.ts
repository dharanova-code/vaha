import { useState, useEffect, useRef } from "react";
import { createProvisioningService, ProvisioningService, DiscoveredBleDevice, ProvisioningStatus, Device, State } from "../services/BleProvisioningService";
import { Container } from "../../../core/di/Container";
import { Logger } from "../../../core/logger/Logger";
import { useDeviceStore } from "../stores/deviceStore";
import { useSettingsStore } from "../../settings/stores/settingsStore";
import { Platform, PermissionsAndroid } from "react-native";
import { router } from "expo-router";
import { DeviceDiscoveryService } from "../services/DeviceDiscoveryService";
import { DeviceRepository } from "../repositories/DeviceRepository";
import { SyncService } from "../../sync/services/SyncService";
import { DeviceStatus } from "../models/DeviceStatus";
import { DeviceTransport } from "../transport/DeviceTransport";
// Removed unused AppError

export function useBleProvisioning() {
  const [status, setStatus] = useState<ProvisioningStatus>("idle");
  const [devices, setDevices] = useState<DiscoveredBleDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DiscoveredBleDevice | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const isMounted = useRef(true);
  const serviceRef = useRef<ProvisioningService | null>(null);
  const connectedDeviceRef = useRef<Device | null>(null);
  // No setDevice in DeviceStore, we just persist IP via SettingsStore
  const setServerIp = useSettingsStore((state) => state.setServerIp);

  useEffect(() => {
    isMounted.current = true;
    const logger = Container.getInstance().resolve<Logger>("Logger");
    serviceRef.current = createProvisioningService(logger);

    return () => {
      isMounted.current = false;
      serviceRef.current?.stopScanning();
      if (connectedDeviceRef.current) {
        serviceRef.current?.disconnect(connectedDeviceRef.current.id).catch(() => {});
      }
      serviceRef.current?.destroy();
    };
  }, []);

  const safeSetStatus = (s: ProvisioningStatus) => { if (isMounted.current) setStatus(s); };
  const safeSetLastError = (e: string | null) => { if (isMounted.current) setLastError(e); };
  const safeSetDevices = (action: React.SetStateAction<DiscoveredBleDevice[]>) => { if (isMounted.current) setDevices(action); };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      
      const locGranted = granted["android.permission.ACCESS_FINE_LOCATION"] === "granted";
      const scanGranted = granted["android.permission.BLUETOOTH_SCAN"] === "granted" || Platform.Version < 31;
      const connGranted = granted["android.permission.BLUETOOTH_CONNECT"] === "granted" || Platform.Version < 31;
      
      if (!locGranted) throw new Error("Location permission is required for Bluetooth scanning.");
      if (!scanGranted || !connGranted) throw new Error("Bluetooth permissions are required.");
      return true;
    }
    return true; 
  };

  const startScanning = async () => {
    safeSetLastError(null);
    safeSetDevices([]);
    
    try {
      await requestPermissions();
    } catch (err) {
      safeSetLastError(err instanceof Error ? err.message : "Permission denied");
      safeSetStatus("error");
      return;
    }

    try {
      const stateRes = await serviceRef.current!.checkAdapterState();
      if (!stateRes.isSuccess) {
        safeSetLastError(stateRes.getErrorOrThrow().message);
        safeSetStatus("error");
        return;
      }
      
      if (stateRes.getValueOrThrow() === State.PoweredOff) {
        safeSetLastError("Bluetooth is powered off. Please enable it.");
        safeSetStatus("error");
        return;
      }
    } catch (_e) {
      safeSetLastError("Could not read Bluetooth state.");
      safeSetStatus("error");
      return;
    }

    safeSetStatus("scanning");

    try {
      await serviceRef.current?.waitForState(State.PoweredOn);
      serviceRef.current?.startScanning(
        (device) => {
          safeSetDevices((prev) => {
            const exists = prev.find((d) => d.id === device.id);
            let next: DiscoveredBleDevice[];
            if (exists) {
              next = prev.map((d) => d.id === device.id ? { ...d, rssi: device.rssi } : d);
            } else {
              next = [...prev, device];
            }
            return next.sort((a, b) => (b.rssi ?? -100) - (a.rssi ?? -100));
          });
        },
        (error) => {
          safeSetLastError(error.message);
          safeSetStatus("error");
        },
        15000 // 15 seconds timeout
      );
    } catch (e: unknown) {
      safeSetLastError(e instanceof Error ? e.message : "Failed to start Bluetooth");
      safeSetStatus("error");
    }
  };

  const stopScanning = () => {
    serviceRef.current?.stopScanning();
    if (status === "scanning") safeSetStatus("idle");
  };

  const provisionDevice = async (device: DiscoveredBleDevice, ssid: string, pass: string) => {
    if (status !== "idle") return; // Prevent multiple attempts
    
    stopScanning();
    if (isMounted.current) setSelectedDevice(device);
    safeSetLastError(null);
    safeSetStatus("connecting");

    const connectRes = await serviceRef.current!.connectToDevice(device.id);
    if (!connectRes.isSuccess) {
      safeSetLastError(connectRes.getErrorOrThrow().message);
      safeSetStatus("error");
      return;
    }
    
    connectedDeviceRef.current = connectRes.getValueOrThrow();
    safeSetStatus("discovering_services");
    
    // Simulate short delay for UI state transition
    await new Promise(r => setTimeout(r, 500));
    
    safeSetStatus("sending_credentials");

    const credsRes = await serviceRef.current!.sendWifiCredentials(connectedDeviceRef.current, ssid, pass);
    if (!credsRes.isSuccess) {
      safeSetLastError(credsRes.getErrorOrThrow().message);
      safeSetStatus("error");
      await serviceRef.current!.disconnect(device.id);
      return;
    }

    safeSetStatus("waiting_for_wifi");
    const verifyRes = await serviceRef.current!.verifyProvisioningStatus(connectedDeviceRef.current);
    
    await serviceRef.current!.disconnect(device.id);

    if (!verifyRes.isSuccess) {
      safeSetLastError(verifyRes.getErrorOrThrow().message);
      safeSetStatus("error");
      return;
    }

    const { ip } = verifyRes.getValueOrThrow();
    setServerIp(ip);

    // 1. Automatically discover device on local network / Verify health endpoint
    safeSetStatus("discovering_device");
    const discoveryService = Container.getInstance().resolve<DeviceDiscoveryService>("DeviceDiscoveryService");
    
    let transport: DeviceTransport | null = null;
    let transportError: Error | null = null;
    
    for (let attempt = 1; attempt <= 10; attempt++) {
        if (attempt > 1) {
            await new Promise(r => setTimeout(r, 2000 * Math.min(attempt, 5)));
        }
        if (!isMounted.current) return; // Cancel if user left
        
        // Use device UUID (or empty auth token) for connection
        const connectRes = await discoveryService.connectToIp(ip, device.id, "");
        if (connectRes.isSuccess) {
            transport = connectRes.getValueOrThrow();
            break;
        } else {
            transportError = connectRes.getErrorOrThrow();
        }
    }

    if (!transport) {
       safeSetLastError(transportError?.message ?? "Failed to discover device on local network.");
       safeSetStatus("error");
       return;
    }

    if (!isMounted.current) return;
    safeSetStatus("verifying_health");

    // 2. Fetch device metadata (partly done by connectToIp, but let's grab model/firmware explicitly)
    let firmware: string | null = null;
    const statusRes = await transport.get<DeviceStatus>("/status");
    if (statusRes.isSuccess) {
        firmware = statusRes.getValueOrThrow().firmware_version ?? null;
    }

    // 3. Persist/update the device in the repository
    const deviceRepo = Container.getInstance().resolve<DeviceRepository>("DeviceRepository");
    const allDevicesRes = await deviceRepo.findAll();
    
    if (allDevicesRes.isSuccess) {
        const existingDevice = allDevicesRes.getValueOrThrow().find(d => d.uuid === device.id);
        if (existingDevice) {
            await deviceRepo.update(existingDevice.id, { 
                lastSeen: new Date(), 
                trusted: true, 
                firmware 
            });
        } else {
            await deviceRepo.create({
                uuid: device.id,
                name: device.name ?? "VAHA Device",
                firmware,
                createdAt: new Date(),
                updatedAt: new Date(),
                trusted: true,
                lastSeen: new Date(),
            });
        }
    }

    // 4. Refresh DeviceStore
    const store = useDeviceStore.getState();
    if ('setDevice' in store) {
      store.setDevice({ uuid: device.id, name: device.name });
    }
    // Also instruct the store to connect via its own transport flow
    await store.connect(ip);

    // 5. Start SyncService and resume pending sync queue
    safeSetStatus("syncing");
    const syncService = Container.getInstance().resolve<SyncService>("SyncService");
    await syncService.syncFromDevice(transport);

    safeSetStatus("success");
    
    // 6. Navigate to Home
    if (isMounted.current) {
        router.replace("/(tabs)/home");
    }
  };

  const reset = () => {
    stopScanning();
    if (connectedDeviceRef.current) {
        serviceRef.current?.disconnect(connectedDeviceRef.current.id).catch(() => {});
        connectedDeviceRef.current = null;
    }
    safeSetStatus("idle");
    safeSetLastError(null);
    if (isMounted.current) setSelectedDevice(null);
  };

  return {
    status,
    devices,
    selectedDevice,
    lastError,
    startScanning,
    stopScanning,
    provisionDevice,
    reset,
  };
}
