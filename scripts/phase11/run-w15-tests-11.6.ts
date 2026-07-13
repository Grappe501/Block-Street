import { runOpsW15CertificationTests } from "../../src/lib/civic-action/builds/11.6/certification/w15-tests";

const results = runOpsW15CertificationTests();
let failed = 0;
for (const r of results) {
  if (r.passed) console.log(`PASS: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  else {
    console.error(`FAIL: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
    failed++;
  }
}
console.log(`11.6 W15 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(failed > 0 ? 1 : 0);
