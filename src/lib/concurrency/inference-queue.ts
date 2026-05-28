export type PlanType = "free" | "pro";

export type QueueJob<T> = {
  id: string;
  organizationId: string;
  plan: PlanType;
  enqueuedAt: number;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  onQueued?: (meta: {
    position: number;
    estimatedWaitSeconds: number;
  }) => void;
};

export type QueueLimits = {
  maxConcurrent: number;
  maxQueueFree: number;
  maxQueuePro: number;
  maxWaitSeconds: number;
  estimatedSecondsPerJob: number;
};

export function getQueueLimits(): QueueLimits {
  return {
    maxConcurrent: Number(process.env.INFERENCE_MAX_CONCURRENT ?? "1"),
    maxQueueFree: Number(process.env.QUEUE_MAX_WAIT_FREE ?? "3"),
    maxQueuePro: Number(process.env.QUEUE_MAX_WAIT_PRO ?? "8"),
    maxWaitSeconds: Number(process.env.QUEUE_MAX_WAIT_SECONDS ?? "300"),
    estimatedSecondsPerJob: Number(
      process.env.ESTIMATED_SECONDS_PER_JOB ?? "25",
    ),
  };
}

export function getMaxQueueForPlan(plan: PlanType, limits = getQueueLimits()): number {
  return plan === "pro" ? limits.maxQueuePro : limits.maxQueueFree;
}

export class InferenceQueue {
  private waiting: QueueJob<unknown>[] = [];
  private active = 0;
  private lastServedOrgIndex = 0;
  private readonly limits: QueueLimits;

  constructor(limits?: QueueLimits) {
    this.limits = limits ?? getQueueLimits();
  }

  getWaitingCount(): number {
    return this.waiting.length;
  }

  getActiveCount(): number {
    return this.active;
  }

  canEnqueue(plan: PlanType): boolean {
    const maxQueue = getMaxQueueForPlan(plan, this.limits);
    const samePlanWaiting = this.waiting.filter((j) => j.plan === plan).length;
    return samePlanWaiting < maxQueue;
  }

  getPosition(jobId: string): number {
    const index = this.waiting.findIndex((j) => j.id === jobId);
    return index === -1 ? 0 : index + 1;
  }

  estimateWaitSeconds(position: number): number {
    const jobsAhead = Math.max(0, position - 1);
    const activePenalty = this.active > 0 ? 1 : 0;
    return (jobsAhead + activePenalty) * this.limits.estimatedSecondsPerJob;
  }

  enqueue<T>(
    job: Omit<QueueJob<T>, "resolve" | "reject" | "enqueuedAt">,
  ): Promise<T> {
    if (!this.canEnqueue(job.plan)) {
      return Promise.reject(
        Object.assign(new Error("Queue is full"), { code: "QUEUE_FULL" }),
      );
    }

    return new Promise((resolveOuter, rejectOuter) => {
      const fullJob: QueueJob<T> = {
        ...job,
        enqueuedAt: Date.now(),
        resolve: resolveOuter,
        reject: rejectOuter,
      };

      if (this.active < this.limits.maxConcurrent) {
        void this.runJob(fullJob as QueueJob<unknown>);
        return;
      }

      this.waiting.push(fullJob as QueueJob<unknown>);
      const position = this.getPosition(fullJob.id);
      fullJob.onQueued?.({
        position,
        estimatedWaitSeconds: this.estimateWaitSeconds(position),
      });
    });
  }

  private sortWaiting(): void {
    this.waiting.sort((a, b) => {
      if (a.plan === "pro" && b.plan !== "pro") return -1;
      if (b.plan === "pro" && a.plan !== "pro") return 1;
      return a.enqueuedAt - b.enqueuedAt;
    });

    const orgIds = [...new Set(this.waiting.map((j) => j.organizationId))];
    if (orgIds.length <= 1) return;

    const byOrg = new Map<string, QueueJob<unknown>[]>();
    for (const job of this.waiting) {
      const list = byOrg.get(job.organizationId) ?? [];
      list.push(job);
      byOrg.set(job.organizationId, list);
    }

    const rotated: string[] = [];
    for (let i = 0; i < orgIds.length; i++) {
      rotated.push(orgIds[(this.lastServedOrgIndex + i) % orgIds.length]!);
    }

    const fair: QueueJob<unknown>[] = [];
    let added = true;
    while (added) {
      added = false;
      for (const orgId of rotated) {
        const list = byOrg.get(orgId);
        if (list && list.length > 0) {
          fair.push(list.shift()!);
          added = true;
        }
      }
    }

    this.waiting = fair;
    if (rotated.length > 0) {
      this.lastServedOrgIndex =
        (this.lastServedOrgIndex + 1) % rotated.length;
    }
  }

  private async runJob(job: QueueJob<unknown>): Promise<void> {
    this.active++;

    const waitMs = Date.now() - job.enqueuedAt;
    if (waitMs > this.limits.maxWaitSeconds * 1000) {
      this.active--;
      job.reject(
        Object.assign(new Error("Queue timeout"), { code: "QUEUE_TIMEOUT" }),
      );
      this.pump();
      return;
    }

    try {
      const result = await job.execute();
      job.resolve(result);
    } catch (error) {
      job.reject(error);
    } finally {
      this.active--;
      this.pump();
    }
  }

  private pump(): void {
    this.sortWaiting();
    while (
      this.active < this.limits.maxConcurrent &&
      this.waiting.length > 0
    ) {
      const next = this.waiting.shift()!;
      void this.runJob(next);
    }
  }
}

const globalForQueue = globalThis as unknown as {
  inferenceQueue?: InferenceQueue;
};

export function getInferenceQueue(): InferenceQueue {
  if (!globalForQueue.inferenceQueue) {
    globalForQueue.inferenceQueue = new InferenceQueue();
  }
  return globalForQueue.inferenceQueue;
}
