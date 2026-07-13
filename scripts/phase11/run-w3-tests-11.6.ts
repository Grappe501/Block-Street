import { runOpsW3WorkforceTests, allOpsW3TestsPassed } from "../../src/lib/civic-action/builds/11.6/workforce/w3-tests";

const results = runOpsW3WorkforceTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.6 W3 tests: ${passed} / ${results.length}`);
for (const r of results) {
  if (!r.passed) console.error(`FAIL ${r.name}${r.detail ? `: ${r.detail}` : ""}`);
}
process.exit(allOpsW3TestsPassed() ? 0 : 1);
