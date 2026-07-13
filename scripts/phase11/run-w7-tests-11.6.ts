import { allOpsW7TestsPassed, runOpsW7CommunicationsTests } from "../../src/lib/civic-action/builds/11.6/communications/w7-tests";

const results = runOpsW7CommunicationsTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`11.6 W7 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(allOpsW7TestsPassed() ? 0 : 1);
