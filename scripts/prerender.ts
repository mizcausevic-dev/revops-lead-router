import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  renderBottlenecks,
  renderDocs,
  renderOverview,
  renderQueue,
  renderRoutingRules,
  renderVerification
} from "../src/services/render";
import { bottleneckLane, payload, queue, routingRules, summary, verification } from "../src/services/leadRouterService";

const root = path.resolve(process.cwd(), "site");
const domain = "revops.kineticgain.com";

async function write(relativePath: string, content: string) {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function main() {
  const pages = [
    { route: "index.html", html: renderOverview() },
    { route: "queue/index.html", html: renderQueue() },
    { route: "routing-rules/index.html", html: renderRoutingRules() },
    { route: "bottlenecks/index.html", html: renderBottlenecks() },
    { route: "verification/index.html", html: renderVerification() },
    { route: "docs/index.html", html: renderDocs() }
  ];

  for (const page of pages) {
    await write(page.route, page.html);
  }

  const json = [
    { route: "api/dashboard/summary/index.json", data: summary() },
    { route: "api/queue/index.json", data: queue() },
    { route: "api/routing-rules/index.json", data: routingRules() },
    { route: "api/bottlenecks/index.json", data: bottleneckLane() },
    { route: "api/verification/index.json", data: verification() },
    { route: "api/sample/index.json", data: payload() }
  ];

  for (const item of json) {
    await write(item.route, `${JSON.stringify(item.data, null, 2)}\n`);
  }

  await write("CNAME", `${domain}\n`);
  await write("robots.txt", `User-agent: *\nAllow: /\nSitemap: https://${domain}/sitemap.xml\n`);
  await write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map((page) => {
        const route = page.route === "index.html" ? "" : page.route.replace(/index\.html$/, "");
        return `  <url><loc>https://${domain}/${route}</loc></url>`;
      })
      .join("\n")}\n</urlset>\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
