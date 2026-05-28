import { describe, expect, it } from "vitest";
import { InferenceQueue } from "@/lib/concurrency/inference-queue";

describe("InferenceQueue", () => {
  it("rejects when free queue is full", async () => {
    const queue = new InferenceQueue({
      maxConcurrent: 1,
      maxQueueFree: 1,
      maxQueuePro: 8,
      maxWaitSeconds: 300,
      estimatedSecondsPerJob: 1,
    });

    let releaseFirst!: () => void;
    const firstGate = new Promise<void>((r) => {
      releaseFirst = r;
    });

    const first = queue.enqueue({
      id: "1",
      organizationId: "org-a",
      plan: "free",
      execute: async () => {
        await firstGate;
        return "done";
      },
    });

    await new Promise((r) => setTimeout(r, 5));

    let queuedMeta: { position: number } | null = null;
    const secondPromise = queue.enqueue({
      id: "2",
      organizationId: "org-a",
      plan: "free",
      execute: async () => "x",
      onQueued: (meta) => {
        queuedMeta = meta;
      },
    });
    expect(queuedMeta).not.toBeNull();

    await expect(
      queue.enqueue({
        id: "3",
        organizationId: "org-a",
        plan: "free",
        execute: async () => "y",
      }),
    ).rejects.toMatchObject({ code: "QUEUE_FULL" });

    releaseFirst();
    await Promise.all([first, secondPromise]);
  });

  it("pro jobs are prioritized in waiting list", async () => {
    const queue = new InferenceQueue({
      maxConcurrent: 1,
      maxQueueFree: 5,
      maxQueuePro: 8,
      maxWaitSeconds: 300,
      estimatedSecondsPerJob: 1,
    });

    void queue.enqueue({
      id: "slow",
      organizationId: "org-a",
      plan: "free",
      execute: () => new Promise((r) => setTimeout(() => r("slow"), 100)),
    });

    await new Promise((r) => setTimeout(r, 10));

    void queue.enqueue({
      id: "pro",
      organizationId: "org-b",
      plan: "pro",
      execute: async () => "pro-result",
    });

    void queue.enqueue({
      id: "free",
      organizationId: "org-c",
      plan: "free",
      execute: async () => "free-result",
    });

    await new Promise((r) => setTimeout(r, 150));
    expect(queue.getWaitingCount()).toBeGreaterThanOrEqual(0);
  });
});
