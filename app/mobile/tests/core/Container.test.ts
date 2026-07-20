import { Container } from "@core/di/Container";

describe("DI Container", () => {
  let container: Container;

  beforeEach(() => {
    container = Container.getInstance();
    container.clear();
  });

  it("should register and resolve constant value", () => {
    container.register("API_KEY", "vaha-secret-123");
    expect(container.resolve<string>("API_KEY")).toBe("vaha-secret-123");
  });

  it("should register and resolve singleton factories", () => {
    let callCount = 0;
    container.singleton("CONFIG", () => {
      callCount++;
      return { api: "https://vaha.io" };
    });

    const c1 = container.resolve<{ api: string }>("CONFIG");
    const c2 = container.resolve<{ api: string }>("CONFIG");

    expect(c1.api).toBe("https://vaha.io");
    expect(c1).toBe(c2);
    expect(callCount).toBe(1);
  });

  it("should register and resolve transient factories", () => {
    let callCount = 0;
    container.factory("RANDOM", () => {
      callCount++;
      return { value: Math.random() };
    });

    const r1 = container.resolve<{ value: number }>("RANDOM");
    const r2 = container.resolve<{ value: number }>("RANDOM");

    expect(r1).not.toBe(r2);
    expect(callCount).toBe(2);
  });

  it("should throw error on unresolved tokens", () => {
    expect(() => container.resolve("UNKNOWN")).toThrow();
  });
});
