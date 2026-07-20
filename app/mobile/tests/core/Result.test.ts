import { Result, left, right } from "@core/utils/Result";

describe("Result Monad", () => {
  it("should create successful Result", () => {
    const res = Result.ok<string, Error>("hello");
    expect(res.isSuccess).toBe(true);
    expect(res.getValueOrThrow()).toBe("hello");
    expect(() => res.getErrorOrThrow()).toThrow();
  });

  it("should create failure Result", () => {
    const error = new Error("failed");
    const res = Result.fail<string, Error>(error);
    expect(res.isSuccess).toBe(false);
    expect(res.getErrorOrThrow()).toBe(error);
    expect(() => res.getValueOrThrow()).toThrow();
  });
});

describe("Either Monad", () => {
  it("should handle Right value paths", () => {
    const val = right<string, number>(42);
    expect(val.isRight()).toBe(true);
    expect(val.isLeft()).toBe(false);
    expect(val.value).toBe(42);
  });

  it("should handle Left error paths", () => {
    const val = left<string, number>("error message");
    expect(val.isLeft()).toBe(true);
    expect(val.isRight()).toBe(false);
    expect(val.value).toBe("error message");
  });
});
