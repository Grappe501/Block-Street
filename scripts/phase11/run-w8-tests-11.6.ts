import { allOpsW8TestsPassed, runOpsW8ExecutiveTests } from "../../src/lib/civic-action/builds/11.6/executive/w8-tests";

const results = runOpsW8ExecutiveTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`11.6 W8 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(allOpsW8TestsPassed() ? 0 : 1);
