import { runObjW7OptimizationTests, allW7TestsPassed } from "../../src/lib/civic-action/builds/11.2/w7-tests";

const results = runObjW7OptimizationTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.2 W7 tests: ${passed} / ${results.length}`);
for (const r of results) {
  if (!r.passed) console.error(`  FAIL ${r.name}: ${r.detail ?? ""}`);
}
if (!allW7TestsPassed()) process.exit(1);
