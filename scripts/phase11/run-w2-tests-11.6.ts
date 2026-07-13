import { runOpsW2MissionTests, allOpsW2TestsPassed } from "../../src/lib/civic-action/builds/11.6/execution/w2-tests";

const results = runOpsW2MissionTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.6 W2 tests: ${passed} / ${results.length}`);
for (const r of results) {
  if (!r.passed) console.error(`FAIL ${r.name}${r.detail ? `: ${r.detail}` : ""}`);
}
process.exit(allOpsW2TestsPassed() ? 0 : 1);
