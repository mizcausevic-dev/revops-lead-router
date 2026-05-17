import { bottlenecks, leadRecords, routeRules } from "../data/sampleLeads";

export function summary() {
  const averageLatency =
    Math.round(leadRecords.reduce((total, lead) => total + lead.latencyMinutes, 0) / leadRecords.length);
  const criticalCount = leadRecords.filter((lead) => lead.risk === "critical").length;
  const routedWithinSla = leadRecords.filter((lead) => lead.latencyMinutes <= 15).length;

  return {
    leadCount: leadRecords.length,
    averageLatencyMinutes: averageLatency,
    routedWithinSla,
    criticalCount,
    recommendation:
      "Resolve named-account precedence and asynchronous enrichment first so qualified leads keep the speed-to-lead advantage."
  };
}

export function queue() {
  return leadRecords;
}

export function routingRules() {
  return routeRules;
}

export function bottleneckLane() {
  return bottlenecks;
}

export function scoreBands() {
  return [
    { band: "Tier A", meaning: "Immediate sales engagement", leadCount: leadRecords.filter((lead) => lead.fitBand === "Tier A").length },
    { band: "Tier B", meaning: "Nurture and selective routing", leadCount: leadRecords.filter((lead) => lead.fitBand === "Tier B").length },
    { band: "Tier C", meaning: "Self-serve or low-touch growth lane", leadCount: leadRecords.filter((lead) => lead.fitBand === "Tier C").length }
  ];
}

export function verification() {
  return [
    "Speed-to-lead SLA modelled with queue-level latency and route ownership pressure.",
    "Routing rules expose buyer-facing reason strings instead of black-box score outcomes.",
    "Bottleneck lane shows where RevOps should change policy rather than just add more sales headcount."
  ];
}

export function payload() {
  return {
    dashboard: summary(),
    leads: queue(),
    rules: routingRules(),
    bottlenecks: bottleneckLane(),
    scoreBands: scoreBands(),
    verification: verification()
  };
}
