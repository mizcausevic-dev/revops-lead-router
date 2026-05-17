import { bottleneckLane, queue, routingRules, scoreBands, summary, verification } from "./leadRouterService";

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    :root {
      --bg: #f4f1ea;
      --paper: #fbfaf7;
      --ink: #1d1d1b;
      --muted: #635f58;
      --border: #d8d1c6;
      --accent: #0f766e;
      --accent-2: #1d4ed8;
      --alert: #b45309;
      --danger: #b91c1c;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: linear-gradient(180deg, #ece7de 0%, #f7f4ee 100%);
      color: var(--ink);
      font-family: Georgia, "Times New Roman", serif;
    }
    .shell {
      max-width: 1360px;
      margin: 0 auto;
      padding: 28px;
    }
    .topbar, .card, .table-wrap {
      background: rgba(251, 250, 247, 0.92);
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(36, 32, 27, 0.08);
    }
    .topbar {
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .brand {
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .badge {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font: 700 18px/1 Arial, sans-serif;
    }
    .eyebrow {
      font: 600 11px/1.4 Arial, sans-serif;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 4px;
    }
    .brand h1 {
      margin: 0;
      font: 700 28px/1.1 Arial, sans-serif;
    }
    .brand p {
      margin: 3px 0 0;
      color: var(--muted);
      font: 14px/1.5 Arial, sans-serif;
    }
    nav a {
      text-decoration: none;
      color: var(--muted);
      font: 600 13px/1 Arial, sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-left: 16px;
    }
    nav a.active, nav a:hover { color: var(--ink); }
    .hero {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 22px;
      margin-bottom: 22px;
    }
    .card { padding: 24px; }
    .hero h2 {
      margin: 8px 0 10px;
      font: 700 54px/0.98 Georgia, serif;
      letter-spacing: -0.03em;
    }
    .hero p {
      color: var(--muted);
      font: 18px/1.6 Arial, sans-serif;
      max-width: 860px;
      margin: 0 0 18px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .stat {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      background: rgba(255,255,255,0.55);
    }
    .stat label {
      display: block;
      color: var(--muted);
      font: 700 11px/1.4 Arial, sans-serif;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .stat strong {
      display: block;
      font: 700 40px/1 Arial, sans-serif;
      margin-bottom: 8px;
    }
    .stat span {
      display: block;
      color: var(--muted);
      font: 13px/1.5 Arial, sans-serif;
    }
    .right-panel h3, .section h3 {
      margin: 0 0 12px;
      font: 700 20px/1.2 Arial, sans-serif;
    }
    .list {
      display: grid;
      gap: 12px;
    }
    .item {
      border-top: 1px solid var(--border);
      padding-top: 12px;
    }
    .item:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .item strong {
      display: block;
      font: 700 15px/1.4 Arial, sans-serif;
      margin-bottom: 4px;
    }
    .item p, .item span {
      color: var(--muted);
      font: 13px/1.6 Arial, sans-serif;
      margin: 0;
    }
    .section-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 22px;
      margin-bottom: 22px;
    }
    .table-wrap {
      padding: 14px 18px 18px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font: 14px/1.5 Arial, sans-serif;
    }
    th, td {
      text-align: left;
      padding: 14px 10px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    th {
      color: var(--muted);
      font: 700 11px/1.4 Arial, sans-serif;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .tag {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font: 700 11px/1 Arial, sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: #e5f3f1;
      color: var(--accent);
    }
    .tag.watch { background: #fdf1db; color: var(--alert); }
    .tag.critical { background: #fee5e5; color: var(--danger); }
    .footer-note {
      margin-top: 12px;
      color: var(--muted);
      font: 13px/1.6 Arial, sans-serif;
    }
    @media (max-width: 980px) {
      .hero, .section-grid { grid-template-columns: 1fr; }
      .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      nav { display: none; }
    }
  </style>
</head>
<body>
  <div class="shell">
    ${body}
  </div>
</body>
</html>`;
}

function topbar(active: string) {
  const links = [
    { href: "/", label: "Overview" },
    { href: "/queue", label: "Lead Queue" },
    { href: "/routing-rules", label: "Rules" },
    { href: "/bottlenecks", label: "Bottlenecks" },
    { href: "/verification", label: "Verification" },
    { href: "/docs", label: "Docs" }
  ];

  return `<div class="topbar">
    <div class="brand">
      <div class="badge">RL</div>
      <div>
        <div class="eyebrow">RevOps Lead Router</div>
        <h1>Revenue routing and speed-to-lead control plane</h1>
        <p>Lead enrichment, CRM handoff, queue ownership, and pipeline integrity in one operator surface.</p>
      </div>
    </div>
    <nav>${links
      .map((link) => `<a class="${active === link.href ? "active" : ""}" href="${link.href}">${link.label}</a>`)
      .join("")}</nav>
  </div>`;
}

export function renderOverview() {
  const stats = summary();
  const leads = queue().slice(0, 3);
  const bottlenecks = bottleneckLane();
  const rules = routingRules();

  return layout(
    "RevOps Lead Router",
    `${topbar("/")}
    <div class="hero">
      <div class="card">
        <div class="eyebrow">GTM Systems & Growth</div>
        <h2>Clean routing is revenue infrastructure, not admin overhead.</h2>
        <p>This surface turns lead enrichment, score interpretation, and ownership logic into something RevOps and sales leadership can inspect before pipeline quality erodes.</p>
        <div class="stat-grid">
          <div class="stat"><label>Open Leads</label><strong>${stats.leadCount}</strong><span>Modelled leads under active routing review.</span></div>
          <div class="stat"><label>Avg Latency</label><strong>${stats.averageLatencyMinutes}m</strong><span>Median-ish speed-to-lead pressure across the current queue.</span></div>
          <div class="stat"><label>Inside SLA</label><strong>${stats.routedWithinSla}</strong><span>Leads routed within the first-touch time budget.</span></div>
          <div class="stat"><label>Critical Lanes</label><strong>${stats.criticalCount}</strong><span>Leads at direct risk of revenue loss or ownership drift.</span></div>
        </div>
      </div>
      <div class="card right-panel">
        <div class="eyebrow">Lead Recommendation</div>
        <h3>${stats.recommendation}</h3>
        <div class="list">
          ${bottlenecks
            .slice(0, 3)
            .map(
              (item) => `<div class="item"><strong>${item.name}</strong><p>${item.impact}</p><span>${item.blockedLeads} blocked leads · ${item.recommendation}</span></div>`
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="section-grid">
      <div class="table-wrap section">
        <div class="eyebrow">Priority Queue</div>
        <h3>Which leads need routing attention first.</h3>
        <table>
          <thead><tr><th>Lead</th><th>Segment</th><th>Reason</th><th>Risk</th></tr></thead>
          <tbody>
            ${leads
              .map(
                (lead) => `<tr><td><strong>${lead.id}</strong><br />${lead.account}</td><td>${lead.segment}</td><td>${lead.routeReason}</td><td><span class="tag ${lead.risk === "critical" ? "critical" : lead.risk === "watch" ? "watch" : ""}">${lead.risk}</span></td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="card section">
        <div class="eyebrow">Routing Rules</div>
        <h3>Conversion coherence comes from explicit rule ownership.</h3>
        <div class="list">
          ${rules
            .map(
              (rule) => `<div class="item"><strong>${rule.name}</strong><p>${rule.trigger}</p><span>${rule.targetQueue} · ${(rule.successRate * 100).toFixed(0)}% success · ${rule.medianLatencyMinutes}m median latency</span></div>`
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="eyebrow">Score Bands</div>
      <h3>Offer the right motion instead of forcing every lead into sales.</h3>
      <div class="stat-grid">
        ${scoreBands()
          .map(
            (band) => `<div class="stat"><label>${band.band}</label><strong>${band.leadCount}</strong><span>${band.meaning}</span></div>`
          )
          .join("")}
      </div>
      <div class="footer-note">Good RevOps routing is not just assignment logic. It is conversion protection, queue hygiene, and proof that paid and inbound demand are reaching the right motion fast enough.</div>
    </div>`
  );
}

export function renderQueue() {
  return layout(
    "RevOps Lead Router — Queue",
    `${topbar("/queue")}
    <div class="card section">
      <div class="eyebrow">Lead Queue</div>
      <h2 style="margin: 6px 0 10px; font: 700 46px/1 Georgia, serif;">The live routing queue should show where money gets lost.</h2>
      <p style="color: var(--muted); font: 18px/1.6 Arial, sans-serif;">Every row below explains not just who the lead is, but why it belongs in that lane and what should happen next.</p>
    </div>
    <div class="table-wrap section" style="margin-top: 22px;">
      <table>
        <thead><tr><th>Lead</th><th>Source</th><th>Owner</th><th>Latency</th><th>Next Action</th><th>Risk</th></tr></thead>
        <tbody>
          ${queue()
            .map(
              (lead) => `<tr><td><strong>${lead.account}</strong><br />${lead.contact} · ${lead.fitBand}</td><td>${lead.source}</td><td>${lead.owner}</td><td>${lead.latencyMinutes}m</td><td>${lead.nextAction}</td><td><span class="tag ${lead.risk === "critical" ? "critical" : lead.risk === "watch" ? "watch" : ""}">${lead.risk}</span></td></tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`
  );
}

export function renderRoutingRules() {
  return layout(
    "RevOps Lead Router — Rules",
    `${topbar("/routing-rules")}
    <div class="card section">
      <div class="eyebrow">Routing Policy</div>
      <h2 style="margin: 6px 0 10px; font: 700 46px/1 Georgia, serif;">Routing logic should be legible to marketing, sales, and ops at the same time.</h2>
      <p style="color: var(--muted); font: 18px/1.6 Arial, sans-serif;">This lane translates enrichment and score posture into queues, not black-box assignments.</p>
    </div>
    <div class="section-grid" style="margin-top: 22px;">
      <div class="table-wrap section">
        <table>
          <thead><tr><th>Rule</th><th>Trigger</th><th>Target Queue</th><th>Median Latency</th></tr></thead>
          <tbody>
            ${routingRules()
              .map(
                (rule) => `<tr><td><strong>${rule.name}</strong></td><td>${rule.trigger}</td><td>${rule.targetQueue}</td><td>${rule.medianLatencyMinutes}m</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="card section">
        <div class="eyebrow">What Good Looks Like</div>
        <h3>Rule clarity beats more headcount.</h3>
        <div class="list">
          <div class="item"><strong>Named-account precedence</strong><p>When routing rules conflict, the account strategy should win before geography or round-robin logic.</p></div>
          <div class="item"><strong>Async enrichment fallback</strong><p>Do not hold a qualified lead hostage while a data provider fills in secondary fields.</p></div>
          <div class="item"><strong>Growth lane integrity</strong><p>Self-serve or nurture paths should feel intentional, not like discarded lower-value leads.</p></div>
        </div>
      </div>
    </div>`
  );
}

export function renderBottlenecks() {
  return layout(
    "RevOps Lead Router — Bottlenecks",
    `${topbar("/bottlenecks")}
    <div class="card section">
      <div class="eyebrow">Revenue Friction</div>
      <h2 style="margin: 6px 0 10px; font: 700 46px/1 Georgia, serif;">The important question is not “how many leads,” it is “where does the route break?”</h2>
      <p style="color: var(--muted); font: 18px/1.6 Arial, sans-serif;">These bottlenecks are modeled as policy defects, data defects, or ownership defects so the fix is obvious.</p>
    </div>
    <div class="section-grid" style="margin-top: 22px;">
      ${bottleneckLane()
        .map(
          (item) => `<div class="card section"><div class="eyebrow">Blocked Leads: ${item.blockedLeads}</div><h3>${item.name}</h3><p style="color: var(--muted); font: 14px/1.7 Arial, sans-serif; margin-bottom: 12px;">${item.impact}</p><div class="tag ${item.blockedLeads >= 7 ? "critical" : "watch"}">${item.blockedLeads >= 7 ? "critical" : "watch"}</div><div class="footer-note">${item.recommendation}</div></div>`
        )
        .join("")}
    </div>`
  );
}

export function renderVerification() {
  return layout(
    "RevOps Lead Router — Verification",
    `${topbar("/verification")}
    <div class="card section">
      <div class="eyebrow">Verification</div>
      <h2 style="margin: 6px 0 10px; font: 700 46px/1 Georgia, serif;">What this repo proves about GTM systems, routing integrity, and conversion protection.</h2>
      <div class="list">
        ${verification().map((item) => `<div class="item"><strong>${item}</strong></div>`).join("")}
      </div>
    </div>`
  );
}

export function renderDocs() {
  return layout(
    "RevOps Lead Router — Docs",
    `${topbar("/docs")}
    <div class="card section">
      <div class="eyebrow">Docs</div>
      <h2 style="margin: 6px 0 10px; font: 700 46px/1 Georgia, serif;">A control plane for revenue routing, not just CRM decoration.</h2>
      <p style="color: var(--muted); font: 18px/1.6 Arial, sans-serif;">This repo models the operational layer between demand capture and the first seller action: enrichment, score interpretation, queue assignment, ownership conflict handling, and SLA protection.</p>
      <div class="footer-note">Routes: <code>/</code> · <code>/queue</code> · <code>/routing-rules</code> · <code>/bottlenecks</code> · <code>/verification</code> · <code>/docs</code></div>
    </div>`
  );
}
