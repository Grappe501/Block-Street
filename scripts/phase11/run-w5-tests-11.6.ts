import { allOpsW5TestsPassed, runOpsW5ResourceTests } from "../../src/lib/civic-action/builds/11.6/resources/w5-tests";

const results = runOpsW5ResourceTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`11.6 W5 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(allOpsW5TestsPassed() ? 0 : 1);
