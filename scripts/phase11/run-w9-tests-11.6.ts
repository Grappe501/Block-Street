import { allOpsW9TestsPassed, runOpsW9WorkflowTests } from "../../src/lib/civic-action/builds/11.6/workflows/w9-tests";

const results = runOpsW9WorkflowTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`11.6 W9 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(allOpsW9TestsPassed() ? 0 : 1);
