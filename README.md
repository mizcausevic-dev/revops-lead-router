# RevOps Lead Router

TypeScript control plane for lead enrichment, queue assignment, speed-to-lead posture, and CRM routing integrity.

- Live: `http://revops.kineticgain.com/`
- Routes: `/`, `/queue/`, `/routing-rules/`, `/bottlenecks/`, `/verification/`, `/docs/`
- APIs: `/api/dashboard/summary`, `/api/queue`, `/api/routing-rules`, `/api/bottlenecks`, `/api/verification`, `/api/sample`

## Why this exists

Revenue systems break long before pipeline dashboards admit it. The damage usually starts in the middle:
- good leads stall during enrichment
- routing rules conflict across named accounts, geography, and segment ownership
- marketing handoff logic sends too many leads into sales too early
- high-fit opportunities wait in admin lanes instead of reaching the right rep fast

`revops-lead-router` models that operational layer so Growth, RevOps, and sales leadership can inspect where routing is protecting revenue and where it is quietly eroding it.

## What this product does

`revops-lead-router` shows where inbound leads lose value between capture and seller action: enrichment gaps, conflicting routing rules, SLA misses, owner ambiguity, and queue decisions that are too slow or too early.

A SaaS go-to-market analyst can use it to inspect source quality, lead fit, routing latency, queue ownership, and conversion protection as one operating lane instead of scattered CRM exports. A SaaS value architect can use it to frame the economic case: preserved demand, faster response for high-fit leads, fewer bad handoffs, cleaner nurture separation, and fewer high-cost campaign leads wasted by broken routing logic.

Technically, the repo exposes queue records, routing rules, bottleneck lanes, JSON endpoints, prerendered pages, screenshots, and verification checks. The common Kinetic Gain pattern is turning an invisible operating failure into named owners, measurable pressure, evidence artifacts, and a board-readable next action.

## Routes

- `/`
- `/queue`
- `/routing-rules`
- `/bottlenecks`
- `/verification`
- `/docs`

## API

- `/api/dashboard/summary`
- `/api/queue`
- `/api/routing-rules`
- `/api/bottlenecks`
- `/api/verification`
- `/api/sample`

## Screenshots

![Overview](./screenshots/01-overview-proof.png)
![Queue](./screenshots/02-queue-proof.png)
![Rules](./screenshots/03-rules-proof.png)
![Bottlenecks](./screenshots/04-bottlenecks-proof.png)

## Local Development

```powershell
cd revops-lead-router
npm install
npm run dev
npm run prerender
```

Open:
- [http://127.0.0.1:5258/](http://127.0.0.1:5258/)
- [http://127.0.0.1:5258/queue](http://127.0.0.1:5258/queue)
- [http://127.0.0.1:5258/routing-rules](http://127.0.0.1:5258/routing-rules)
- [http://127.0.0.1:5258/bottlenecks](http://127.0.0.1:5258/bottlenecks)
- [http://127.0.0.1:5258/verification](http://127.0.0.1:5258/verification)

## Validation

- `npm run build`
- `npm run prerender`
- `npm run test`
- `npm run demo`
- `npm run smoke`
- `npm run render:assets`

## Docs

- [Architecture](./docs/architecture.md)
- [Origin](./docs/ORIGIN.md)
- [Changelog](./CHANGELOG.md)
