import { withRetry } from "@core/utils/Retry";

describe("withRetry Utility", () => {
  it("should return value immediately on first success", async () => {
    let callCount = 0;
    const task = async () => {
      callCount++;
      return "success";
    };

    const result = await withRetry(task, { maxAttempts: 3, backoffMs: 1 });
    expect(result).toBe("success");
    expect(callCount).toBe(1);
  });

  it("should retry actions on failures up to maxAttempts", async () => {
    let callCount = 0;
    const task = async () => {
      callCount++;
      if (callCount < 3) {
        throw new Error("temporary error");
      }
      return "recovered";
    };

    const result = await withRetry(task, { maxAttempts: 4, backoffMs: 1 });
    expect(result).toBe("recovered");
    expect(callCount).toBe(3);
  });

  it("should raise exception if maxAttempts is exceeded", async () => {
    let callCount = 0;
    const task = async () => {
      callCount++;
      throw new Error("permanent failure");
    };

    await expect(
      withRetry(task, { maxAttempts: 2, backoffMs: 1 }),
    ).rejects.toThrow("permanent failure");
    expect(callCount).toBe(2);
  });
});
