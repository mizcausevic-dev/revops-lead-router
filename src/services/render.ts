import { bottleneckLane, queue, routingRules, scoreBands, summary, verification } from "./leadRouterService";

function layout(title: string, active: string, body: string) {
  const nav = [
    ["/", "Overview"],
    ["/queue", "Lead queue"],
    ["/routing-rules", "Routing rules"],
    ["/bottlenecks", "Bottlenecks"],
    ["/verification", "Verification"],
    ["/docs", "Docs"]
  ]
    .map(
      ([href, label]) =>
        `<a href="${href}" class="nav-link${active === href ? " is-active" : ""}">${label}</a>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    :root {
      --bg: #071018;
      --panel: #111c2b;
      --panel-2: #0d1724;
      --panel-3: #132235;
      --text: #f4efe7;
      --muted: #a9b2c0;
      --border: rgba(113, 188, 210, 0.2);
      --teal: #55e7c1;
      --cyan: #3cc9f5;
      --violet: #9a7cff;
      --red: #ff8f9b;
      --amber: #ffd27d;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--text);
      font-family: "Segoe UI", Arial, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(154, 124, 255, 0.14), transparent 26%),
        radial-gradient(circle at top right, rgba(60, 201, 245, 0.12), transparent 24%),
        linear-gradient(180deg, #08111c 0%, #071018 100%);
    }
    a { color: inherit; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      padding: 22px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      background: rgba(8, 14, 22, 0.92);
      backdrop-filter: blur(16px);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      font-weight: 700;
      font-size: 22px;
      text-decoration: none;
    }
    .brand-mark {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--teal), var(--cyan));
      box-shadow: 0 0 18px rgba(85, 231, 193, 0.45);
      flex: 0 0 auto;
    }
    .nav {
      display: flex;
      gap: 18px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .nav-link {
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      padding: 10px 0;
      border-bottom: 2px solid transparent;
    }
    .nav-link.is-active {
      color: var(--text);
      border-color: var(--cyan);
    }
    .shell {
      max-width: 1440px;
      margin: 0 auto;
      padding: 28px;
    }
    .hero,
    .section,
    .table-card {
      border: 1px solid var(--border);
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(17,28,43,0.94) 0%, rgba(13,23,36,0.95) 100%);
      box-shadow: 0 18px 42px rgba(0,0,0,0.24);
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.9fr);
      gap: 26px;
      padding: 34px;
      margin-bottom: 24px;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--teal);
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 18px;
      padding: 9px 12px;
      border-radius: 999px;
      border: 1px solid rgba(85, 231, 193, 0.18);
      background: rgba(85, 231, 193, 0.07);
    }
    .hero-title {
      margin: 0 0 16px;
      max-width: 14ch;
      font: 700 clamp(62px, 7vw, 108px)/0.92 Georgia, serif;
      letter-spacing: -0.05em;
      text-wrap: balance;
    }
    .hero-copy {
      max-width: 70ch;
      margin: 0 0 22px;
      color: var(--muted);
      font-size: 20px;
      line-height: 1.6;
    }
    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 22px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 16px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      text-decoration: none;
      font-size: 13px;
      color: var(--muted);
      background: rgba(255,255,255,0.02);
    }
    .pill.is-primary {
      color: var(--text);
      border-color: rgba(60, 201, 245, 0.55);
      box-shadow: inset 0 0 0 1px rgba(60, 201, 245, 0.16);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }
    .stat {
      min-height: 148px;
      padding: 18px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(20, 33, 50, 0.85);
    }
    .stat-label {
      color: var(--teal);
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .stat-value {
      display: block;
      margin-bottom: 8px;
      font: 700 clamp(34px, 4vw, 54px)/1 "Segoe UI", Arial, sans-serif;
    }
    .stat-copy {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.55;
    }
    .hero-aside {
      display: grid;
      gap: 16px;
      align-content: start;
    }
    .aside-card {
      padding: 20px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(14, 24, 37, 0.9);
    }
    .aside-card h3, .section h3, .table-card h3 {
      margin: 0 0 10px;
      font: 700 30px/1.05 Georgia, serif;
      letter-spacing: -0.03em;
    }
    .aside-card p, .section-copy {
      margin: 0;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.6;
    }
    .mini-list {
      margin: 14px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 12px;
    }
    .mini-list li {
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
      color: var(--muted);
      font-size: 14px;
      line-height: 1.55;
    }
    .mini-list li:first-child {
      padding-top: 0;
      border-top: 0;
    }
    .mini-list strong {
      display: block;
      color: var(--text);
      margin-bottom: 4px;
    }
    .section {
      padding: 30px;
      margin-bottom: 24px;
    }
    .depth-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }
    .depth-card {
      padding: 22px;
      border-radius: 22px;
      border: 1px solid rgba(255,255,255,0.07);
      background:
        linear-gradient(180deg, rgba(19, 34, 53, 0.88), rgba(12, 23, 36, 0.9)),
        rgba(16, 28, 43, 0.92);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 18px 42px rgba(0,0,0,0.18);
    }
    .depth-card h4 {
      margin: 8px 0 8px;
      font-size: 19px;
      line-height: 1.25;
    }
    .depth-card p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.6;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    .grid.two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .card {
      min-height: 100%;
      padding: 22px;
      border-radius: 22px;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(16, 28, 43, 0.92);
    }
    .card h4 {
      margin: 0 0 8px;
      font-size: 18px;
      line-height: 1.25;
    }
    .card p {
      margin: 0 0 10px;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.65;
    }
    .card dl {
      margin: 0;
      display: grid;
      gap: 8px;
    }
    .card dt {
      color: var(--teal);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .card dd {
      margin: 0;
      color: var(--text);
      font-size: 14px;
      line-height: 1.55;
    }
    .table-card {
      padding: 24px;
      margin-bottom: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
    }
    th, td {
      text-align: left;
      padding: 14px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      vertical-align: top;
      font-size: 14px;
      line-height: 1.55;
    }
    th {
      color: var(--muted);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 9px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.08);
      color: var(--text);
      background: rgba(255,255,255,0.04);
    }
    .tag.watch {
      color: #1a1510;
      background: var(--amber);
      border-color: rgba(255, 210, 125, 0.5);
    }
    .tag.critical {
      color: #250d10;
      background: var(--red);
      border-color: rgba(255, 143, 155, 0.55);
    }
    .footer {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      align-items: center;
      justify-content: space-between;
      padding: 10px 2px 30px;
      color: var(--muted);
      font-size: 13px;
    }
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    .footer-links a {
      text-decoration: none;
      color: var(--muted);
    }
    @media (max-width: 1180px) {
      .hero { grid-template-columns: 1fr; }
      .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .depth-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid, .grid.two { grid-template-columns: 1fr; }
    }
    @media (max-width: 820px) {
      .topbar { padding: 18px 20px; }
      .shell { padding: 18px; }
      .hero, .section, .table-card { padding: 22px; }
      .hero-title { max-width: 100%; font-size: clamp(48px, 13vw, 76px); }
      .stats { grid-template-columns: 1fr; }
      .depth-grid { grid-template-columns: 1fr; }
      .nav { display: none; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">
      <span class="brand-mark"></span>
      <span>Kinetic Gain</span>
    </a>
    <nav class="nav">${nav}</nav>
  </header>
  <main class="shell">
    ${body}
    <footer class="footer">
      <span>RevOps Lead Router · revops.kineticgain.com</span>
      <div class="footer-links">
        <a href="https://github.com/mizcausevic-dev/revops-lead-router">GitHub</a>
        <a href="https://www.linkedin.com/in/mirzacausevic/">LinkedIn</a>
        <a href="https://kineticgain.com/">Kinetic Gain</a>
      </div>
    </footer>
  </main>
</body>
</html>`;
}

function renderProductDepth() {
  const cards = [
    {
      label: "Product depth",
      title: "What this product does",
      body: "Shows where inbound leads lose value between capture and seller action: enrichment gaps, conflicting rules, SLA misses, owner ambiguity, and queue decisions that are too slow or too early."
    },
    {
      label: "GTM analyst lens",
      title: "Where revenue teams use it",
      body: "A SaaS go-to-market analyst can inspect source quality, lead fit, routing latency, queue ownership, and conversion protection as one operating lane instead of scattered CRM exports."
    },
    {
      label: "Value architecture",
      title: "Where the money leaks",
      body: "The value case is preserved demand: faster response for high-fit leads, fewer bad handoffs, cleaner nurture separation, and fewer high-cost campaign leads wasted by broken routing logic."
    },
    {
      label: "Technical proof",
      title: "What is inspectable",
      body: "The repo exposes queue records, routing rules, bottleneck lanes, JSON endpoints, prerendered pages, screenshots, and verification checks so the routing posture can be reviewed."
    },
    {
      label: "Portfolio pattern",
      title: "What these repos have in common",
      body: "Each Kinetic Gain surface turns an invisible operating failure into named owners, measurable pressure, evidence artifacts, and a board-readable next action."
    }
  ];

  return `<section class="depth-grid" aria-label="Product depth">
    ${cards
      .map(
        (card) => `<article class="depth-card">
          <div class="eyebrow">${card.label}</div>
          <h4>${card.title}</h4>
          <p>${card.body}</p>
        </article>`
      )
      .join("")}
  </section>`;
}

export function renderOverview() {
  const stats = summary();
  const leads = queue().slice(0, 3);
  const bottlenecks = bottleneckLane();
  const rules = routingRules();

  return layout(
    "RevOps Lead Router",
    "/",
    `<section class="hero">
      <div>
        <div class="eyebrow">GTM Systems & Growth</div>
        <h1 class="hero-title">Which leads are losing value before the right team ever sees them?</h1>
        <p class="hero-copy">RevOps Lead Router turns enrichment gaps, routing conflicts, and SLA misses into a board-readable control plane for speed-to-lead, queue ownership, and conversion protection.</p>
        <div class="button-row">
          <a class="pill is-primary" href="/queue">Lead queue</a>
          <a class="pill" href="/routing-rules">Routing rules</a>
          <a class="pill" href="/bottlenecks">Bottlenecks</a>
          <a class="pill" href="/verification">Verification</a>
          <a class="pill" href="/docs">Docs</a>
        </div>
        <div class="stats">
          <div class="stat"><div class="stat-label">Leads tracked</div><span class="stat-value">${stats.leadCount}</span><div class="stat-copy">Modelled leads under active routing review.</div></div>
          <div class="stat"><div class="stat-label">Avg latency</div><span class="stat-value">${stats.averageLatencyMinutes}m</span><div class="stat-copy">Current queue drag before seller contact.</div></div>
          <div class="stat"><div class="stat-label">Inside SLA</div><span class="stat-value">${stats.routedWithinSla}</span><div class="stat-copy">Leads moving within the first-touch budget.</div></div>
          <div class="stat"><div class="stat-label">Critical lanes</div><span class="stat-value">${stats.criticalCount}</span><div class="stat-copy">Leads already at direct revenue risk.</div></div>
        </div>
      </div>
      <aside class="hero-aside">
        <div class="aside-card">
          <div class="eyebrow">Current pressure</div>
          <h3>${stats.recommendation}</h3>
          <p>Routing quality is not just CRM hygiene. It is the difference between preserving expensive demand and quietly throwing it into the wrong queue.</p>
        </div>
        <div class="aside-card">
          <div class="eyebrow">Blocked lanes</div>
          <ul class="mini-list">
            ${bottlenecks
              .slice(0, 3)
              .map(
                (item) =>
                  `<li><strong>${item.name}</strong>${item.blockedLeads} blocked leads · ${item.recommendation}</li>`
              )
              .join("")}
          </ul>
        </div>
        <div class="aside-card">
          <div class="eyebrow">Rule health</div>
          <ul class="mini-list">
            ${rules
              .map(
                (rule) =>
                  `<li><strong>${rule.name}</strong>${rule.targetQueue} · ${(rule.successRate * 100).toFixed(0)}% success · ${rule.medianLatencyMinutes}m median latency</li>`
              )
              .join("")}
          </ul>
        </div>
      </aside>
    </section>
    ${renderProductDepth()}
    <section class="table-card">
      <div class="eyebrow">Priority queue</div>
      <h3>Which leads need routing attention first</h3>
      <p class="section-copy">These are the leads where fit, urgency, or ownership pressure make delay most expensive.</p>
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
    </section>
    <section class="section">
      <div class="eyebrow">Score bands</div>
      <h3>Offer the right motion instead of forcing every lead into sales</h3>
      <p class="section-copy">Good routing protects conversion by sending each lead into the motion it has actually earned.</p>
      <div class="grid" style="margin-top:18px;">
        ${scoreBands()
          .map(
            (band) =>
              `<article class="card"><div class="eyebrow">${band.band}</div><h4>${band.leadCount} leads</h4><p>${band.meaning}</p></article>`
          )
          .join("")}
      </div>
    </section>`
  );
}

export function renderQueue() {
  return layout(
    "RevOps Lead Router — Queue",
    "/queue",
    `<section class="section">
      <div class="eyebrow">Lead queue</div>
      <h3>The live queue should show where money gets lost</h3>
      <p class="section-copy">Every row explains not just who the lead is, but why it belongs in that lane and what should happen next.</p>
    </section>
    <section class="table-card">
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
    </section>`
  );
}

export function renderRoutingRules() {
  return layout(
    "RevOps Lead Router — Rules",
    "/routing-rules",
    `<section class="section">
      <div class="eyebrow">Routing policy</div>
      <h3>Routing logic should be legible to marketing, sales, and ops</h3>
      <p class="section-copy">This lane translates enrichment and score posture into queues, not black-box assignments.</p>
    </section>
    <div class="grid two" style="margin-top:22px;">
      <section class="table-card">
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
      </section>
      <section class="section">
        <div class="eyebrow">What good looks like</div>
        <h3>Rule clarity beats more headcount</h3>
        <div class="grid" style="grid-template-columns:1fr; margin-top:18px;">
          <article class="card"><h4>Named-account precedence</h4><p>When routing rules conflict, the account strategy should win before geography or round-robin logic.</p></article>
          <article class="card"><h4>Async enrichment fallback</h4><p>Do not hold a qualified lead hostage while a data provider fills in secondary fields.</p></article>
          <article class="card"><h4>Growth lane integrity</h4><p>Self-serve or nurture paths should feel intentional, not like discarded lower-value leads.</p></article>
        </div>
      </section>
    </div>`
  );
}

export function renderBottlenecks() {
  return layout(
    "RevOps Lead Router — Bottlenecks",
    "/bottlenecks",
    `<section class="section">
      <div class="eyebrow">Revenue friction</div>
      <h3>The question is not “how many leads,” it is “where does the route break?”</h3>
      <p class="section-copy">These bottlenecks are modeled as policy defects, data defects, or ownership defects so the fix is obvious.</p>
    </section>
    <div class="grid two" style="margin-top:22px;">
      ${bottleneckLane()
        .map(
          (item) => `<article class="card"><div class="eyebrow">Blocked leads: ${item.blockedLeads}</div><h4>${item.name}</h4><p>${item.impact}</p><div class="tag ${item.blockedLeads >= 7 ? "critical" : "watch"}">${item.blockedLeads >= 7 ? "critical" : "watch"}</div><p style="margin-top:12px;">${item.recommendation}</p></article>`
        )
        .join("")}
    </div>`
  );
}

export function renderVerification() {
  return layout(
    "RevOps Lead Router — Verification",
    "/verification",
    `<section class="section">
      <div class="eyebrow">Verification</div>
      <h3>What this repo proves about routing integrity and conversion protection</h3>
      <div class="grid" style="grid-template-columns:1fr; margin-top:18px;">
        ${verification().map((item) => `<article class="card"><p>${item}</p></article>`).join("")}
      </div>
    </section>`
  );
}

export function renderDocs() {
  return layout(
    "RevOps Lead Router — Docs",
    "/docs",
    `<section class="section">
      <div class="eyebrow">Docs</div>
      <h3>A control plane for revenue routing, not just CRM decoration</h3>
      <p class="section-copy">This repo models the operational layer between demand capture and the first seller action: enrichment, score interpretation, queue assignment, ownership conflict handling, and SLA protection.</p>
      ${renderProductDepth()}
      <div class="grid two" style="margin-top:18px;">
        <article class="card">
          <h4>Routes</h4>
          <p><code>/</code> · <code>/queue</code> · <code>/routing-rules</code> · <code>/bottlenecks</code> · <code>/verification</code> · <code>/docs</code></p>
        </article>
        <article class="card">
          <h4>APIs</h4>
          <p><code>/api/dashboard/summary</code> · <code>/api/queue</code> · <code>/api/routing-rules</code> · <code>/api/bottlenecks</code> · <code>/api/verification</code> · <code>/api/sample</code></p>
        </article>
      </div>
    </section>`
  );
}
