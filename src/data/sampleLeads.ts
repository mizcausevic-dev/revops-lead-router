export type LeadStage = "enriching" | "routing" | "working" | "stalled";
export type Segment = "enterprise" | "mid-market" | "partner" | "self-serve";
export type RiskLevel = "healthy" | "watch" | "critical";

export interface LeadRecord {
  id: string;
  account: string;
  contact: string;
  segment: Segment;
  source: string;
  score: number;
  fitBand: string;
  stage: LeadStage;
  owner: string;
  latencyMinutes: number;
  routeReason: string;
  nextAction: string;
  risk: RiskLevel;
}

export interface RouteRule {
  name: string;
  targetQueue: string;
  trigger: string;
  successRate: number;
  medianLatencyMinutes: number;
}

export interface Bottleneck {
  name: string;
  impact: string;
  blockedLeads: number;
  recommendation: string;
}

export const leadRecords: LeadRecord[] = [
  {
    id: "L-10421",
    account: "Northwind Health Partners",
    contact: "Avery Chen",
    segment: "enterprise",
    source: "Paid Search",
    score: 94,
    fitBand: "Tier A",
    stage: "routing",
    owner: "Enterprise SDR Pod",
    latencyMinutes: 11,
    routeReason: "Healthcare ICP + demo request + budget signal",
    nextAction: "Route to enterprise healthcare sequence and assign SDR within 15 minutes.",
    risk: "healthy"
  },
  {
    id: "L-10419",
    account: "Meridian Capital Ops",
    contact: "Lena Ortiz",
    segment: "mid-market",
    source: "Content Syndication",
    score: 72,
    fitBand: "Tier B",
    stage: "working",
    owner: "Mid-Market SDR",
    latencyMinutes: 43,
    routeReason: "Good fit, weak urgency, nurture-ready content conversion",
    nextAction: "Trigger comparison-guide nurture and score after product-page revisit.",
    risk: "watch"
  },
  {
    id: "L-10413",
    account: "Oak Street Advisors",
    contact: "Rory Patel",
    segment: "partner",
    source: "Referral",
    score: 88,
    fitBand: "Tier A",
    stage: "enriching",
    owner: "Partner Motion",
    latencyMinutes: 57,
    routeReason: "Partner referral with incomplete firmographic enrichment",
    nextAction: "Resolve enrichment gap before CRM handoff to partner AE.",
    risk: "critical"
  },
  {
    id: "L-10408",
    account: "Atlas Retail Group",
    contact: "Mina Ibrahim",
    segment: "enterprise",
    source: "LinkedIn Organic",
    score: 81,
    fitBand: "Tier A",
    stage: "stalled",
    owner: "Routing Review",
    latencyMinutes: 126,
    routeReason: "High-fit account, owner conflict between named-account and geo SDR rules",
    nextAction: "Escalate ownership conflict and preserve speed-to-lead SLA.",
    risk: "critical"
  },
  {
    id: "L-10396",
    account: "Sierra Works",
    contact: "Devon Blake",
    segment: "self-serve",
    source: "Direct / Demo",
    score: 66,
    fitBand: "Tier C",
    stage: "routing",
    owner: "Self-Serve Assist",
    latencyMinutes: 9,
    routeReason: "High intent, lower ACV, clean self-serve path",
    nextAction: "Offer trial onboarding CTA and upgrade follow-up after activation event.",
    risk: "healthy"
  }
];

export const routeRules: RouteRule[] = [
  {
    name: "Enterprise healthcare fast lane",
    targetQueue: "Enterprise SDR Pod",
    trigger: "Healthcare ICP + form intent + score over 90",
    successRate: 0.96,
    medianLatencyMinutes: 12
  },
  {
    name: "Partner-assisted handoff",
    targetQueue: "Partner Motion",
    trigger: "Referral source + channel partner domain match",
    successRate: 0.91,
    medianLatencyMinutes: 27
  },
  {
    name: "Self-serve activation path",
    targetQueue: "Growth Assist Queue",
    trigger: "Low ACV + strong product intent + no named account match",
    successRate: 0.94,
    medianLatencyMinutes: 8
  }
];

export const bottlenecks: Bottleneck[] = [
  {
    name: "Ownership conflict between named-account and geo routing",
    impact: "Enterprise leads wait too long while queue ownership is manually resolved.",
    blockedLeads: 7,
    recommendation: "Introduce named-account precedence before geo round-robin evaluation."
  },
  {
    name: "Incomplete firmographic enrichment on partner referrals",
    impact: "Qualified referrals miss the first-touch SLA while data vendors fill missing fields.",
    blockedLeads: 5,
    recommendation: "Fallback to partner queue immediately and enrich asynchronously after assignment."
  },
  {
    name: "Over-routing content conversions into sales too early",
    impact: "SDR time is consumed by leads better suited for nurture until stronger intent appears.",
    blockedLeads: 11,
    recommendation: "Raise route threshold and inject behavior-based nurture before sales handoff."
  }
];
