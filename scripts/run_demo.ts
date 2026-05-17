import { payload, summary } from "../src/services/leadRouterService";

console.log("revops-lead-router demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(JSON.stringify(payload().rules, null, 2));

