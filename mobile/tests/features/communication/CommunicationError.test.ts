import {
  CommunicationError,
  DeviceNotFoundError,
  DeviceDisconnectedError,
  ApiVersionMismatchError,
  DeviceRequestError,
  ChecksumMismatchError,
  AuthenticationError,
} from "../../../src/core/errors/CommunicationError";

describe("CommunicationError hierarchy", () => {
  it("CommunicationError is an instance of Error", () => {
    const err = new CommunicationError("test");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(CommunicationError);
    expect(err.code).toBe("COMMUNICATION_ERROR");
    expect(err.message).toBe("test");
  });

  it("DeviceNotFoundError has correct name and default message", () => {
    const err = new DeviceNotFoundError();
    expect(err).toBeInstanceOf(CommunicationError);
    expect(err.name).toBe("DeviceNotFoundError");
    expect(err.message).toContain("not found");
  });

  it("DeviceDisconnectedError includes deviceId in message", () => {
    const err = new DeviceDisconnectedError("VAHA-88291-A");
    expect(err).toBeInstanceOf(CommunicationError);
    expect(err.name).toBe("DeviceDisconnectedError");
    expect(err.message).toContain("VAHA-88291-A");
  });

  it("ApiVersionMismatchError includes both versions", () => {
    const err = new ApiVersionMismatchError("v0", "v1");
    expect(err).toBeInstanceOf(CommunicationError);
    expect(err.name).toBe("ApiVersionMismatchError");
    expect(err.message).toContain("v0");
    expect(err.message).toContain("v1");
    expect(err.deviceVersion).toBe("v0");
    expect(err.minimumRequired).toBe("v1");
  });

  it("DeviceRequestError includes method, path and status code", () => {
    const err = new DeviceRequestError("GET", "/status", 401);
    expect(err).toBeInstanceOf(CommunicationError);
    expect(err.name).toBe("DeviceRequestError");
    expect(err.message).toContain("GET");
    expect(err.message).toContain("/status");
    expect(err.message).toContain("401");
    expect(err.method).toBe("GET");
    expect(err.path).toBe("/status");
    expect(err.statusCode).toBe(401);
  });

  it("ChecksumMismatchError includes transactionId", () => {
    const err = new ChecksumMismatchError("tx-99201-abc");
    expect(err).toBeInstanceOf(CommunicationError);
    expect(err.name).toBe("ChecksumMismatchError");
    expect(err.message).toContain("tx-99201-abc");
  });

  it("AuthenticationError has correct name", () => {
    const err = new AuthenticationError();
    expect(err).toBeInstanceOf(CommunicationError);
    expect(err.name).toBe("AuthenticationError");
  });
});
