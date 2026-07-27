import { AsyncQueue } from "@core/utils/AsyncQueue";

describe("AsyncQueue Utility", () => {
  it("should process actions sequentially", async () => {
    const queue = new AsyncQueue();
    const order: number[] = [];

    const t1 = () =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          order.push(1);
          resolve();
        }, 15);
      });

    const t2 = () =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          order.push(2);
          resolve();
        }, 5);
      });

    await Promise.all([queue.enqueue(t1), queue.enqueue(t2)]);

    expect(order).toEqual([1, 2]);
  });
});
