import express from "express";

import { bottleneckLane, payload, queue, routingRules, summary, verification } from "./services/leadRouterService";
import {
  renderBottlenecks,
  renderDocs,
  renderOverview,
  renderQueue,
  renderRoutingRules,
  renderVerification
} from "./services/render";

const app = express();
const port = Number(process.env.PORT ?? 5258);

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/queue", (_req, res) => res.type("html").send(renderQueue()));
app.get("/routing-rules", (_req, res) => res.type("html").send(renderRoutingRules()));
app.get("/bottlenecks", (_req, res) => res.type("html").send(renderBottlenecks()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/queue", (_req, res) => res.json(queue()));
app.get("/api/routing-rules", (_req, res) => res.json(routingRules()));
app.get("/api/bottlenecks", (_req, res) => res.json(bottleneckLane()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

if (require.main === module) {
  app.listen(port, "127.0.0.1", () => {
    console.log(`RevOps Lead Router listening on http://127.0.0.1:${port}`);
  });
}

export default app;

