import { runOpsW13ImprovementTests } from "../../src/lib/civic-action/builds/11.6/improvement/w13-tests";

const results = runOpsW13ImprovementTests();
let failed = 0;
for (const r of results) {
  if (r.passed) console.log(`PASS: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  else {
    console.error(`FAIL: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
    failed++;
  }
}
console.log(`11.6 W13 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(failed > 0 ? 1 : 0);
