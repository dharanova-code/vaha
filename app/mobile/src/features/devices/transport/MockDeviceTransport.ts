import { DeviceTransport, DeviceStream, DeviceStreamMessage } from "./DeviceTransport";
import { Result } from "@core/utils/Result";
import { CommunicationError } from "@core/errors/CommunicationError";
import { Logger } from "@core/logger/Logger";
import { DeviceStatus, DeviceCaptureMetadata, LiveSensorReading } from "../models/DeviceStatus";
import { MMKV } from "react-native-mmkv";

export class MockDeviceTransport implements DeviceTransport {
  private readonly deviceUuid: string;
  private readonly logger: Logger;
  private _isConnected = true;
  private mockCaptures: DeviceCaptureMetadata[] = [];
  private mmkv = new MMKV();
  private telemetryInterval: ReturnType<typeof setInterval> | null = null;
  private activeStreams: Set<MockDeviceStream> = new Set();

  constructor(deviceUuid: string, logger: Logger) {
    this.deviceUuid = deviceUuid;
    this.logger = logger;
    this._initializeMockData();
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  private _initializeMockData() {
    // Generate 30 realistic mock captures if not already stored
    const stored = this.mmkv.getString("mock_captures");
    if (stored) {
      try {
        this.mockCaptures = JSON.parse(stored);
        return;
      } catch (e) {
        // Fallback to generating
      }
    }

    const startTimestamp = Date.now() - 30 * 24 * 3600 * 1000; // 30 days ago
    const topics = [
      { title: "Shopping list", text: "Remember to buy milk, bread, eggs, and some fresh coffee beans on the way back." },
      { title: "App project ideas", text: "We should create a mock development mode for the VAHA mobile app to test the offline-first sync engine." },
      { title: "Meeting memo", text: "Sync up with the edge AI engineering team regarding the faster-whisper model deployment on Uno Q." },
      { title: "Gym reminder", text: "Schedule leg day workout tomorrow at six in the evening. Keep it intense." },
      { title: "Notion database setup", text: "Ensure the Notion database is shared with the integration token and contains Name, Captured, Source, and Tags." },
      { title: "BLE Pairing design", text: "ECDH shared secret exchange over BLE is required for Phase F secure transport." }
    ];

    for (let i = 0; i < 30; i++) {
      const topic = topics[i % topics.length]!;
      const timeOffset = i * 24 * 3600 * 1000 + Math.random() * 8 * 3600 * 1000;
      const stamp = new Date(startTimestamp + timeOffset).toISOString();
      const id = `mock-cap-uuid-${1000 + i}`;
      this.mockCaptures.push({
        transaction_id: id,
        captured_timestamp: stamp,
        audio_encoding: "WAV",
        sample_rate: 48000,
        channels: 1,
        audio_size_bytes: 48000 * 2 * (3 + (i % 5)), // 3 to 7 seconds size
        audio_md5: `md5hashstub${i}f5466bcbe6195`,
        transcript: topic.text,
        telemetry_metrics: {
          temperature_celsius: 20 + Math.random() * 5,
          humidity_percentage: 45 + Math.random() * 15,
          voc_parts_per_billion: 120 + Math.floor(Math.random() * 200),
          liquid_flow: {
            rate_liters_per_minute: Math.random() > 0.3 ? 5 + Math.random() * 3 : 0,
            accumulated_volume_liters: 10 + i * 2.5
          }
        }
      });
    }

    // Sort newest first
    this.mockCaptures.sort((a, b) => new Date(b.captured_timestamp).getTime() - new Date(a.captured_timestamp).getTime());
    this._saveCaptures();
  }

  private _saveCaptures() {
    this.mmkv.set("mock_captures", JSON.stringify(this.mockCaptures));
  }

  private _getMockStatus(): DeviceStatus {
    const bat = this.mmkv.getString("mock_battery");
    const battery = bat ? parseInt(bat, 10) : 85;
    
    // Simulate slight discharge/charge
    const nextBattery = Math.max(10, Math.min(100, battery + (Math.random() > 0.55 ? 1 : -1)));
    this.mmkv.set("mock_battery", nextBattery.toString());

    return {
      device_id: this.deviceUuid || "VAHA-MOCK-UNOQ",
      firmware_version: "1.0.4-mock",
      api_version: "v1",
      capabilities: ["sensors", "audio_pcm", "audio_flac"],
      battery_percentage: nextBattery,
      buffered_captures_count: this.mockCaptures.length,
      storage_used_bytes: this.mockCaptures.reduce((acc, c) => acc + c.audio_size_bytes, 0) + 120456,
      uptime_seconds: Math.floor(Date.now() / 1000) % 86400,
      cpu_percent: 12 + Math.floor(Math.random() * 15),
      memory_used_bytes: 45 * 1024 * 1024 + Math.floor(Math.random() * 5000000),
      ip_address: "192.168.1.150",
      mac_address: "00:1A:2B:3C:4D:5E",
      microphone_active: true
    };
  }

  private _getLiveSensors(): LiveSensorReading {
    return {
      temperature_celsius: 21.5 + Math.sin(Date.now() / 60000) * 1.5,
      humidity_percentage: 52 + Math.cos(Date.now() / 60000) * 5,
      voc_parts_per_billion: 140 + Math.floor(Math.sin(Date.now() / 30000) * 40 + Math.random() * 15),
      flow_rate_liters_per_minute: Math.random() > 0.25 ? 6.2 + Math.sin(Date.now() / 10000) * 1.2 : 0,
      accumulated_volume_liters: 120.4 + (Date.now() % 100000) / 1000,
      sampled_at: new Date().toISOString()
    };
  }

  async get<T>(path: string): Promise<Result<T, CommunicationError>> {
    this.logger.debug(`[MOCK COMM] GET ${path}`);
    await new Promise((r) => setTimeout(r, 200)); // Simulate network latency

    if (path === "/status") {
      return Result.ok(this._getMockStatus() as unknown as T);
    }
    if (path === "/health") {
      return Result.ok({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime_seconds: 1234.5
      } as unknown as T);
    }
    if (path === "/sensors/current") {
      return Result.ok(this._getLiveSensors() as unknown as T);
    }
    if (path === "/sensors/history") {
      const history = Array.from({ length: 10 }).map((_, i) => ({
        ...this._getLiveSensors(),
        sampled_at: new Date(Date.now() - i * 5000).toISOString()
      }));
      return Result.ok(history as unknown as T);
    }
    if (path === "/captures") {
      return Result.ok(this.mockCaptures as unknown as T);
    }

    return Result.fail(new CommunicationError(`Mock endpoint not found: GET ${path}`, "NOT_FOUND"));
  }

  async post<T, B extends object>(
    path: string,
    body: B,
  ): Promise<Result<T, CommunicationError>> {
    this.logger.debug(`[MOCK COMM] POST ${path} with ${JSON.stringify(body)}`);
    await new Promise((r) => setTimeout(r, 200));

    if (path === "/settings") {
      const req = body as any;
      if (req.auto_sync !== undefined) {
        this.mmkv.set("mock_auto_sync", req.auto_sync ? "true" : "false");
      }
      return Result.ok({ success: true } as unknown as T);
    }

    return Result.fail(new CommunicationError(`Mock endpoint not found: POST ${path}`, "NOT_FOUND"));
  }

  async delete<T>(path: string): Promise<Result<T, CommunicationError>> {
    this.logger.debug(`[MOCK COMM] DELETE ${path}`);
    await new Promise((r) => setTimeout(r, 150));

    if (path.startsWith("/captures/")) {
      const id = path.replace("/captures/", "");
      const index = this.mockCaptures.findIndex((c) => c.transaction_id === id);
      if (index !== -1) {
        this.mockCaptures.splice(index, 1);
        this._saveCaptures();
        return Result.ok({ success: true, transaction_id: id } as unknown as T);
      }
      return Result.fail(new CommunicationError(`Capture not found: ${id}`, "NOT_FOUND"));
    }

    return Result.fail(new CommunicationError(`Mock endpoint not found: DELETE ${path}`, "NOT_FOUND"));
  }

  async upload<T>(
    path: string,
    fileUri: string,
    fieldName: string,
    mimeType: string
  ): Promise<Result<T, CommunicationError>> {
    this.logger.debug(`[MOCK COMM] UPLOAD ${path} from ${fileUri}`);
    await new Promise((r) => setTimeout(r, 800)); // Simulate transcription delay

    if (path === "/captures/transcribe") {
      // Simulate transcription return
      const mockTranscript = "This is a simulated transcript from the Mock Device Transport. The recording sync pipeline is fully functional in Dev Mode.";
      const newId = `mock-cap-uuid-${Date.now()}`;
      const newCapture: DeviceCaptureMetadata = {
        transaction_id: newId,
        captured_timestamp: new Date().toISOString(),
        audio_encoding: "WAV",
        sample_rate: 48000,
        channels: 1,
        audio_size_bytes: 180000,
        audio_md5: `md5newstub${Date.now()}`,
        transcript: mockTranscript,
        telemetry_metrics: {
          temperature_celsius: 22.1,
          humidity_percentage: 54.0,
          voc_parts_per_billion: 145,
          liquid_flow: {
            rate_liters_per_minute: 4.5,
            accumulated_volume_liters: 12.0
          }
        }
      };

      this.mockCaptures.unshift(newCapture);
      this._saveCaptures();

      return Result.ok({
        success: true,
        transcript: mockTranscript,
        duration: 3.75
      } as unknown as T);
    }

    return Result.fail(new CommunicationError(`Mock upload failed for path ${path}`, "REQUEST_FAILED"));
  }

  async download(
    path: string,
    resumeFromByte: number,
    onProgress?: (bytesReceived: number, totalBytes: number) => void,
  ): Promise<Result<ArrayBuffer, CommunicationError>> {
    this.logger.debug(`[MOCK COMM] DOWNLOAD ${path} starting at ${resumeFromByte}`);
    await new Promise((r) => setTimeout(r, 300));

    if (path.startsWith("/captures/")) {
      const id = path.replace("/captures/", "");
      const cap = this.mockCaptures.find(c => c.transaction_id === id);
      if (!cap) {
        return Result.fail(new CommunicationError("Capture not found", "NOT_FOUND"));
      }

      // Generate dummy audio buffer
      const size = cap.audio_size_bytes;
      if (onProgress) {
        onProgress(size, size);
      }
      return Result.ok(new ArrayBuffer(size));
    }

    return Result.fail(new CommunicationError("Not found", "NOT_FOUND"));
  }

  openStream(
    path: string,
    onMessage: (message: DeviceStreamMessage) => void,
    onError: (error: CommunicationError) => void,
  ): DeviceStream {
    this.logger.debug(`[MOCK COMM] Open WebSocket stream: ${path}`);
    const stream = new MockDeviceStream(onMessage, onError, this);
    this.activeStreams.add(stream);
    return stream;
  }

  async close(): Promise<void> {
    this.logger.debug("[MOCK COMM] Closing transport");
    for (const stream of this.activeStreams) {
      stream.close();
    }
    this.activeStreams.clear();
    this._isConnected = false;
  }

  public removeStream(stream: MockDeviceStream) {
    this.activeStreams.delete(stream);
  }

  public getLiveSensors() {
    return this._getLiveSensors();
  }
}

class MockDeviceStream implements DeviceStream {
  private _isOpen = true;
  private readonly onMessage: (message: DeviceStreamMessage) => void;
  private readonly onError: (error: CommunicationError) => void;
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly parent: MockDeviceTransport;

  constructor(
    onMessage: (message: DeviceStreamMessage) => void,
    onError: (error: CommunicationError) => void,
    parent: MockDeviceTransport
  ) {
    this.onMessage = onMessage;
    this.onError = onError;
    this.parent = parent;

    // Push telemetry updates every 3 seconds to update UI live status
    this.timer = setInterval(() => {
      if (this._isOpen) {
        this.onMessage({
          type: "telemetry",
          payload: this.parent.getLiveSensors(),
          timestamp: new Date().toISOString()
        });
      }
    }, 3000);
  }

  send(message: string): void {
    // Echo back or handle client requests
    if (message === "ping") {
      this.onMessage({
        type: "pong",
        payload: {},
        timestamp: new Date().toISOString()
      });
    }
  }

  close(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this._isOpen = false;
    this.parent.removeStream(this);
  }

  get isOpen(): boolean {
    return this._isOpen;
  }
}
