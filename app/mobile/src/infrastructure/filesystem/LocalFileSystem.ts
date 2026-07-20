import * as FileSystem from "expo-file-system";

export interface LocalFileSystem {
  writeText(path: string, content: string): Promise<void>;
  readText(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}

export class ExpoLocalFileSystem implements LocalFileSystem {
  public async writeText(path: string, content: string): Promise<void> {
    await FileSystem.writeAsStringAsync(path, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  }

  public async readText(path: string): Promise<string> {
    return await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  }

  public async deleteFile(path: string): Promise<void> {
    await FileSystem.deleteAsync(path, { idempotent: true });
  }
}
