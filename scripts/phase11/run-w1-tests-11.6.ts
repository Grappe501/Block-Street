import { runOpsW1StrategyTests, allOpsW1TestsPassed } from "../../src/lib/civic-action/builds/11.6/w1-tests";

const results = runOpsW1StrategyTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.6 W1 tests: ${passed} / ${results.length}`);
for (const r of results.filter((t) => !t.passed)) {
  console.error(`FAIL: ${r.name} ${r.detail ?? ""}`);
}
process.exit(allOpsW1TestsPassed() ? 0 : 1);
