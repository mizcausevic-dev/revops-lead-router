import { describe, expect, test } from "vitest";

import { bottleneckLane, payload, queue, routingRules, summary, verification } from "./services/leadRouterService";

describe("revops-lead-router", () => {
  test("summary exposes speed-to-lead and queue pressure", () => {
    const stats = summary();
    expect(stats.leadCount).toBe(5);
    expect(stats.averageLatencyMinutes).toBeGreaterThan(0);
    expect(stats.criticalCount).toBeGreaterThan(0);
  });

  test("routing rules and bottlenecks stay commercially legible", () => {
    expect(routingRules().length).toBe(3);
    expect(bottleneckLane().some((item) => item.blockedLeads >= 5)).toBe(true);
  });

  test("payload bundles the full operator surface", () => {
    expect(queue().length).toBe(5);
    expect(verification().length).toBe(3);
    expect(payload()).toHaveProperty("dashboard");
    expect(payload()).toHaveProperty("rules");
  });
});

