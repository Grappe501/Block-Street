import { allOpsW11TestsPassed, runOpsW11ResilienceTests } from "../../src/lib/civic-action/builds/11.6/resilience/w11-tests";

const results = runOpsW11ResilienceTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`11.6 W11 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(allOpsW11TestsPassed() ? 0 : 1);
