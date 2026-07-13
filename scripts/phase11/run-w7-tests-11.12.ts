import { runKnwW7OptimizationTests, allW7TestsPassed } from "../../src/lib/civic-action/builds/11.12/w7-tests";

const results = runKnwW7OptimizationTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.12 W7 tests: ${passed} / ${results.length}`);
for (const r of results.filter((t) => !t.passed)) {
  console.error(`FAIL: ${r.name} ${r.detail ?? ""}`);
}
process.exit(allW7TestsPassed() ? 0 : 1);
