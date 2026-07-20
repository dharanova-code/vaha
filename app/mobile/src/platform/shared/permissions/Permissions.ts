export type PermissionType = "bluetooth" | "microphone" | "notifications";

export interface Permissions {
  check(permission: PermissionType): Promise<boolean>;
  request(permission: PermissionType): Promise<boolean>;
}
